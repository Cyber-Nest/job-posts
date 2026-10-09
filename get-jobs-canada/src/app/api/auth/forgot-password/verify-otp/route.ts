import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Verification } from "@/lib/models/Verification";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const email = body.email?.toLowerCase().trim();
        const otp = body.otp?.trim();

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        const record = await Verification.findOne({
            identifier: email,
            purpose: "password_reset",
        }).sort({ createdAt: -1 });

        if (!record) {
            return NextResponse.json(
                { error: "No verification code found" },
                { status: 400 }
            );
        }

        if (record.verified) {
            await Verification.deleteMany({ identifier: email, purpose: "password_reset" });
            return NextResponse.json(
                { error: "Code already used" },
                { status: 400 }
            );
        }

        if (record.expiresAt < new Date()) {
            await Verification.deleteMany({ identifier: email, purpose: "password_reset" });
            return NextResponse.json(
                { error: "Code expired" },
                { status: 400 }
            );
        }

        if (record.value !== otp) {
            return NextResponse.json(
                { error: "Invalid code" },
                { status: 400 }
            );
        }

        record.verified = true;
        await record.save();

        return NextResponse.json({
            success: true,
            message: "Code verified successfully",
        });
    } catch (error) {
        console.error("OTP VERIFY ERROR:", error);
        return NextResponse.json(
            { error: "Failed to verify code" },
            { status: 500 }
        );
    }
}