import { NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";
import { PackageDoc } from "@/server/db/models";

export const dynamic = "force-dynamic";

// GET /api/packages — public endpoint for pricing page
export async function GET() {
  try {
    const packagesCollection = await collection<PackageDoc>("packages");
    const packages = await packagesCollection
      .find({ active: { $ne: false } })
      .sort({ order: 1 })
      .project({
        name: 1,
        originalPrice: 1,
        discountedPrice: 1,
        tagline: 1,
        badge: 1,
        features: 1,
        highlight: 1,
        darkVariant: 1,
        order: 1,
        credits: 1,
        expiryDays: 1,
        unlimitedJobs: 1,
        active: 1,
      })
      .toArray();

    return NextResponse.json({ success: true, packages });
  } catch (error: any) {
    console.error("GET PUBLIC PACKAGES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages." },
      { status: 500 }
    );
  }
}
