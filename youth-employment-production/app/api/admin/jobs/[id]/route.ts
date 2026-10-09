import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";
import { JobDoc } from "@/server/db/models";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id: jobId } = await params;
    const body = await request.json();
    const { postDate } = body;

    if (!postDate) {
      return NextResponse.json({ error: "postDate is required." }, { status: 400 });
    }

    const date = new Date(postDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
    }

    const jobsColl = await collection<JobDoc>("jobs");

    // Both postDate and postedAt update
    // Note: The new project model has jobPostingDate (string) and postedAt (Date)
    const updatedJob = await jobsColl.findOneAndUpdate(
      { id: jobId },
      {
        $set: {
          jobPostingDate: date.toISOString(), // String format as per schema
          postedAt: date,                     // Date format as per schema
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Job post date updated successfully.",
      job: updatedJob,
    });
  } catch (error) {
    console.error("PATCH JOB DATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update job post date." },
      { status: 500 }
    );
  }
}
