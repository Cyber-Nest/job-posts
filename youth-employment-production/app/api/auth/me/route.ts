import { NextRequest, NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";
import { getCurrentUser } from "@/server/auth/local-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        {
          status: 401,
        },
      );
    }

    // GET EMPLOYER PROFILE
    const employers = await collection("employers");

    const employer = await employers.findOne({
      userId: user.id,
    });

    // GET EMPLOYER PACKAGE
    let employerPackage = null;

    if (employer) {
      const packages = await collection("employerPackages");

      employerPackage = await packages.findOne({
        employerId: employer.id,
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,

        firstName: user.firstName,

        lastName: user.lastName,

        name: user.name,

        email: user.email,

        username: user.username,

        accountType: user.accountType,

        employerProfile: employer
          ? {
              businessName: employer.orgName,

              phoneNumber: employer.phoneNumber,

              province: employer.province,

              // PACKAGE INFO
              packageName: employerPackage?.packageName || "Free Plan",

              packageStatus: employerPackage?.status || "Active",

              remainingCredits: employerPackage?.remainingCredits || 0,

              totalCreditsPurchased:
                employerPackage?.totalCreditsPurchased || 0,

              isFreePlan: employerPackage?.isFreePlan ?? true,

              unlimitedJobs: employerPackage?.unlimitedJobs ?? false,

              jobPostExpiryDays: employerPackage?.jobPostExpiryDays || 180,

              expiresAt: employerPackage?.expiresAt || null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user data",
      },
      {
        status: 500,
      },
    );
  }
}
