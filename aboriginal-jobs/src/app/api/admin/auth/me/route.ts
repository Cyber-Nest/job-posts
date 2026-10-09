import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    email: admin.email,
  });
}
