import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken, ADMIN_TOKEN_NAME } from "@/lib/admin/adminAuth";
import { connectDB } from "@/lib/db/mongoose";
import { Admin } from "@/lib/models/Admin";
import { decryptPassword } from "@/lib/admin/crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    await connectDB();
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    // Verify using decrypted password comparison
    const decrypted = decryptPassword(admin.password);
    if (decrypted !== password) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    const token = await generateAdminToken(email);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
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
    console.error("ADMIN LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 },
    );
  }
}
