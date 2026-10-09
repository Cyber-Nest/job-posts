import { NextResponse, type NextRequest } from "next/server";
import { collection } from "@/server/db/mongo";
import type { OTPDoc } from "@/server/db/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, purpose } = body;

    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { error: "Email, OTP, and purpose are required." },
        { status: 400 },
      );
    }

    const otps = await collection<OTPDoc>("otps");
    const validOTP = await otps.findOne({
      email,
      otp,
      purpose,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!validOTP) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 },
      );
    }

    // Mark OTP as used
    await otps.updateOne({ id: validOTP.id }, { $set: { used: true } });

    return NextResponse.json({
      success: true,
      message: "Verification code verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify code." },
      { status: 500 },
    );
  }
}
