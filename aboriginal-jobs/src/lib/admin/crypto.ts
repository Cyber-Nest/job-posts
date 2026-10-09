import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

function getEncryptionKey(): Buffer {
  const secret = process.env.ADMIN_JWT_SECRET || "aboriginal-admin-jwt-secret-2024-secure-key";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypt plaintext string to iv:encryptedHex
 */
export function encryptPassword(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt iv:encryptedHex to plaintext
 */
export function decryptPassword(encryptedText: string): string {
  try {
    if (!encryptedText.includes(":")) {
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
