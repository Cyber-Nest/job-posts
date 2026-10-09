import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Package } from "@/lib/models/Package";

export const dynamic = "force-dynamic";

// GET /api/packages — public endpoint for pricing page 
export async function GET() {
  try {
    await connectDB();

    const packages = await Package.find({ active: { $ne: false } })
      .sort({ order: 1 })
      .select("name originalPrice discountedPrice tagline badge features highlight darkVariant order credits expiryDays unlimitedJobs active")
      .lean();

    return NextResponse.json({ success: true, packages });
  } catch (error) {
    console.error("GET PUBLIC PACKAGES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages." },
      { status: 500 },
    );
  }
}
