import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { Package, DEFAULT_PACKAGES } from "@/lib/models/Package";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const count = await Package.countDocuments();
    if (count > 0) {
      return NextResponse.json(
        { error: "Database already has packages. No seeding required." },
        { status: 400 }
      );
    }

    await Package.insertMany(DEFAULT_PACKAGES);

    return NextResponse.json({
      success: true,
      message: "Packages seeded successfully.",
    });
  } catch (error) {
    console.error("SEED PACKAGES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to seed packages." },
      { status: 500 }
    );
  }
}
