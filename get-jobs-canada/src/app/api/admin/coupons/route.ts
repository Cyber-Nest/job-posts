import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { PromoCode } from "@/lib/models/PromoCode";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    const packageName = searchParams.get("packageName") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      parseInt(
        searchParams.get("limit") ||
          searchParams.get("pageSize") ||
          String(PAGE_SIZE),
        10,
      ),
    );
    const status = searchParams.get("status") || ""; // "Unused" | "Used" | ""
    const assigned = searchParams.get("assigned") || ""; // "true" | "false" | ""
    const search = searchParams.get("search") || "";

    if (!packageName) {
      return NextResponse.json(
        { error: "packageName is required." },
        { status: 400 },
      );
    }

    // Build filter
    const filter: Record<string, unknown> = { packageName };

    if (status === "Used" || status === "Unused") {
      filter.status = status;
    }

    if (assigned === "true") {
      filter.assignedName = { $ne: null };
    } else if (assigned === "false") {
      filter.assignedName = null;
    }

    if (search) {
      filter.code = { $regex: search.toUpperCase(), $options: "i" };
    }

    const total = await PromoCode.countDocuments(filter);

    const coupons = await PromoCode.find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "code packageName status assignedName assignedEmail assignedAt redeemedName redeemedEmail redeemedAt createdAt",
      )
      .lean();

    return NextResponse.json({
      success: true,
      coupons,
      pagination: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("COUPON LIST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons." },
      { status: 500 },
    );
  }
}
