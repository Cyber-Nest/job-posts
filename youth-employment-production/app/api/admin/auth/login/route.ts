import { NextRequest, NextResponse } from "next/server";
import { signAdminToken } from "@/lib/admin/adminAuth";
import { collection, ensureIndexes } from "@/server/db/mongo";
import type { AdminDoc } from "@/server/db/models";
import { decryptPassword } from "@/lib/admin/crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim()?.toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await ensureIndexes();
    const admins = await collection<AdminDoc>("admins");
    const admin = await admins.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Verify using decrypted password
    const decrypted = decryptPassword(admin.password);
    if (decrypted !== password) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = signAdminToken({ email, role: "admin" });

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully.",
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
    console.error("ADMIN LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Failed to process login request." },
      { status: 500 }
    );
  }
}
