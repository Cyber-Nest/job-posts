import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { collection } from "@/server/db/mongo";
import { EmployerPackageHistoryDoc, EmployerDoc, UserDoc } from "@/server/db/models";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const historyColl = await collection<EmployerPackageHistoryDoc>("employerPackageHistory");
    const employersColl = await collection<EmployerDoc>("employers");
    const usersColl = await collection<UserDoc>("users");

    // Fetch all transaction history
    const history = await historyColl.find({}).sort({ purchasedAt: -1 }).toArray();

    // Fetch employers for the history
    const employerIds = history.map((h) => h.employerId);
    const employers = await employersColl.find({ id: { $in: employerIds } }).toArray();

    const employerMap = employers.reduce((acc, emp) => {
      acc[emp.id] = emp;
      return acc;
    }, {} as Record<string, EmployerDoc>);

    // Fetch users for emails
    const userIds = employers.map((e) => e.userId).filter(Boolean);
    const users = await usersColl.find({ id: { $in: userIds } }).toArray();

    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<string, UserDoc>);

    let totalRevenue = 0;
    let promoCodesUsedCount = 0;
    const planPopularityMap: Record<string, number> = {};

    const transactions = history.map((tx) => {
      const emp = employerMap[tx.employerId] || {} as Partial<EmployerDoc>;
      const user = userMap[emp.userId as string] || {} as Partial<UserDoc>;

      const amount = tx.amount || 0;
      totalRevenue += amount;

      if (tx.promoCodeUsed) {
        promoCodesUsedCount++;
      }

      const pkgName = tx.packageName || "Unknown";
      planPopularityMap[pkgName] = (planPopularityMap[pkgName] || 0) + 1;

      return {
        _id: tx.id,
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
