import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";
import { randomUUID } from "crypto";

const PACKAGES = [
  { name: "Starter", prefix: "ST" },
  { name: "Deluxe", prefix: "DE" },
  { name: "Ultimate", prefix: "UL" },
  { name: "Pro Plan", prefix: "PP" },
  { name: "Unlimited", prefix: "UN" }
];

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const promoCodes = await collection("promoCodes");

    let totalGenerated = 0;
    const now = new Date();

    for (const pkg of PACKAGES) {
      const count = await promoCodes.countDocuments({ packageName: pkg.name });
      if (count >= 100) {
        continue;
      }

      const needed = 100 - count;
      const codesToInsert = [];
      const generatedCodes = new Set<string>();

      const existingInDb = await promoCodes.find({ packageName: pkg.name }).project({ code: 1 }).toArray();
      const existingSet = new Set(existingInDb.map(x => x.code));

      while (codesToInsert.length < needed) {
        const randNum = Math.floor(10000 + Math.random() * 90000); // 5 digit number
        const code = `${pkg.prefix}-${randNum}-CA`;
        
        if (!generatedCodes.has(code) && !existingSet.has(code)) {
          generatedCodes.add(code);
          codesToInsert.push({
            id: randomUUID(),
            code,
            packageName: pkg.name,
            status: "Unused",
            assignedName: null,
            assignedEmail: null,
            assignedAt: null,
            redeemedName: null,
            redeemedEmail: null,
            redeemedAt: null,
            employerId: null,
            createdAt: now,
            updatedAt: now
          });
        }
      }

      if (codesToInsert.length > 0) {
        await promoCodes.insertMany(codesToInsert);
        totalGenerated += codesToInsert.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${totalGenerated} coupons.`,
    });
  } catch (error) {
    console.error("SEED COUPONS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to seed coupons." },
      { status: 500 }
    );
  }
}
