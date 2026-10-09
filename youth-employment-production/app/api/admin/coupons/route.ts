import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";

const DEFAULT_PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const packageName = searchParams.get("packageName") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      parseInt(
        searchParams.get("limit") ||
          searchParams.get("pageSize") ||
          String(DEFAULT_PAGE_SIZE),
        10,
      ),
    );
    const status = searchParams.get("status") || ""; // "Unused" | "Used" | ""
    const assigned = searchParams.get("assigned") || ""; // "true" | "false" | ""
    const search = searchParams.get("search") || "";

    if (!packageName) {
      return NextResponse.json(
        { error: "packageName is required." },
        { status: 400 }
      );
    }

    const promoCodes = await collection("promoCodes");

    // Build filter
    const filter: Record<string, any> = { packageName };

    if (status === "Used" || status === "Unused") {
      filter.status = status;
    }

    if (assigned === "true") {
      filter.assignedEmail = { $ne: null };
    } else if (assigned === "false") {
      filter.assignedEmail = null;
    }

    if (search) {
      filter.code = { $regex: search.toUpperCase(), $options: "i" };
    }

    const total = await promoCodes.countDocuments(filter);

    const coupons = await promoCodes
      .find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

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
    console.error("GET COUPONS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons." },
      { status: 500 }
    );
  }
}
