import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { getAuth } from "@/lib/auth/auth";

import { Employer } from "@/lib/models/Employer";
import { PromoCode } from "@/lib/models/PromoCode";
import { EmployerPackage } from "@/lib/models/EmployerPackage";
import { EmployerPackageHistory } from "@/lib/models/EmployerPackageHistory";
import { PaymentTransaction } from "@/lib/models/PaymentTransaction";
import { Package } from "@/lib/models/Package";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const packageName = body.packageName?.trim();
    const promoCode = body.promoCode?.trim()?.toUpperCase();

    if (!packageName || !promoCode) {
      return NextResponse.json(
        { error: "Package and coupon code are required." },
        { status: 400 },
      );
    }

    const selectedPackage = await Package.findOne({ name: packageName });

    if (!selectedPackage) {
      return NextResponse.json(
        { error: "Invalid package selected." },
        { status: 400 },
      );
    }

    const employer = await Employer.findOne({
      authUserId: session.user.id,
    });

    if (!employer) {
      return NextResponse.json(
        { error: "Employer not found." },
        { status: 404 },
      );
    }

    // PRE-CHECK: coupon must exist AND be assigned
    const existingCoupon = await PromoCode.findOne({
      code: promoCode,
      packageName,
      status: "Unused",
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { error: "Invalid coupon code or coupon has already been used." },
        { status: 400 },
      );
    }

    // Guard: coupon must be assigned before use
    if (!existingCoupon.assignedEmail) {
      return NextResponse.json(
        { error: "Invalid coupon code or coupon has already been used." },
        { status: 400 },
      );
    }

    // ATOMIC REDEMPTION — findOneAndUpdate with status check to prevent race conditions
    // Only succeeds if coupon is still "Unused" and is assigned at the time of update
    const redeemedCoupon = await PromoCode.findOneAndUpdate(
      {
        code: promoCode,
        packageName,
        status: "Unused",
        assignedEmail: { $ne: null }, // extra safety: only redeem if assigned
      },
      {
        $set: {
          status: "Used",
          redeemedName: session.user.name || session.user.email,
          redeemedEmail: session.user.email,
          redeemedAt: new Date(),
          employerId: employer._id,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!redeemedCoupon) {
      return NextResponse.json(
        { error: "Invalid coupon code or coupon has already been used." },
        { status: 400 },
      );
    }

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + selectedPackage.expiryDays);

    // PACKAGE UPDATE

    const existingPackage = await EmployerPackage.findOne({
      employerId: employer._id,
    });

    if (existingPackage) {
      existingPackage.packageName = packageName;
      existingPackage.unlimitedJobs = selectedPackage.unlimitedJobs;
      existingPackage.isFreePlan = false;
      existingPackage.status = "Active";
      existingPackage.purchasedAt = now;
      existingPackage.expiresAt = expiresAt;

      if (!selectedPackage.unlimitedJobs) {
        existingPackage.remainingCredits += selectedPackage.credits;
        existingPackage.totalCreditsPurchased += selectedPackage.credits;
      }

      await existingPackage.save();
    } else {
      await EmployerPackage.create({
        employerId: employer._id,
        packageName,
        remainingCredits: selectedPackage.credits,
        totalCreditsPurchased: selectedPackage.credits,
        unlimitedJobs: selectedPackage.unlimitedJobs,
        isFreePlan: false,
        jobPostExpiryDays: selectedPackage.expiryDays,
        status: "Active",
        purchasedAt: now,
        expiresAt,
        creditExpiresAt: null,
      });
    }

    // PAYMENT TRANSACTION

    const payment = await PaymentTransaction.create({
      employerId: employer._id,
      packageName,
      amount: 0,
      currency: "CAD",
      paymentStatus: "paid",
      paymentProvider: "coupon",
      paymentMethod: "Coupon Code",
      promoCodeUsed: promoCode,
      isPromoPayment: true,
    });

    // HISTORY

    await EmployerPackageHistory.create({
      employerId: employer._id,
      packageName,
      creditsAdded: selectedPackage.credits,
      unlimitedJobs: selectedPackage.unlimitedJobs,
      promoCodeUsed: promoCode,
      isFreePlan: false,
      jobPostExpiryDays: selectedPackage.expiryDays,
      purchasedAt: now,
      expiresAt,
      paymentStatus: "paid",
      paymentProvider: "coupon",
      paymentMethod: "Coupon Code",
      transactionId: String(payment._id),
      amount: 0,
      currency: "CAD",
    });

    return NextResponse.json({
      success: true,
      message: "Coupon applied and package activated successfully.",
    });
  } catch (error) {
    console.error("PROMO VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to redeem coupon." },
      { status: 500 },
    );
  }
}
