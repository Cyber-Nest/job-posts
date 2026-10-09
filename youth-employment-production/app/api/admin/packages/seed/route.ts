import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";
import { PackageDoc } from "@/server/db/models";
import { DEFAULT_PACKAGES } from "@/server/db/packages";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const packagesCollection = await collection<PackageDoc>("packages");
    const count = await packagesCollection.countDocuments({});

    if (count > 0) {
      return NextResponse.json(
        { error: "Database already has packages. No seeding required." },
        { status: 400 }
      );
    }

    const seededPackages = DEFAULT_PACKAGES.map((pkg) => ({
      ...pkg,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await packagesCollection.insertMany(seededPackages);

    return NextResponse.json({
      success: true,
      message: "Packages seeded successfully.",
    });
  } catch (error: any) {
    console.error("SEED PACKAGES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to seed packages." },
      { status: 500 }
    );
  }
}
