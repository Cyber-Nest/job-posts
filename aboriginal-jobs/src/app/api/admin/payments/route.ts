import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { EmployerPackageHistory } from "@/lib/models/EmployerPackageHistory";
import { Employer } from "@/lib/models/Employer";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    // Fetch all transaction history
    const history = await EmployerPackageHistory.find({})
      .sort({ purchasedAt: -1 })
      .lean();

    // Fetch employers for the history
    const employerIds = history.map((h: any) => h.employerId);
    const employers = await Employer.find({ _id: { $in: employerIds } })
      .select("orgName authUserId")
      .lean();

    const employerMap = employers.reduce((acc: any, emp: any) => {
      acc[emp._id.toString()] = emp;
      return acc;
    }, {});

    // Fetch users for emails
    const authUserIds = employers.map((e: any) => e.authUserId).filter(Boolean);
    const users = await mongoose.connection.db!.collection("user").find({
      $or: [
        { _id: { $in: authUserIds } },
        { _id: { $in: authUserIds.map((id: string) => {
          try { return new mongoose.Types.ObjectId(id); } catch { return id; }
        }) } }
      ]
    }).toArray();

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {} as Record<string, any>);

    let totalRevenue = 0;
    let promoCodesUsedCount = 0;
    const planPopularityMap: Record<string, number> = {};

    const transactions = history.map((tx: any) => {
      const emp = employerMap[tx.employerId?.toString()] || {};
      const user = userMap[emp.authUserId] || {};

      const amount = tx.amount || 0;
      totalRevenue += amount;

      if (tx.promoCodeUsed) {
        promoCodesUsedCount++;
      }

      const pkgName = tx.packageName || "Unknown";
      planPopularityMap[pkgName] = (planPopularityMap[pkgName] || 0) + 1;

      return {
        _id: tx._id,
        employerName: emp.orgName || "Unknown Employer",
        employerEmail: user.email || "No Email",
        packageName: pkgName,
        creditsAdded: tx.creditsAdded || 0,
        unlimitedJobs: tx.unlimitedJobs || false,
        jobPostExpiryDays: tx.jobPostExpiryDays || 0,
        amount,
        promoCodeUsed: tx.promoCodeUsed || null,
        paymentMethod: tx.paymentMethod || tx.paymentProvider || "N/A",
        status: tx.paymentStatus || "paid",
        purchasedAt: tx.purchasedAt,
      };
    });

    const planPopularity = Object.entries(planPopularityMap).map(([name, count]) => ({
      name,
      count,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalSales: history.length,
        promoCodesUsedCount,
      },
      chartData: {
        planPopularity,
      },
      transactions,
    });
  } catch (error) {
    console.error("ADMIN PAYMENTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment data." },
      { status: 500 }
    );
  }
}
