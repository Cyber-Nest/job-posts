import { NextResponse, type NextRequest } from "next/server";
import { collection } from "@/server/db/mongo";
import type { AccountDoc, UserDoc } from "@/server/db/models";
import { hashPassword } from "@/server/auth/local-auth";

function validatePassword(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(password))
    return "Password must include at least one lowercase letter.";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must include at least one number.";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword, confirmPassword } = body;

    if (!email || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 },
      );
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    // Find user
    const users = await collection<UserDoc>("users");
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Update password
    const accounts = await collection<AccountDoc>("accounts");
    await accounts.updateOne(
      { userId: user.id, providerId: "credential" },
      { $set: { password: hashPassword(newPassword), updatedAt: new Date() } },
    );

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 },
    );
  }
}
