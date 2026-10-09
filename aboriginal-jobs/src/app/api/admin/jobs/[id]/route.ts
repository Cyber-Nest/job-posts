import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { Job } from "@/lib/models/Job";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

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

    //both postDate and postedAt update
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          postDate: date,
          postedAt: date,
        },
      },
      { new: true }
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
