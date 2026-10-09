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
          error: "Only employers can access package history",
        },
        {
          status: 403,
        },
      );
    }

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

    const historyCollection = await collection("employerPackageHistory");

    const history = await historyCollection
      .find({
        employerId: employer.id,
      })
      .sort({
        purchasedAt: -1,
      })
      .toArray();

    const paymentTransactions = await collection("paymentTransactions");

    const payments = await paymentTransactions
      .find({
        employerId: employer.id,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    return NextResponse.json({
      success: true,

      history,
      payments,
    });
  } catch (error) {
    console.error("Error fetching package history:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch package history",
      },
      {
        status: 500,
      },
    );
  }
}
