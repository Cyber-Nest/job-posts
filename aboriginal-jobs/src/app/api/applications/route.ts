import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Application } from "@/lib/models/Application";
import { Employer } from "@/lib/models/Employer";
import { Job } from "@/lib/models/Job";
import { getAuth } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    if (role === "employer") {
      const employerRecord = await Employer.findOne({ authUserId: userId });

      if (!employerRecord) {
        return NextResponse.json({ applications: [], jobs: [] });
      }

      const jobs = await Job.find({
        employerId: employerRecord._id,
      }).sort({ createdAt: -1 });

      if (jobs.length === 0) {
        return NextResponse.json({ applications: [], jobs: [] });
      }

      const applications = await Application.find({
        jobId: { $in: jobs.map((job: any) => job._id) },
      })
        .populate({ path: "userId", select: "name email" })
        .populate({ path: "jobId", select: "title company" })
        .sort({ appliedAt: -1 });

      const formattedApplications = applications.map((app: any) => ({
        id: app._id,
        jobId: app.jobId?._id,
        userId: app.userId?._id,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumeUrl,
        status: app.status,
        appliedAt: app.appliedAt,
        applicantName: app.userId?.name,
        applicantEmail: app.userId?.email,
        jobTitle: app.jobId?.title,
        jobCompany: app.jobId?.company,
      }));

      return NextResponse.json({ applications: formattedApplications, jobs });
    }

    // Job seeker applications
    const applications = await Application.find({ userId })
      .populate({
        path: "jobId",
        select: "title company location employmentType status",
      })
      .sort({ appliedAt: -1 });

    const formattedApplications = applications.map((app: any) => ({
      id: app._id,
      jobId: app.jobId?._id,
      coverLetter: app.coverLetter,
      resumeUrl: app.resumeUrl,
      status: app.status,
      appliedAt: app.appliedAt,
      jobTitle: app.jobId?.title,
      jobCompany: app.jobId?.company,
      jobLocation: app.jobId?.location,
      jobEmploymentType: app.jobId?.employmentType,
      jobStatus: app.jobId?.status,
    }));

    return NextResponse.json({ applications: formattedApplications });
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { jobId, coverLetter, resumeUrl } = body;

    if (!jobId?.trim()) {
      return NextResponse.json(
        { error: "jobId is required." },
        { status: 400 }
      );
    }

    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job." },
        { status: 409 }
      );
    }

    const createdApplication = await Application.create({
      jobId,
      userId,
      coverLetter: coverLetter?.trim() || "",
      resumeUrl: resumeUrl?.trim() || "",
      status: "pending",
    });

    return NextResponse.json(
      { success: true, applicationId: createdApplication._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply job error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
