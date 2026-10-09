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

        // Check if user exists in Better Auth
        const userCollection = mongoose.connection.collection("user");
        const existingUser = await userCollection.findOne({ email });

        if (!existingUser) {
            return NextResponse.json(
                { error: "No account found with this email address." },
                { status: 404 }
            );
        }

        // Generate OTP (6 digit)
        const otpCode = crypto.randomInt(100000, 1000000).toString();

        // Delete old OTPs
        await Verification.deleteMany({ 
            identifier: email, 
            purpose: "password_reset" 
        });

        // Save new OTP with userId
        await Verification.create({
            identifier: email,
            userId: existingUser._id.toString(),
            value: otpCode,
            verified: false,
            purpose: "password_reset",
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        // Send email
        let emailSent = false;
        try {
            await sendOTP(email, otpCode, "password_reset");
            emailSent = true;
        } catch (error) {
            console.error("Email sending failed:", error);
        }

        const isDev = process.env.NODE_ENV === "development";
        const responseData: any = {
            success: true,
            message: emailSent 
                ? "Verification code sent to your email" 
                : "Code generated",
        };

        if (isDev || !emailSent) {
            responseData._devOtp = otpCode;
            responseData.devMessage = "Development mode: Use this code";
        }

        return NextResponse.json(responseData);
    } catch (error: any) {
        console.error("FORGOT PASSWORD OTP SEND ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send verification code" },
            { status: 500 }
        );
    }
}