import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { collection } from "@/server/db/mongo";

import { getCurrentUser } from "@/server/auth/local-auth";
import { PackageDoc } from "@/server/db/models";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required",
        },
        {
          status: 401,
        },
      );
    }

    if (user.accountType !== "employer") {
      return NextResponse.json(
        {
          error: "Only employers can purchase packages",
        },
        {
          status: 403,
        },
      );
    }

    const body = await req.json();

    const packageName = body.packageName?.trim();

    const promoCode = body.promoCode?.trim()?.toUpperCase() || null;

    if (!packageName) {
      return NextResponse.json(
        {
          error: "Package name is required",
        },
        {
          status: 400,
        },
      );
    }

    const packagesCollection = await collection<PackageDoc>("packages");
    const dbPackage = await packagesCollection.findOne({ name: packageName });

    if (!dbPackage) {
      return NextResponse.json(
        {
          error: "Invalid package selected",
        },
        {
          status: 400,
        },
      );
    }

    // GET EMPLOYER
    const employers = await collection("employers");
    const employer = await employers.findOne({
      userId: user.id,
    });

    if (!employer) {
      return NextResponse.json(
        {
          error: "Employer profile not found",
        },
        {
          status: 404,
        },
      );
    }

    const promoCodes = await collection("promoCodes");

    let promoData = null;
    let isFreePromo = false;

    if (promoCode) {
      // Pre-check: ensure coupon exists, is unused, AND has been assigned
      const existingPromo = await promoCodes.findOne({
        code: promoCode,
        packageName,
        status: "Unused",
      });

      if (!existingPromo) {
        return NextResponse.json(
          { error: "Invalid promo code or already redeemed." },
          { status: 400 },
        );
      }

      // Guard: coupon must be assigned before use
      if (!existingPromo.assignedEmail) {
        return NextResponse.json(
          // { error: "This coupon has not been assigned yet and cannot be used." },
          { error: "Invalid promo code or already redeemed." },
          { status: 400 },
        );
      }

      const updateResult = await promoCodes.findOneAndUpdate(
        {
          code: promoCode,
          packageName,
          status: "Unused",
          assignedEmail: { $ne: null }, // extra safety: only update if assigned
        },
        {
          $set: {
            status: "Used",
            redeemedName: user.name || user.email,
            redeemedEmail: user.email,
            redeemedAt: new Date(),
            employerId: employer.id,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      );

      promoData = updateResult;

      if (!promoData) {
        return NextResponse.json(
          { error: "Failed to redeem promo code. Please try again." },
          { status: 400 },
        );
      }

      isFreePromo = true;
    }

    const packages = await collection("employerPackages");

    const historyCollection = await collection("employerPackageHistory");

    const paymentTransactions = await collection("paymentTransactions");
    const existingPackage = await packages.findOne({
      employerId: employer.id,
    });

    const now = new Date();

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + dbPackage.expiryDays);

    // UPDATE EXISTING PACKAGE
    if (existingPackage) {
      const updateDoc: Record<string, unknown> = {
        $set: {
          packageName,

          unlimitedJobs: dbPackage.unlimitedJobs,

          isFreePlan: false,

          status: "Active",

          purchasedAt: now,

          expiresAt,

          updatedAt: now,
        },
      };

      if (!dbPackage.unlimitedJobs) {
        updateDoc.$inc = {
          remainingCredits: dbPackage.credits,

          totalCreditsPurchased: dbPackage.credits,
        };
      }

      await packages.updateOne(
        {
          employerId: employer.id,
        },
        updateDoc,
      );
    }

    // CREATE PACKAGE IF NOT EXISTS
    else {
      await packages.insertOne({
        id: randomUUID(),

        employerId: employer.id,

        packageName,

        remainingCredits: dbPackage.credits,

        totalCreditsPurchased: dbPackage.credits,

        unlimitedJobs: dbPackage.unlimitedJobs,

        isFreePlan: false,

        jobPostExpiryDays: dbPackage.expiryDays,

        status: "Active",

        purchasedAt: now,

        expiresAt,

        creditExpiresAt: null,

        createdAt: now,

        updatedAt: now,
      });
    }

    // CREATE HISTORY ENTRY
    await historyCollection.insertOne({
      id: randomUUID(),

      employerId: employer.id,

      packageName,

      creditsAdded: dbPackage.credits,

      unlimitedJobs: dbPackage.unlimitedJobs,
      paymentMethod: isFreePromo ? "Promo Code" : "Card",
      isFreePlan: false,

      jobPostExpiryDays: dbPackage.expiryDays,

      purchasedAt: now,

      expiresAt,

      paymentStatus: "paid",
      paymentProvider: isFreePromo ? "promo_code" : "dummy",
      transactionId: isFreePromo ? `PROMO-${randomUUID()}` : randomUUID(),
      currency: "CAD",
      amount: isFreePromo ? 0 : dbPackage.discountedPrice,
      promoCodeUsed: promoCode,
      createdAt: now,

      updatedAt: now,
    });

    await paymentTransactions.insertOne({
      id: randomUUID(),

      employerId: employer.id,

      packageName,

      amount: isFreePromo ? 0 : dbPackage.discountedPrice,

      currency: "CAD",

      paymentStatus: "paid",

      paymentProvider: isFreePromo ? "promo_code" : "stripe",
      paymentMethod: isFreePromo ? "Promo Code" : "Card",
      stripeSessionId: null,

      stripePaymentIntentId: null,

      promoCodeUsed: promoCode,

      isPromoPayment: isFreePromo,

      createdAt: now,

      updatedAt: now,
    });
    return NextResponse.json({
      success: true,

      message: "Package activated successfully",
    });
  } catch (error) {
    console.error("Error purchasing package:", error);

    return NextResponse.json(
      {
        error: "Failed to activate package",
      },
      {
        status: 500,
      },
    );
  }
}
