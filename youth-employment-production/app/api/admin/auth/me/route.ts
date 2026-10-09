import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      email: admin.email,
    });
  } catch (error) {
    console.error("ADMIN ME ERROR:", error);
    return NextResponse.json(
      { error: "Failed to authenticate session." },
      { status: 500 }
    );
  }
}
