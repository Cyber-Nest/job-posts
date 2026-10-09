import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { Employer } from "@/lib/models/Employer";
import { Job } from "@/lib/models/Job";
import { EmployerPackage } from "@/lib/models/EmployerPackage";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const query: any = {};
    if (search) {
      query.$or = [
        { orgName: { $regex: search, $options: "i" } },
        { province: { $regex: search, $options: "i" } },
      ];
    }

    const employers = await Employer.find(query)
      .populate({
        path: "currentPackageId",
        model: EmployerPackage,
        select: "packageName status totalCreditsPurchased remainingCredits unlimitedJobs",
      })
      .sort({ createdAt: -1 })
      .lean();

    const employerIds = employers.map((e) => e._id);
    const jobs = await Job.aggregate([
      { $match: { employerId: { $in: employerIds } } },
      { $group: { _id: "$employerId", count: { $sum: 1 } } },
    ]);

    const jobCounts = jobs.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    const authUserIds = employers.map((e) => e.authUserId).filter(Boolean);
    const users = await mongoose.connection.db!.collection("user").find({
      $or: [
        { _id: { $in: authUserIds } },
        { _id: { $in: authUserIds.map(id => {
          try { return new mongoose.Types.ObjectId(id); } catch { return id; }
        }) } }
      ]
    }).toArray();

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {} as Record<string, any>);

    const responseData = employers.map((emp) => {
      const user = userMap[emp.authUserId] || {};
      return {
        _id: emp._id,
        orgName: emp.orgName,
        province: emp.province,
        website: emp.website,
        package: emp.currentPackageId,
        jobCount: jobCounts[emp._id.toString()] || 0,
        createdAt: emp.createdAt,
        name: user.name || "",
        email: user.email || "",
      };
    });

    return NextResponse.json({ success: true, employers: responseData });
  } catch (error) {
    console.error("GET ADMIN EMPLOYERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch employers." },
      { status: 500 }
    );
  }
}
