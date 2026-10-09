import crypto from "crypto";
import { env } from "../config/env.js";

const ALGORITHM = "aes-256-cbc";

function getEncryptionKey() {
  const secret = env.ADMIN_JWT_SECRET || "getjobscanada-admin-jwt-secret-2024-secure-key";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypt plaintext string to iv:encryptedHex
 */
export function encryptPassword(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt iv:encryptedHex to plaintext
 */
export function decryptPassword(encryptedText) {
  try {
    if (!encryptedText || !encryptedText.includes(":")) {
      return encryptedText; // Plaintext fallback
    }
    const parts = encryptedText.split(":");
    const iv = Buffer.from(parts.shift() || "", "hex");
    const encrypted = parts.join(":");
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    return encryptedText;
  }
}

/**
 * Generate HMAC-SHA256 signature for admin JWT tokens
 */
export function hmacSign(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

/**
 * Helper to encode string to base64url
 */
export function toBase64url(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
