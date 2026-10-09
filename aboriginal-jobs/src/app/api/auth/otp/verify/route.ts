import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Verification } from "@/lib/models/Verification";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const normalizedEmail = body.email?.toLowerCase().trim();
    const otp = body.otp?.trim();

    // Validation
    if (!normalizedEmail || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    // Find the most recent OTP for this email
    const record = await Verification.findOne({
      identifier: normalizedEmail,
    }).sort({ createdAt: -1 });

    // OTP not found
    if (!record) {
      return NextResponse.json(
        { error: "No OTP found for this email. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if already verified
    if (record.verified) {
      // Clean up used OTP
      await Verification.deleteMany({ identifier: normalizedEmail });
      return NextResponse.json(
        { error: "OTP already used. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (record.expiresAt < new Date()) {
      await Verification.deleteMany({ identifier: normalizedEmail });
      return NextResponse.json(
        { error: "OTP expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (record.value !== otp) {
      // Optionally track failed attempts
      const failedAttempts = (record as any).failedAttempts || 0;
      if (failedAttempts + 1 >= 5) {
        // Too many failed attempts, delete OTP
        await Verification.deleteMany({ identifier: normalizedEmail });
        return NextResponse.json(
          { error: "Too many failed attempts. Please request a new OTP." },
          { status: 400 }
        );
      }
      
      await Verification.updateOne(
        { _id: record._id },
        { $inc: { failedAttempts: 1 } }
      );
      
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    record.verified = true;
    await record.save();

    await Verification.deleteMany({ 
      identifier: normalizedEmail, 
      verified: true,
      expiresAt: { $lt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("OTP VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}