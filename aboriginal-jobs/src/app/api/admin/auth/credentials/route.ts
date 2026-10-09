import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { connectDB } from "@/lib/db/mongoose";
import { Admin } from "@/lib/models/Admin";
import { decryptPassword } from "@/lib/admin/crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const adminSession = await requireAdmin(request);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const admin = await Admin.findOne({ email: adminSession.email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      email: admin.email,
      password: decryptPassword(admin.password),
      emailChangeCount: admin.emailChangeCount || 0,
    });
  } catch (error) {
    console.error("GET CREDENTIALS ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    );
  }
}
