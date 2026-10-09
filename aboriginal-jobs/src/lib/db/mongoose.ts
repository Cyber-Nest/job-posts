/**
 * MongoDB connection setup using Mongoose
 * Simplified for Next.js — reads directly from process.env
 */

import mongoose from "mongoose";
import { encryptPassword } from "@/lib/admin/crypto";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env"
  );
}

// Global cache (prevents multiple connections in dev/hot reload)
let cached = (
  global as typeof globalThis & {
    mongoose?: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  }
).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI!, {
      dbName: process.env.MONGODB_DB_NAME || "aboriginal_jobs",
    });
  }

  cached!.conn = await cached!.promise;

  // Seed Admin if not exists
  try {
    const { Admin } = await import("../models/Admin");
    const count = await Admin.countDocuments();
    if (count === 0) {
      const email = process.env.ADMIN_EMAIL || "admin@gmail.com.ca";
      const password = process.env.ADMIN_PASSWORD || "Admin@12345";
      const encryptedPassword = encryptPassword(password);
      await Admin.create({
        email: email.toLowerCase(),
        password: encryptedPassword,
        emailChangeCount: 0,
      });
      console.log("Admin seeded to database (encrypted):", email);
    } else {
      // Auto-migrate any existing plain or bcrypt passwords in DB to encrypted format
      const admin = await Admin.findOne();
      if (admin) {
        const isBcrypt = admin.password.startsWith("$2") && admin.password.length === 60;
        const isPlaintext = !admin.password.includes(":");
        
        if (isBcrypt || isPlaintext) {
          const defaultPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
          const encrypted = encryptPassword(defaultPassword);
          await Admin.updateOne({ _id: admin._id }, { $set: { password: encrypted } });
          console.log("Admin password migrated/re-seeded to encrypted format in DB.");
        }
      }
    }
  } catch (error) {
    console.error("Error seeding admin in connectDB:", error);
  }

  return cached!.conn;
}

/**
 * Close MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  await mongoose.connection.close();
}

/**
 * Test MongoDB connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await connectDB();
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
}
