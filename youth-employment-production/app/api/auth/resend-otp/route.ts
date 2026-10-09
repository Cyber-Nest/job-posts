import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { collection } from "@/server/db/mongo";
import type { OTPDoc } from "@/server/db/models";
import { sendOTP } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, purpose } = body;

    if (!email || !purpose) {
      return NextResponse.json(
        { error: "Email and purpose are required." },
        { status: 400 },
      );
    }

    const otps = await collection<OTPDoc>("otps");

    // Delete old OTPs
    await otps.deleteMany({ email, purpose });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
      message: "New verification code sent successfully.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Failed to resend code." },
      { status: 500 },
    );
  }
}
