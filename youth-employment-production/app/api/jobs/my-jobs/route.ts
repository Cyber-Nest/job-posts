import { NextRequest, NextResponse } from "next/server";
import { collection } from "@/server/db/mongo";
import { getCurrentUser } from "@/server/auth/local-auth";

// JOB LIST ITEM

function buildEmployerJobItem(job: any) {
  const baseDate = job.jobPostingDate || job.createdAt;

  const postingDate = new Date(baseDate);

  const expiresAt = new Date(postingDate);

  expiresAt.setDate(expiresAt.getDate() + (job.adDurationDays || 90));

  return {
    id: job.id,

    jobUniqueId: job.jobUniqueId,

    title: job.title,

    company: job.company,

    location: job.location,

    province: job.province,

    employmentType: job.employmentType,

    category: job.category,

    status: job.status,

    salary: job.salary,

    salaryPeriod: job.salaryPeriod,

    adDurationDays: job.adDurationDays,

    // IMPORTANT DATES
    jobPostingDate: postingDate.toISOString(),

    expiresAt: expiresAt.toISOString(),

    createdAt: job.createdAt,

    updatedAt: job.updatedAt,
    packageId: job.packageId || null,
  };
}

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

    // GET EMPLOYER
    const employers = await collection("employers");

    const employer = await employers.findOne({
      userId: user.id,
    });

    if (!employer) {
      return NextResponse.json({
        success: true,

        jobs: [],
      });
    }

    // GET JOBS
    const jobs = await collection("jobs");

    const employerJobs = await jobs
      .find({
        employerId: employer.id,
      })

      // IMPORTANT
      .sort({
        jobPostingDate: -1,
      })

      .toArray();

    // TRANSFORM JOBS
    const transformedJobs = employerJobs.map(buildEmployerJobItem);

    return NextResponse.json({
      success: true,

      jobs: transformedJobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    return NextResponse.json(
      {
        success: false,

        error: "Failed to fetch jobs",
      },
      {
        status: 500,
      },
    );
  }
}
