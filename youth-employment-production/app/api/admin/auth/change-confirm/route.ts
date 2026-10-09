import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, signAdminToken } from "@/lib/admin/adminAuth";
import { collection, ensureIndexes } from "@/server/db/mongo";
import type { AdminDoc, OTPDoc } from "@/server/db/models";
import { encryptPassword } from "@/lib/admin/crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const adminSession = await requireAdmin(request);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { otp, newEmail, newPassword } = body;

    if (!otp) {
      return NextResponse.json({ error: "OTP is required." }, { status: 400 });
    }

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

    // Verify OTP
    const otps = await collection<OTPDoc>("otps");
    const verification = await otps.findOne({
      email: currentAdmin.email.toLowerCase(),
      otp,
      purpose: "admin_change",
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 },
      );
    }

    if (new Date() > verification.expiresAt) {
      await otps.deleteOne({ _id: (verification as any)._id });
      return NextResponse.json(
        { error: "Verification code has expired." },
        { status: 400 },
      );
    }

    // OTP is valid! Let's update credentials
    const updatedData: Partial<AdminDoc> = {
      updatedAt: new Date(),
    };
    let isEmailChanging = false;

    if (newEmail && newEmail.toLowerCase().trim() !== currentAdmin.email.toLowerCase()) {
      isEmailChanging = true;
      if ((currentAdmin.emailChangeCount || 0) >= 3) {
        return NextResponse.json(
          { error: "You have reached the maximum limit of 3 email changes." },
          { status: 400 },
        );
      }
      updatedData.email = newEmail.toLowerCase().trim();
    }

    if (newPassword) {
      const encryptedPassword = encryptPassword(newPassword.trim());
      updatedData.password = encryptedPassword;
    }

    // Perform database update
    const updateObj: any = { $set: updatedData };
    if (isEmailChanging) {
      updateObj.$inc = { emailChangeCount: 1 };
    }

    await admins.updateOne({ _id: (currentAdmin as any)._id }, updateObj);

    // Delete verification code
    await otps.deleteOne({ _id: (verification as any)._id });

    // Generate new token so the session matches new email/creds
    const activeEmail = newEmail ? newEmail.toLowerCase().trim() : currentAdmin.email.toLowerCase();
    const token = signAdminToken({ email: activeEmail, role: "admin" });

    const response = NextResponse.json({
      success: true,
      message: "Credentials updated successfully.",
      email: activeEmail,
    });

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("CHANGE CONFIRM ERROR:", error);
    return NextResponse.json(
      { error: "Failed to verify code and update credentials." },
      { status: 500 },
    );
  }
}
