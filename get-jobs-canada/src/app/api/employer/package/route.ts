import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";

import { getAuth } from "@/lib/auth/auth";

import { Employer } from "@/lib/models/Employer";
import { EmployerPackage } from "@/lib/models/EmployerPackage";
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

    // PACKAGE
    const employerPackage = await EmployerPackage.findOne({
      employerId: employer._id,

      status: "Active",
    }).lean();

    const latestPayment = await PaymentTransaction.findOne({
      employerId: employer._id,
      paymentStatus: "paid",
    })
      .sort({
        createdAt: -1,
      })
      .lean();
    return NextResponse.json({
      success: true,
      package: employerPackage
        ? {
            ...employerPackage,

            paymentMethod: latestPayment?.paymentMethod || null,
          }
        : null,
    });
  } catch (error) {
    console.error("PACKAGE FETCH ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch package.",
      },
      {
        status: 500,
      },
    );
  }
}
