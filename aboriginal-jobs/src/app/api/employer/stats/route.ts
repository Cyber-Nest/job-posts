import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { getAuth } from "@/lib/auth/auth";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    const employerCollection = mongoose.connection.collection("employers");
    const employer = await employerCollection.findOne({ authUserId: userId });
    
    if (!employer) {
      return NextResponse.json({ stats: {
        totalJobs: 0,
        activeJobs: 0,
        closedJobs: 0,
        totalViews: 0,
        totalApplications: 0,
      }});
    }
    
    const jobCollection = mongoose.connection.collection("jobs");
    
    const [totalJobs, activeJobs, closedJobs] = await Promise.all([
      jobCollection.countDocuments({ employerId: employer._id }),
      jobCollection.countDocuments({ employerId: employer._id, status: 'active' }),
      jobCollection.countDocuments({ employerId: employer._id, status: 'closed' }),
    ]);
    
    const totalViews = 0;
    const totalApplications = 0;
    
    return NextResponse.json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalViews,
        totalApplications,
      },
    });
  } catch (error) {
    console.error("Fetch stats error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}