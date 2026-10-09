import { NextRequest, NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code =
      body.code?.trim()?.toUpperCase() || body.promoCode?.trim()?.toUpperCase();
    const packageName = body.packageName?.trim();

    if (!code || !packageName) {
      return NextResponse.json(
        { error: "Promo code and package name are required." },
        { status: 400 },
      );
    }

    const promoCodes = await collection("promoCodes");

    const promo = await promoCodes.findOne({
      code,
      packageName,
      status: "Unused",
    });

    if (!promo) {
      return NextResponse.json(
        { error: "Invalid or already redeemed promo code." },
        { status: 400 },
      );
    }

    // Must be assigned before it can be used
    if (!promo.assignedEmail) {
      return NextResponse.json(
        // { error: "This coupon has not been assigned yet and cannot be used." },
        { error: "Invalid promo code or already redeemed." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      message: "Promo code is valid.",
    });
  } catch (error) {
    console.error("PROMO CHECK ERROR:", error);
    return NextResponse.json(
      { error: "Failed to validate promo code." },
      { status: 500 },
    );
  }
}
