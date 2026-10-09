import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";

import { getAuth } from "@/lib/auth/auth";

import { Employer } from "@/lib/models/Employer";

import { EmployerPackage } from "@/lib/models/EmployerPackage";

export async function GET(request: NextRequest) {
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

    // USER
    const user = session.user;

    // EMPLOYER
    const employer = await Employer.findOne({
      authUserId: user.id,
    });

    // PACKAGE
    let employerPackage = null;

    if (employer) {
      employerPackage = await EmployerPackage.findOne({
        employerId: employer._id,

        status: "Active",
      });
    }

    return NextResponse.json({
      success: true,

      user: {
        id: user.id,

        name: user.name,

        email: user.email,

        image: user.image || null,

        employerProfile: employer
          ? {
              id: employer._id,

              orgName: employer.orgName,

              website: employer.website || "",

              province: employer.province || "",

              description: employer.description || "",

              logoUrl: employer.logoUrl || "",

              package: employerPackage
                ? {
                    id: employerPackage._id,

                    packageName: employerPackage.packageName,

                    remainingCredits: employerPackage.remainingCredits,

                    totalCreditsPurchased:
                      employerPackage.totalCreditsPurchased,

                    unlimitedJobs: employerPackage.unlimitedJobs,

                    isFreePlan: employerPackage.isFreePlan,

                    jobPostExpiryDays: employerPackage.jobPostExpiryDays,

                    status: employerPackage.status,

                    purchasedAt: employerPackage.purchasedAt,

                    expiresAt: employerPackage.expiresAt,
                  }
                : null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user.",
      },
      {
        status: 500,
      },
    );
  }
}
