import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { collection } from "@/server/db/mongo";
import type { UserDoc, OTPDoc } from "@/server/db/models";
import { sendOTP } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, purpose } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    if (!purpose || !["registration", "password_reset"].includes(purpose)) {
      return NextResponse.json(
        { error: "Valid purpose is required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    // For registration: check if email already exists
    if (purpose === "registration") {
      const users = await collection<UserDoc>("users");
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already registered. Please login." },
          { status: 409 },
        );
      }
    }

    // For password reset: check if email exists
    if (purpose === "password_reset") {
      const users = await collection<UserDoc>("users");
      const existingUser = await users.findOne({ email });
      if (!existingUser) {
        return NextResponse.json(
          { error: "No account found with this email." },
          { status: 404 },
        );
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs for this email and purpose
    const otps = await collection<OTPDoc>("otps");
    await otps.deleteMany({ email, purpose });

    // Save new OTP
    await otps.insertOne({
      id: randomUUID(),
      email,
      otp,
      purpose,
      expiresAt,
      createdAt: new Date(),
      used: false,
    });

    // Send email
    await sendOTP(email, otp, purpose);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}. Valid for 10 minutes.`,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code." },
      { status: 500 },
    );
  }
}
