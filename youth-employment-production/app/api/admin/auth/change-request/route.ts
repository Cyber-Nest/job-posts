import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection, ensureIndexes } from "@/server/db/mongo";
import type { AdminDoc, OTPDoc } from "@/server/db/models";
import { decryptPassword } from "@/lib/admin/crypto";
import { sendOTP } from "@/lib/email";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const adminSession = await requireAdmin(request);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { newEmail, newPassword } = body;

    if (!newEmail && !newPassword) {
      return NextResponse.json(
        { error: "New email or new password is required." },
        { status: 400 },
      );
    }

    await ensureIndexes();
    const admins = await collection<AdminDoc>("admins");
    const currentAdmin = await admins.findOne({ email: adminSession.email.toLowerCase() });
    if (!currentAdmin) {
      return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    }

    // Verify if anything actually changed
    let hasChanged = false;
    let isEmailChanging = false;

    if (newEmail && newEmail.toLowerCase().trim() !== currentAdmin.email.toLowerCase()) {
      hasChanged = true;
      isEmailChanging = true;
    }

    if (newPassword && newPassword.trim() !== "") {
      const currentDecrypted = decryptPassword(currentAdmin.password);
      if (newPassword.trim() !== currentDecrypted) {
        hasChanged = true;
      }
    }

    if (!hasChanged) {
      return NextResponse.json(
        { error: "No changes detected from current credentials." },
        { status: 400 },
      );
    }

    // Check email change limit
    if (isEmailChanging && (currentAdmin.emailChangeCount || 0) >= 3) {
      return NextResponse.json(
        { error: "You have reached the maximum limit of 3 email changes." },
        { status: 400 },
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otps = await collection<OTPDoc>("otps");
    // Delete any existing change-request OTPs for this admin email
    await otps.deleteMany({
      email: currentAdmin.email.toLowerCase(),
      purpose: "admin_change",
    });

    // Create new verification entry
    await otps.insertOne({
      id: randomUUID(),
      email: currentAdmin.email.toLowerCase(),
      otp,
      purpose: "admin_change",
      expiresAt,
      createdAt: new Date(),
      used: false,
    });

    // Send OTP to old (current) admin email
    await sendOTP(currentAdmin.email, otp, "admin_change");

    // Return developer OTP if in development mode for easy testing (like other endpoints do)
    const responsePayload: any = {
      success: true,
      message: `Verification code sent to ${currentAdmin.email}.`,
    };

    if (process.env.NODE_ENV === "development") {
      responsePayload._devOtp = otp;
    }

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("CHANGE REQUEST ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to request credentials change." },
      { status: 500 },
    );
  }
}
