import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Verification } from "@/lib/models/Verification";
import mongoose from "mongoose";
import { hashPassword } from "better-auth/crypto";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    if (!mongoose.connection.db) {
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 },
      );
    }

    const body = await request.json();

    const email = body.email?.toLowerCase().trim();
    const otp = body.otp?.trim();
    const newPassword = body.newPassword?.trim();

    // Validation
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Verify OTP
    const record = await Verification.findOne({
      identifier: email,
      purpose: "password_reset",
      verified: true,
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 },
      );
    }

    // Check expiry
    if (record.expiresAt < new Date()) {
      await Verification.deleteMany({
        identifier: email,
        purpose: "password_reset",
      });

      return NextResponse.json(
        { error: "Verification code expired" },
        { status: 400 },
      );
    }

    const db = mongoose.connection.db;

    // Find user
    const userCollection = db.collection("user");

    const user = await userCollection.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash password
    const hashedPassword = await hashPassword(newPassword);
    // Better Auth account collection
    const accountCollection = db.collection("account");

    // Find account properly
    const existingAccount = await accountCollection.findOne({
      userId: user._id,
    });

    if (!existingAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Update password
    await accountCollection.updateOne(
      { _id: existingAccount._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    // Delete old sessions
    const sessionCollection = db.collection("session");

    await sessionCollection.deleteMany({
      userId: user._id,
    });

    // Delete verification records
    await Verification.deleteMany({
      identifier: email,
      purpose: "password_reset",
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful. Please login again.",
    });
  } catch (error: any) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to reset password",
      },
      {
        status: 500,
      },
    );
  }
}
