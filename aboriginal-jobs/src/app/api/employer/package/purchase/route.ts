import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";

import { getAuth } from "@/lib/auth/auth";

import { Employer } from "@/lib/models/Employer";

import { EmployerPackage } from "@/lib/models/EmployerPackage";

import { EmployerPackageHistory } from "@/lib/models/EmployerPackageHistory";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // AUTH
    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const packageName = body.packageName;

    if (!packageName) {
      return NextResponse.json(
        {
          error: "Package name is required.",
        },
        {
          status: 400,
        },
      );
    }

    // EMPLOYER
    const employer = await Employer.findOne({
      authUserId: session.user.id,
    });

    if (!employer) {
      return NextResponse.json(
        {
          error: "Employer not found.",
        },
        {
          status: 404,
        },
      );
    }

    // PACKAGE CONFIG
    const packageConfigs: any = {
      "Basic Job Posting": {
        credits: 1,
        unlimitedJobs: false,
        expiryDays: 180,
        amount: 12.5,
      },

      "Featured Job Posting": {
        credits: 3,
        unlimitedJobs: false,
        expiryDays: 180,
        amount: 47.5,
      },

      "Employer Branding Package": {
        credits: 10,
        unlimitedJobs: false,
        expiryDays: 180,
        amount: 97.5,
      },

      "Monthly Hiring Support": {
        credits: 999999,
        unlimitedJobs: true,
        expiryDays: 365,
        amount: 190,
      },
    };

    const selectedPackage = packageConfigs[packageName];

    if (!selectedPackage) {
      return NextResponse.json(
        {
          error: "Invalid package selected.",
        },
        {
          status: 400,
        },
      );
    }

    // EXPIRE OLD PACKAGE
    await EmployerPackage.updateMany(
      {
        employerId: employer._id,

        status: "Active",
      },
      {
        $set: {
          status: "Expired",
        },
      },
    );

    // EXPIRY DATE
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + selectedPackage.expiryDays);

    // CREATE NEW PACKAGE
    const createdPackage = await EmployerPackage.create({
      employerId: employer._id,

      packageName,

      remainingCredits: selectedPackage.credits,

      totalCreditsPurchased: selectedPackage.credits,

      unlimitedJobs: selectedPackage.unlimitedJobs,

      isFreePlan: false,

      jobPostExpiryDays: selectedPackage.expiryDays,

      status: "Active",

      purchasedAt: new Date(),

      expiresAt,

      creditExpiresAt: expiresAt,
    });

    // UPDATE EMPLOYER
    employer.currentPackageId = createdPackage._id;

    await employer.save();

    // PACKAGE HISTORY
    await EmployerPackageHistory.create({
      employerId: employer._id,

      packageName,

      creditsAdded: selectedPackage.credits,

      unlimitedJobs: selectedPackage.unlimitedJobs,

      isFreePlan: false,

      jobPostExpiryDays: selectedPackage.expiryDays,

      purchasedAt: new Date(),

      expiresAt,

      paymentStatus: "paid",

      paymentProvider: "manual",

      transactionId: `TXN-${Date.now()}`,

      amount: selectedPackage.amount,

      currency: "CAD",
    });

    return NextResponse.json(
      {
        success: true,

        message: "Package purchased successfully.",

        package: createdPackage,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("PACKAGE PURCHASE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to purchase package.",
      },
      {
        status: 500,
      },
    );
  }
}
