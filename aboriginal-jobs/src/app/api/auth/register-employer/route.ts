import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";

import { getAuth } from "@/lib/auth/auth";

import { Verification } from "@/lib/models/Verification";
import { Employer } from "@/lib/models/Employer";
import { EmployerPackage } from "@/lib/models/EmployerPackage";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();

    const email = body.email?.toLowerCase().trim();

    const password = body.password?.trim();

    const orgName = body.orgName?.trim();

    const province = body.province?.trim();

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !orgName ||
      !province
    ) {
      return NextResponse.json(
        {
          error: "All fields are required.",
        },
        {
          status: 400,
        },
      );
    }

    // Check OTP verified
    const verifiedRecord = await Verification.findOne({
      identifier: email,
      verified: true,
    });

    if (!verifiedRecord) {
      return NextResponse.json(
        {
          error: "Please verify your email first.",
        },
        {
          status: 400,
        },
      );
    }

    // Better Auth instance
    const auth = await getAuth();

    // Create user using Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
      },
    });

    const employer = await Employer.create({
      authUserId: result.user.id,
      orgName,
      province,
    });

    const freePackage = await EmployerPackage.create({
      employerId: employer._id,
      packageName: "Free Plan",
      remainingCredits: 1,
      totalCreditsPurchased: 1,
      unlimitedJobs: false,
      isFreePlan: true,
      jobPostExpiryDays: 30,
      status: "Active",
      purchasedAt: new Date(),
      expiresAt: null,
      creditExpiresAt: null,
    });

    employer.currentPackageId = freePackage._id;
    await employer.save();

    // Delete verification records
    await Verification.deleteMany({
      identifier: email,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: result.user,
    });
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to create account.",
      },
      {
        status: 500,
      },
    );
  }
}
