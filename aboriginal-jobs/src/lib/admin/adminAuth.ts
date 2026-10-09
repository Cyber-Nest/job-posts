import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Admin } from "@/lib/models/Admin";
import { encryptPassword, decryptPassword } from "./crypto";
const ADMIN_TOKEN_NAME = "admin_token";

/**
 * Encode a string to base64url
 */
function toBase64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}


async function hmacSign(data: string, secret: string): Promise<string> {
  const { createHmac } = await import("crypto");
  return createHmac("sha256", secret).update(data).digest("base64url");
}

/**
 * Generate admin token
 */
const ADMIN_TOKEN_EXPIRY_MS = 60 * 60 * 24 * 1000; // 1 day in milliseconds

export async function generateAdminToken(email: string): Promise<string> {
  const secret =
    process.env.ADMIN_JWT_SECRET || "admin-secret-fallback";
  const payload = toBase64url(JSON.stringify({ email, ts: Date.now() }));
  const sig = await hmacSign(payload, secret);
  return `${payload}.${sig}`;
}

/**
 * Verify admin token 
 */
export async function verifyAdminToken(
  token: string,
): Promise<{ email: string } | null> {
  try {
    const secret =
      process.env.ADMIN_JWT_SECRET || "admin-secret-fallback";
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;

    const expectedSig = await hmacSign(payload, secret);
    if (sig !== expectedSig) return null;

    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    );

    // Check token expiry — 1 day 
    if (!decoded.ts || Date.now() - decoded.ts > ADMIN_TOKEN_EXPIRY_MS) {
      return null;
    }

    // Verify against DB
    await connectDB();
    const admin = await Admin.findOne({ email: decoded.email.toLowerCase() });
    if (!admin) return null;

    return { email: decoded.email };
  } catch {
    return null;
  }
}

/**
 * Check if the incoming request has a valid admin cookie
 */
export async function requireAdmin(
  request: NextRequest,
): Promise<{ email: string } | null> {
  const token = request.cookies.get(ADMIN_TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export { ADMIN_TOKEN_NAME };

