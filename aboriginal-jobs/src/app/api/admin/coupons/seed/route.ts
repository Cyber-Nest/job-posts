import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { PromoCode } from "@/lib/models/PromoCode";

const PACKAGE_PREFIX: Record<string, string> = {
  Starter: "ST",
  Deluxe: "DE",
  Ultimate: "UL",
  "Pro Plan": "PP",
  Unlimited: "UN",
};

const TOTAL_PER_PACKAGE = 100;

function generateUniqueCode(prefix: string, usedCodes: Set<string>): string {
  let code: string;
  do {
    const num = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    code = `${prefix}-${num}-CA`;
  } while (usedCodes.has(code));
  usedCodes.add(code);
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const results: Record<string, number> = {};

    for (const [packageName, prefix] of Object.entries(PACKAGE_PREFIX)) {
      // Count existing coupons for this package
      const existingCount = await PromoCode.countDocuments({ packageName });

      if (existingCount >= TOTAL_PER_PACKAGE) {
        results[packageName] = 0; // Already has enough coupons
        continue;
      }

      const needed = TOTAL_PER_PACKAGE - existingCount;

      // Fetch existing codes to avoid duplicates
      const existingCodes = await PromoCode.find({ packageName }).select(
        "code",
      );
      const usedCodes = new Set(existingCodes.map((c) => c.code as string));

      // Also fetch ALL codes across all packages to ensure global uniqueness
      const allCodes = await PromoCode.find({}).select("code");
      allCodes.forEach((c) => usedCodes.add(c.code as string));

      const newCoupons: { code: string; packageName: string; status: string }[] =
        [];

      for (let i = 0; i < needed; i++) {
        const code = generateUniqueCode(prefix, usedCodes);
        newCoupons.push({
          code,
          packageName,
          status: "Unused",
        });
      }

      await PromoCode.insertMany(newCoupons, { ordered: false });
      results[packageName] = needed;
    }

    return NextResponse.json({
      success: true,
      message: "Coupons seeded successfully.",
      generated: results,
    });
  } catch (error) {
    console.error("SEED COUPONS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to seed coupons." },
      { status: 500 },
    );
  }
}
