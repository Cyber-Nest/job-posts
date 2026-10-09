import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Job } from "@/lib/models/Job";
import { getAuth } from "@/lib/auth/auth";
import mongoose from "mongoose";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const body = await request.json();
    const { status } = body;
    
    // Validate status
    if (!status || !["active", "closed", "expired"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'active', 'closed', or 'expired'" },
        { status: 400 }
      );
    }
    
    // Find the job
    const job = await Job.findById(id);
    
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }
    
    // Check if employer owns this job
    const employerCollection = mongoose.connection.collection("employers");
    const employer = await employerCollection.findOne({ authUserId: userId });
    
    if (!employer || job.employerId.toString() !== employer._id.toString()) {
      return NextResponse.json(
        { error: "You don't have permission to update this job" },
        { status: 403 }
      );
    }
    
    // Update status
    job.status = status;
    await job.save();
    
    return NextResponse.json({
      success: true,
      message: `Job status updated to ${status}`,
      data: { id: job._id, status: job.status }
    });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update job status" },
      { status: 500 }
    );
  }
}