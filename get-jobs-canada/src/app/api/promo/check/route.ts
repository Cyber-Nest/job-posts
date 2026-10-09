import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { PromoCode } from "@/lib/models/PromoCode";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const packageName = body.packageName?.trim();
    const promoCode = body.promoCode?.trim()?.toUpperCase();

    if (!packageName || !promoCode) {
      return NextResponse.json(
        { error: "Package and coupon code are required." },
        { status: 400 },
      );
    }

    const coupon = await PromoCode.findOne({
      code: promoCode,
      packageName,
      status: "Unused",
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or already used coupon code." },
        { status: 400 },
      );
    }

    // Must be assigned before it can be used
    if (!coupon.assignedEmail) {
      return NextResponse.json(
        { error: "Invalid or already used coupon code." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      message: "Coupon code is valid.",
    });
  } catch (error) {
    console.error("PROMO CHECK ERROR:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon code." },
      { status: 500 },
    );
  }
}
