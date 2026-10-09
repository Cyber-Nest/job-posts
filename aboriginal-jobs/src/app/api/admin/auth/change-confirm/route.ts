import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, generateAdminToken, ADMIN_TOKEN_NAME } from "@/lib/admin/adminAuth";
import { connectDB } from "@/lib/db/mongoose";
import { Admin } from "@/lib/models/Admin";
import { Verification } from "@/lib/models/Verification";
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

    await connectDB();
    const currentAdmin = await Admin.findOne({ email: adminSession.email.toLowerCase() });
    if (!currentAdmin) {
      return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    }

    // Verify OTP
    const verification = await Verification.findOne({
      identifier: currentAdmin.email.toLowerCase(),
      value: otp,
      purpose: "admin_change",
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 },
      );
    }

    if (new Date() > verification.expiresAt) {
      await Verification.deleteOne({ _id: verification._id });
      return NextResponse.json(
        { error: "Verification code has expired." },
        { status: 400 },
      );
    }

    // OTP is valid! Let's update credentials
    const updatedData: { email?: string; password?: string } = {};
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

    await Admin.updateOne({ _id: currentAdmin._id }, updateObj);

    // Delete verification code
    await Verification.deleteOne({ _id: verification._id });

    // Generate new token so the session matches new email/creds
    const activeEmail = newEmail ? newEmail.toLowerCase().trim() : currentAdmin.email.toLowerCase();
    const token = await generateAdminToken(activeEmail);

    const response = NextResponse.json({
      success: true,
      message: "Credentials updated successfully.",
      email: activeEmail,
    });

    response.cookies.set(ADMIN_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
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
