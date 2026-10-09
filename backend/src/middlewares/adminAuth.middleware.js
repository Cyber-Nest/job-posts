import { env } from "../config/env.js";
import { Admin } from "../modules/admin/admin.model.js";
import { hmacSign } from "../utils/crypto.js";

const ADMIN_TOKEN_EXPIRY_MS = 60 * 60 * 24 * 1000; // 24 hours

export async function verifyAdminToken(token) {
  try {
    if (!token) return null;

    const secret = env.ADMIN_JWT_SECRET;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;

    const expectedSig = hmacSign(payload, secret);
    if (sig !== expectedSig) return null;

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));

    if (!decoded.ts || Date.now() - decoded.ts > ADMIN_TOKEN_EXPIRY_MS) {
      return null;
    }

    const admin = await Admin.findOne({ email: decoded.email.toLowerCase() });
    if (!admin) return null;

    return { email: decoded.email, adminId: admin._id };
  } catch (error) {
    return null;
  }
}

export async function adminAuthMiddleware(req, res, next) {
  try {
    const token =
      req.cookies?.admin_token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, error: "Admin authentication required." });
    }

    const admin = await verifyAdminToken(token);
    if (!admin) {
      return res.status(401).json({ success: false, error: "Invalid or expired admin session." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Admin authentication failed." });
  }
}
