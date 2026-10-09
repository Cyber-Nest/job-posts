import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";
import { Verification } from "@/lib/models/Verification";
import { sendOTP } from "@/lib/mail/sendOTP";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists (for registration flow)
    const existingUser = await mongoose.connection
      .collection("user")
      .findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists. Please login instead." },
        { status: 400 }
      );
    }

    // Generate OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // Delete old OTPs for this email
    await Verification.deleteMany({ identifier: email });

    // Save OTP to database
    await Verification.create({
      identifier: email,
      value: otpCode,
      verified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    });

    
    try {
      await sendOTP(email, otpCode);
    } catch (error: any) {
      console.error("Email sending failed:", error);
    }

    //developer testing code

    // let emailSent = false;
    // let emailError = null;

    // try {
    //   await sendOTP(email, otpCode);
    //   emailSent = true;
    // } catch (error: any) {
    //   console.error("Email sending failed:", error);
    //   emailError = error.message;
    // }

    // For development: return OTP in response if email sending failed or in dev mode
    // const isDev = process.env.NODE_ENV === "development";
    // const responseData: any = {
    //   success: true,
    //   message: emailSent 
    //     ? "OTP sent successfully to your email" 
    //     : "OTP generated but email sending failed. Use the dev code below.",
    // };

    // // In development mode, always return the OTP for testing
    // if (isDev || !emailSent) {
    //   responseData._devOtp = otpCode;
    //   responseData.devMessage = "Development mode: Use this code to test";
    // }

    return NextResponse.json({success: true,message: "OTP sent successfully to your email"});
  } catch (error: any) {
    console.error("OTP SEND ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}