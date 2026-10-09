import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { PromoCode } from "@/lib/models/PromoCode";

const PACKAGES = ["Starter", "Deluxe", "Ultimate", "Pro Plan", "Unlimited"];

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const stats = await Promise.all(
      PACKAGES.map(async (packageName) => {
        const total = await PromoCode.countDocuments({ packageName });
        const used = await PromoCode.countDocuments({
          packageName,
          status: "Used",
        });
        const assigned = await PromoCode.countDocuments({
          packageName,
          assignedName: { $ne: null },
          status: "Unused",
        });

        return {
          packageName,
          total,
          used,
          unused: total - used,
          assigned,
          unassigned: total - used - assigned,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("COUPON STATS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats." },
      { status: 500 },
    );
  }
}
