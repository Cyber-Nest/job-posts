import { NextRequest, NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";
import { getCurrentUser } from "@/server/auth/local-auth";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
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

    const { id } = await params;

    const body = await req.json();

    const { status } = body;

    if (status !== "active" && status !== "closed") {
      return NextResponse.json(
        {
          error: "Invalid status",
        },
        {
          status: 400,
        },
      );
    }

    const jobs = await collection("jobs");

    const employers = await collection("employers");

    const employer = await employers.findOne({
      userId: user.id,
    });

    if (!employer) {
      return NextResponse.json(
        {
          error: "Employer not found",
        },
        {
          status: 404,
        },
      );
    }

    const existingJob = await jobs.findOne({
      id,
    });

    if (!existingJob) {
      return NextResponse.json(
        {
          error: "Job not found",
        },
        {
          status: 404,
        },
      );
    }

    if (existingJob.employerId !== employer.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        },
      );
    }

    await jobs.updateOne(
      {
        id,
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,

      message:
        status === "closed"
          ? "Job closed successfully"
          : "Job reopened successfully",
    });
  } catch (error) {
    console.error("Status update error:", error);

    return NextResponse.json(
      {
        error: "Failed to update status",
      },
      {
        status: 500,
      },
    );
  }
}
