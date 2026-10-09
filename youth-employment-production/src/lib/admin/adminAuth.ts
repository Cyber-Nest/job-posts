import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { collection, ensureIndexes } from "@/server/db/mongo";
import type { AdminDoc } from "@/server/db/models";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "youth-employment-canada-admin-panel-secret-token";
const ADMIN_TOKEN_EXPIRY_MS = 60 * 60 * 24 * 1000; // 1 day in milliseconds

export function signAdminToken(payload: { email: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  // Include iat (issued at) timestamp for expiry verification
  const data = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString("base64url");
  const signature = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${data}`)
    .digest("base64url");
  return `${header}.${data}.${signature}`;
}

export function verifyAdminToken(token: string): { email: string; role: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    const expectedSignature = createHmac("sha256", JWT_SECRET)
      .update(`${header}.${data}`)
      .digest("base64url");
    
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    
    const decoded = JSON.parse(Buffer.from(data, "base64url").toString());

    // Check token expiry — reject tokens older than 1 day
    if (!decoded.iat || Date.now() - decoded.iat > ADMIN_TOKEN_EXPIRY_MS) {
      return null;
    }

    return { email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest): Promise<{ email: string } | null> {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return null;
    
    const decoded = verifyAdminToken(token);
    if (!decoded || decoded.role !== "admin") return null;
    
    // Verify in database
    await ensureIndexes();
    const admins = await collection<AdminDoc>("admins");
    const admin = await admins.findOne({ email: decoded.email.toLowerCase() });
    if (!admin) return null;
    
    return { email: decoded.email };
  } catch {
    return null;
  }
}
