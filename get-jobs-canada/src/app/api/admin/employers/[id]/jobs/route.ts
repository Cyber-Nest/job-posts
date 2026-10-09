import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { Job } from "@/lib/models/Job";
import { Employer } from "@/lib/models/Employer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const { id: employerId } = await params;

    const employer = await Employer.findById(employerId).select("orgName").lean();
    if (!employer) {
      return NextResponse.json({ error: "Employer not found." }, { status: 404 });
    }

    const jobs = await Job.find({ employerId })
      .select("jobId title city province status postDate postedAt category employmentType")
      .sort({ postedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      employerName: employer.orgName,
      jobs,
    });
  } catch (error) {
    console.error("GET EMPLOYER JOBS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}
