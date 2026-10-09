import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Application } from "@/lib/models/Application";
import { Job } from "@/lib/models/Job";
import { Employer } from "@/lib/models/Employer";
import { getAuth } from "@/lib/auth/auth";

const VALID_STATUSES = ["pending", "reviewed", "shortlisted", "rejected"] as const;
type AppStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { id: appId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status as AppStatus)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const application = await Application.findById(appId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    const employer = await Employer.findOne({authUserId: userId });
    if (!employer || employer._id.toString() !== job.employerId.toString()) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    application.status = status as AppStatus;
    await application.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update application status error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
