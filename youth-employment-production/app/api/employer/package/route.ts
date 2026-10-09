import { NextRequest, NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";
import { getCurrentUser } from "@/server/auth/local-auth";

export async function GET(req: NextRequest) {
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
          error: "Only employers can access package details",
        },
        {
          status: 403,
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

    // GET PACKAGE
    const packages = await collection("employerPackages");

    const employerPackage = await packages.findOne({
      employerId: employer.id,
    });

    if (!employerPackage) {
      return NextResponse.json(
        {
          error: "Package not found",
        },
        {
          status: 404,
        },
      );
    }
    const paymentTransactions = await collection("paymentTransactions");

    const latestPayment = await paymentTransactions.findOne(
      {
        employerId: employer.id,
      },
      {
        sort: {
          createdAt: -1,
        },
      },
    );

    return NextResponse.json({
      success: true,

      package: {
        id: employerPackage.id,

        packageName: employerPackage.packageName,

        remainingCredits: employerPackage.remainingCredits,

        totalCreditsPurchased: employerPackage.totalCreditsPurchased,

        unlimitedJobs: employerPackage.unlimitedJobs,

        isFreePlan: employerPackage.isFreePlan,

        jobPostExpiryDays: employerPackage.jobPostExpiryDays,

        status: employerPackage.status,

        purchasedAt: employerPackage.purchasedAt,

        expiresAt: employerPackage.expiresAt,
        paymentMethod: latestPayment?.paymentMethod || null,
      },
    });
  } catch (error) {
    console.error("Error fetching employer package:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch employer package",
      },
      {
        status: 500,
      },
    );
  }
}
