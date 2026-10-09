import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const assignedName = body.assignedName?.trim();
    const assignedEmail = body.assignedEmail?.trim();

    if (!assignedName || !assignedEmail) {
      return NextResponse.json(
        { error: "Assignee name and email are required." },
        { status: 400 }
      );
    }

    const promoCodes = await collection("promoCodes");

    const coupon = await promoCodes.findOne({ id });
    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found." },
        { status: 404 }
      );
    }

    if (coupon.status === "Used") {
      return NextResponse.json(
        { error: "Coupon is already used and cannot be assigned." },
        { status: 400 }
      );
    }

    const now = new Date();
    await promoCodes.updateOne(
      { id },
      {
        $set: {
          assignedName,
          assignedEmail,
          assignedAt: now,
          updatedAt: now
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: "Coupon assigned successfully."
    });
  } catch (error) {
    console.error("ASSIGN COUPON ERROR:", error);
    return NextResponse.json(
      { error: "Failed to assign coupon." },
      { status: 500 }
    );
  }
}
