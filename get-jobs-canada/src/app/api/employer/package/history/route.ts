import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";

import { getAuth } from "@/lib/auth/auth";

import { Employer } from "@/lib/models/Employer";
import { EmployerPackageHistory } from "@/lib/models/EmployerPackageHistory";
import { PaymentTransaction } from "@/lib/models/PaymentTransaction";

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

    // HISTORY
    const history = await EmployerPackageHistory.find({
      employerId: employer._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    const payments = await PaymentTransaction.find({
      employerId: employer._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,

      history,
      payments,
    });
  } catch (error) {
    console.error("PACKAGE HISTORY ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch package history.",
      },
      {
        status: 500,
      },
    );
  }
}
