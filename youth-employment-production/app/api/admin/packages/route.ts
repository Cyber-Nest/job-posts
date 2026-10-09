import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";
import { PackageDoc } from "@/server/db/models";

// Fixed package names — cannot be changed
const ALLOWED_NAMES = ["Starter", "Deluxe", "Ultimate", "Pro Plan", "Unlimited"];

// GET /api/admin/packages — fetch all 5 packages
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const packagesCollection = await collection<PackageDoc>("packages");
    const packages = await packagesCollection.find({}).sort({ order: 1 }).toArray();

    return NextResponse.json({ success: true, packages });
  } catch (error: any) {
    console.error("GET ADMIN PACKAGES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages." },
      { status: 500 },
    );
  }
}

// PUT /api/admin/packages — update a package (name is read-only)
export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      originalPrice,
      discountedPrice,
      tagline,
      badge,
      features,
      credits,
      expiryDays,
      unlimitedJobs,
      active,
    } = body;

    // Validate name is one of the fixed 5
    if (!name || !ALLOWED_NAMES.includes(name)) {
      return NextResponse.json(
        { error: "Invalid package name. Package names cannot be changed." },
        { status: 400 },
      );
    }

    // Validate prices
    if (
      typeof originalPrice !== "number" || originalPrice <= 0 ||
      typeof discountedPrice !== "number" || discountedPrice < 0
    ) {
      return NextResponse.json(
        { error: "Valid prices are required." },
        { status: 400 },
      );
    }

    // Validate credits and expiry
    if (typeof credits !== "number" || credits < 0) {
      return NextResponse.json(
        { error: "Valid credits count is required (0 or more)." },
        { status: 400 },
      );
    }

    if (typeof expiryDays !== "number" || expiryDays <= 0) {
      return NextResponse.json(
        { error: "Valid expiry days count is required (greater than 0)." },
        { status: 400 },
      );
    }

    // Validate features
    if (!Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        { error: "At least one feature is required." },
        { status: 400 },
      );
    }

    const packagesCollection = await collection<PackageDoc>("packages");

    const updated = await packagesCollection.findOneAndUpdate(
      { name },
      {
        $set: {
          originalPrice,
          discountedPrice,
          tagline: tagline?.trim() || `FEATURES OF ${name.toUpperCase()} PLAN`,
          badge: badge?.trim() || "",
          features: features.map((f: string) => f.trim()).filter(Boolean),
          credits,
          expiryDays,
          unlimitedJobs: !!unlimitedJobs,
          active: active === undefined ? true : !!active,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Package not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${name} package updated successfully.`,
      package: updated,
    });
  } catch (error: any) {
    console.error("PUT PACKAGE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update package." },
      { status: 500 },
    );
  }
}
