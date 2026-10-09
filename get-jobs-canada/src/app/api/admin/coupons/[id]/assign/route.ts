import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { PromoCode } from "@/lib/models/PromoCode";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const assignedName = body.assignedName?.trim();
    const assignedEmail = body.assignedEmail?.trim()?.toLowerCase();

    if (!assignedName || !assignedEmail) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    const coupon = await PromoCode.findById(id);

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found." },
        { status: 404 },
      );
    }

    if (coupon.status === "Used") {
      return NextResponse.json(
        { error: "Cannot assign an already used coupon." },
        { status: 400 },
      );
    }

    if (coupon.assignedName) {
      return NextResponse.json(
        { error: "Coupon is already assigned." },
        { status: 400 },
      );
    }

    coupon.assignedName = assignedName;
    coupon.assignedEmail = assignedEmail;
    coupon.assignedAt = new Date();

    await coupon.save();

    return NextResponse.json({
      success: true,
      message: "Coupon assigned successfully.",
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        assignedName: coupon.assignedName,
        assignedEmail: coupon.assignedEmail,
        assignedAt: coupon.assignedAt,
      },
    });
  } catch (error) {
    console.error("ASSIGN COUPON ERROR:", error);
    return NextResponse.json(
      { error: "Failed to assign coupon." },
      { status: 500 },
    );
  }
}
