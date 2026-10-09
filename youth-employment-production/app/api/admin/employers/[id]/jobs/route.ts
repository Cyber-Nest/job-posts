import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";
import { JobDoc, EmployerDoc } from "@/server/db/models";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id: employerId } = await params;

    const employersColl = await collection<EmployerDoc>("employers");
    const jobsColl = await collection<JobDoc>("jobs");

    const employer = await employersColl.findOne({ id: employerId });
    if (!employer) {
      return NextResponse.json({ error: "Employer not found." }, { status: 404 });
    }

    const jobs = await jobsColl.find({ employerId }).sort({ postedAt: -1 }).toArray();

    // Map `city` to `location` and `postDate` to `jobPostingDate` or `postedAt`
    const mappedJobs = jobs.map(job => ({
      _id: job.id,
      jobId: job.jobUniqueId,
      title: job.title,
      city: job.location, // Location in the new schema acts like city
      province: job.province,
      status: job.status,
      postDate: job.jobPostingDate,
      postedAt: job.postedAt,
      category: job.category,
      employmentType: job.employmentType
    }));

    return NextResponse.json({
      success: true,
      employerName: employer.orgName,
      jobs: mappedJobs,
    });
  } catch (error) {
    console.error("GET EMPLOYER JOBS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}
