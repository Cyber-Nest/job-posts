import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";

const PACKAGES = ["Starter", "Deluxe", "Ultimate", "Pro Plan", "Unlimited"];

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const promoCodes = await collection("promoCodes");
    const stats = [];

    for (const pkg of PACKAGES) {
      const total = await promoCodes.countDocuments({ packageName: pkg });
      const used = await promoCodes.countDocuments({ packageName: pkg, status: "Used" });
      const unused = await promoCodes.countDocuments({ packageName: pkg, status: "Unused" });
      const assigned = await promoCodes.countDocuments({ packageName: pkg, assignedEmail: { $ne: null } });
      const unassigned = await promoCodes.countDocuments({ packageName: pkg, assignedEmail: null });

      stats.push({
        packageName: pkg,
        total,
        used,
        unused,
        assigned,
        unassigned
      });
    }

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("STATS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats." },
      { status: 500 }
    );
  }
}
