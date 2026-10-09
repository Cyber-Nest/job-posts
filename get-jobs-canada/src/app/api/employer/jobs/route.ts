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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Find employer
    const employerCollection = mongoose.connection.collection("employers");
    const employer = await employerCollection.findOne({ authUserId: userId });

    if (!employer) {
      return NextResponse.json(
        { error: "Employer profile not found" },
        { status: 404 },
      );
    }

    // Build query
    const query: any = { employerId: employer._id };
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const jobCollection = mongoose.connection.collection("jobs");
    const [jobs, total] = await Promise.all([
      jobCollection
        .find(query)
        .sort({ postedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      jobCollection.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch employer jobs error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
