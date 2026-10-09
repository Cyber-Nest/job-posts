/**
 * BetterAuth Server Configuration for Next.js
 * Uses MongoDB adapter with Mongoose
 */

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";

let _auth: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (_auth) return _auth;

  // Ensure MongoDB connection
  await connectDB();

  const authSecret = process.env.BETTER_AUTH_SECRET;

  if (!authSecret) {
    throw new Error("BETTER_AUTH_SECRET is missing");
  }

  const auth = betterAuth({
    database: mongodbAdapter(mongoose.connection.db!),

    secret: authSecret,

    baseURL:
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000",

    trustedOrigins: [
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ],

    emailAndPassword: {
      enabled: true,
    },

    session: {
      // Session expire in 1 day
      expiresIn: 60 * 60 * 24, // 86400 seconds = 1 day
      updateAge: 0,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24, // Cookie expire in 1 day
      },
    },
  });

  _auth = auth as ReturnType<typeof betterAuth>;

  return auth;
}

export type Session = Awaited<ReturnType<typeof getAuth>>["$Infer"]["Session"];
export type User = Awaited<
  ReturnType<typeof getAuth>
>["$Infer"]["Session"]["user"];
