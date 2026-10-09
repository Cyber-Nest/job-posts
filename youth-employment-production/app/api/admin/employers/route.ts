import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";
import { EmployerDoc, UserDoc, JobDoc, EmployerPackageDoc } from "@/server/db/models";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const employersColl = await collection<EmployerDoc>("employers");
    const usersColl = await collection<UserDoc>("users");
    const jobsColl = await collection<JobDoc>("jobs");
    const packagesColl = await collection<EmployerPackageDoc>("employerPackages");

    const query: any = {};
    if (search) {
      query.$or = [
        { orgName: { $regex: search, $options: "i" } },
        { province: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch employers
    const employers = await employersColl.find(query).sort({ createdAt: -1 }).toArray();

    const employerIds = employers.map((e) => e.id);
    const userIds = employers.map((e) => e.userId);

    // Fetch jobs count per employer
    const jobsPipeline = [
      { $match: { employerId: { $in: employerIds } } },
      { $group: { _id: "$employerId", count: { $sum: 1 } } }
    ];
    const jobs = await jobsColl.aggregate(jobsPipeline).toArray();
    const jobCounts = jobs.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    // Fetch users for these employers
    const users = await usersColl.find({ id: { $in: userIds } }).toArray();
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<string, UserDoc>);

    // Fetch latest active package per employer
    const packages = await packagesColl.find({ employerId: { $in: employerIds } }).toArray();
    const packageMap = packages.reduce((acc, pkg) => {
      // Assuming we want the active one, or just the most recently updated
      if (!acc[pkg.employerId] || pkg.status === "Active") {
        acc[pkg.employerId] = pkg;
      }
      return acc;
    }, {} as Record<string, EmployerPackageDoc>);

    const responseData = employers.map((emp) => {
      const user = userMap[emp.userId] || {} as Partial<UserDoc>;
      const empPackage = packageMap[emp.id] || null;

      return {
        _id: emp.id,
        orgName: emp.orgName,
        province: emp.province,
        website: emp.website,
        package: empPackage ? {
          packageName: empPackage.packageName,
          status: empPackage.status,
          totalCreditsPurchased: empPackage.totalCreditsPurchased,
          remainingCredits: empPackage.remainingCredits,
          unlimitedJobs: empPackage.unlimitedJobs
        } : null,
        jobCount: jobCounts[emp.id] || 0,
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
