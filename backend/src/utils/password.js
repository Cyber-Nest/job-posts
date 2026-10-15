import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Hash password using PBKDF2 with SHA512
 */
export function hashPasswordSync(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Compare password against stored hash:
 * Supports:
 * - Bcrypt ($2a$, $2b$, $2y$)
 * - PBKDF2 (salt:hash)
 * - Plaintext fallback
 */
export function comparePasswordSync(password, storedHash) {
  if (!storedHash || !password) return false;

  try {
    // 1. Bcrypt hash format ($2a$, $2b$, $2y$)
    if (
      storedHash.startsWith("$2a$") ||
      storedHash.startsWith("$2b$") ||
      storedHash.startsWith("$2y$")
    ) {
      return bcrypt.compareSync(password, storedHash);
    }

    // 2. PBKDF2 hash format (salt:hash)
    if (storedHash.includes(":")) {
      const parts = storedHash.split(":");
      if (parts.length === 2 && parts[0].length === 32) {
        const [salt, originalHash] = parts;
        const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
        if (originalHash.length === testHash.length) {
          return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(testHash, "hex"));
        }
      }
    }

    // 3. Scrypt hash format (base64salt$base64derived from old youth-employment)
    if (storedHash.includes("$") && !storedHash.startsWith("$")) {
      const [salt, storedDerived] = storedHash.split("$");
      if (salt && storedDerived) {
        const saltBuffer = Buffer.from(salt, "base64");
        const storedBuffer = Buffer.from(storedDerived, "base64");
        const derived = crypto.scryptSync(password, saltBuffer, storedBuffer.length);
        if (derived.length === storedBuffer.length) {
          return crypto.timingSafeEqual(derived, storedBuffer);
        }
      }
    }

    // 4. Plaintext fallback comparison
    return password === storedHash;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

export async function comparePassword(password, storedHash) {
  return comparePasswordSync(password, storedHash);
}
