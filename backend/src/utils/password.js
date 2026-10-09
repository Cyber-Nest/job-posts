import crypto from "crypto";

/**
 * Hash password using PBKDF2 with SHA256
 */
export function hashPasswordSync(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Compare password against stored hash (supports PBKDF2 and plaintext fallback)
 */
export function comparePasswordSync(password, storedHash) {
  if (!storedHash) return false;
  
  // PBKDF2 hash format (salt:hash)
  if (storedHash.includes(":")) {
    const [salt, originalHash] = storedHash.split(":");
    const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(testHash, "hex"));
  }

  // Plaintext fallback comparison
  return password === storedHash;
}
