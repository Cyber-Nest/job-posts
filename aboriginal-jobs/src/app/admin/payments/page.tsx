"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  CreditCard,
  Receipt,
  Tag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Filter,
  PieChart,
  Activity,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ['#10B981', '#C8782A', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B'];

const SYSTEM_PLANS = [
  "Starter",
  "Deluxe",
  "Ultimate",
  "Pro Plan",
  "Unlimited"
];

interface TransactionData {
  _id: string;
  employerName: string;
  employerEmail: string;
  packageName: string;
  creditsAdded: number;
  unlimitedJobs: boolean;
  jobPostExpiryDays: number;
  amount: number;
  promoCodeUsed: string | null;
  paymentMethod: string;
  status: string;
  purchasedAt: string;
}

interface StatsData {
  totalRevenue: number;
  totalSales: number;
  promoCodesUsedCount: number;
}

interface ChartData {
  name: string;
  count: number;
}

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [planPopularity, setPlanPopularity] = useState<ChartData[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPromo, setFilterPromo] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setStats(data.stats);
      } else {
        toast.error("Failed to load payments data.");
      }
    } catch {
      toast.error("Network error loading payments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Frontend Filtering
  const filteredTransactions = transactions.filter((tx) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      tx.employerName.toLowerCase().includes(term) ||
      tx.employerEmail.toLowerCase().includes(term) ||
      tx.packageName.toLowerCase().includes(term) ||
      (tx.promoCodeUsed && tx.promoCodeUsed.toLowerCase().includes(term))
    );

    const matchesPlan = filterPlan === "All" || tx.packageName === filterPlan;
    const matchesStatus = filterStatus === "All" || tx.status.toLowerCase() === filterStatus.toLowerCase();
    
    const matchesPromo = filterPromo === "All" ||
      (filterPromo === "None" && !tx.promoCodeUsed) ||
      (filterPromo !== "All" && filterPromo !== "None" && tx.promoCodeUsed && tx.promoCodeUsed.toUpperCase().startsWith(filterPromo));

    return matchesSearch && matchesPlan && matchesStatus && matchesPromo;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPlan, filterStatus, filterPromo]);

  // Derive unique plans combining SYSTEM_PLANS and any other plans from transactions
  const uniquePlans = Array.from(new Set([...SYSTEM_PLANS, ...transactions.map(tx => tx.packageName)]))
    .filter(plan => plan !== "Free Plan" && plan !== "Basic Job Posting");

  // Frontend calculated plan popularity:
  const planCountMap = transactions.reduce((acc, tx) => {
    acc[tx.packageName] = (acc[tx.packageName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const frontendPlanPopularity = uniquePlans.map(plan => ({
    name: plan,
    count: planCountMap[plan] || 0
  })).sort((a, b) => b.count - a.count);

  const maxPopularity = frontendPlanPopularity.length > 0 
    ? Math.max(...frontendPlanPopularity.map(p => p.count)) 
    : 1;

  // Calculate Revenue by Plan (ONLY PAID and > 0)
  const revenueByPlan = transactions.reduce((acc, tx) => {
    if (tx.amount > 0 && tx.status.toLowerCase() === 'paid') {
      acc[tx.packageName] = (acc[tx.packageName] || 0) + tx.amount;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const revenueChartData = Object.entries(revenueByPlan)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  const totalCreditsIssued = transactions.reduce((sum, tx) => sum + (tx.creditsAdded || 0), 0);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#1C1C1C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Payment Management
          </h1>
          <p className="text-sm text-[#6B3A2A]/60 mt-1">
            View transaction history, revenue statistics, and package sales.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-[#C8782A]/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B3A2A]/60 uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-[#1C1C1C]">
              {loading ? "..." : `$${stats?.totalRevenue.toLocaleString() || 0}`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#C8782A]/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B3A2A]/60 uppercase tracking-wider mb-1">Packages Sold</p>
            <p className="text-2xl font-bold text-[#1C1C1C]">
              {loading ? "..." : stats?.totalSales || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#C8782A]/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B3A2A]/60 uppercase tracking-wider mb-1">Promo Codes Used</p>
            <p className="text-2xl font-bold text-[#1C1C1C]">
              {loading ? "..." : stats?.promoCodesUsedCount || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#C8782A]/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#6B3A2A]/60 uppercase tracking-wider mb-1">Credits Issued</p>
            <p className="text-2xl font-bold text-[#1C1C1C]">
              {loading ? "..." : totalCreditsIssued}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Plan Popularity Bar Chart */}
        <div className="bg-white rounded-2xl border border-[#C8782A]/20 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-[#C8782A]" size={20} />
            <h2 className="text-lg font-bold text-[#1C1C1C]">Plan Popularity</h2>
          </div>
          
          <div className="space-y-4 mt-4 h-[280px] overflow-y-auto pr-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-[#6B3A2A]/50">Loading chart...</div>
            ) : (
              frontendPlanPopularity.map((plan, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#1C1C1C]">{plan.name}</span>
                    <span className="font-semibold text-[#6B3A2A]">{plan.count} Sales</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF5EE] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#C8782A] rounded-full transition-all duration-1000"
                      style={{ width: `${(plan.count / maxPopularity) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Revenue by Plan Chart */}
        <div className="bg-white rounded-2xl border border-[#C8782A]/20 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-[#C8782A]" size={20} />
            <h2 className="text-lg font-bold text-[#1C1C1C]">Revenue by Plan</h2>
          </div>
          
          <div className="h-[280px] w-full mt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-[#6B3A2A]/50">Loading chart...</div>
            ) : revenueChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-[#6B3A2A]/50">No paid transactions yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={revenueChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="amount"
                    stroke="none"
                  >
                    {revenueChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #C8782A40', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, 'Revenue']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-[#C8782A]/20 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#C8782A]/10 bg-[#FAF5EE]/30 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#1C1C1C] whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
            Transaction History
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <button type="submit" className="absolute left-3 text-[#C8782A]/60 hover:text-[#C8782A] transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-[#C8782A]/20 bg-white text-sm outline-none focus:ring-2 focus:ring-[#C8782A]/30 w-full sm:w-64 shadow-sm"
              />
            </form>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-[#C8782A]/20 bg-white text-sm outline-none focus:ring-2 focus:ring-[#C8782A]/30 text-[#6B3A2A] shadow-sm cursor-pointer"
                >
                  <option value="All">All Plans</option>
                  {uniquePlans.map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8782A]/60" />
              </div>

              <div className="relative">
                <select
                  value={filterPromo}
                  onChange={(e) => setFilterPromo(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-[#C8782A]/20 bg-white text-sm outline-none focus:ring-2 focus:ring-[#C8782A]/30 text-[#6B3A2A] shadow-sm cursor-pointer"
                >
                  <option value="All">All Promo Codes</option>
                  <option value="None">No Promo Code</option>
                  <option value="ST">Starter (ST)</option>
                  <option value="DE">Deluxe (DE)</option>
                  <option value="UL">Ultimate (UL)</option>
                  <option value="PP">Pro Plan (PP)</option>
                  <option value="UN">Unlimited (UN)</option>
                </select>
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8782A]/60" />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-[#C8782A]/20 bg-white text-sm outline-none focus:ring-2 focus:ring-[#C8782A]/30 text-[#6B3A2A] shadow-sm cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Activity className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8782A]/60" />
              </div>
            </div>

            <button
              onClick={fetchData}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-[#C8782A]/20 text-[#6B3A2A] hover:bg-[#FAF5EE] transition-all bg-white shadow-sm whitespace-nowrap"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF5EE]/50 border-b border-[#C8782A]/20">
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider">Employer</th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider">Plan & Details</th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider">Amount & Method</th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8782A]/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B3A2A]/60">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C8782A]" />
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B3A2A]/60">
                    <Receipt className="w-8 h-8 mx-auto mb-3 text-[#C8782A]/40" />
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-[#FAF5EE]/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#1C1C1C] font-medium">
                        {new Date(tx.purchasedAt).toLocaleDateString()}
                      </span>
                      <div className="text-[11px] text-[#6B3A2A]/60 mt-0.5">
                        {new Date(tx.purchasedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#1C1C1C]">{tx.employerName}</span>
                        <span className="text-xs text-[#6B3A2A]/70 mt-0.5">{tx.employerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1C1C1C]">{tx.packageName}</span>
                        <span className="text-xs text-[#C8782A] mt-0.5">
                          {tx.unlimitedJobs ? "Unlimited Jobs" : `+${tx.creditsAdded} Credits`}
                          {/* {tx.jobPostExpiryDays > 0 && ` (${tx.jobPostExpiryDays} Days Expiry)`} */}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1C1C1C]">${tx.amount.toFixed(2)}</span>
                        {tx.promoCodeUsed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase text-purple-600 font-semibold mt-0.5 tracking-wider">
                            <Tag size={10} />
                           ({tx.promoCodeUsed})
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase text-[#6B3A2A]/60 font-semibold mt-0.5 tracking-wider">
                            {tx.paymentMethod}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${tx.status.toLowerCase() === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                          tx.status.toLowerCase() === 'failed' ? 'bg-rose-100 text-rose-700' : 
                          'bg-amber-100 text-amber-700'}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && filteredTransactions.length > itemsPerPage && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C8782A]/20 text-[#C8782A] bg-white hover:bg-[#FAF5EE] disabled:opacity-50 disabled:hover:bg-white transition-all text-sm font-semibold shadow-sm"
          >
            <ChevronLeft size={16} />
            Prev
          </button>
          <span className="text-sm font-medium text-[#6B3A2A]/80">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C8782A]/20 text-[#C8782A] bg-white hover:bg-[#FAF5EE] disabled:opacity-50 disabled:hover:bg-white transition-all text-sm font-semibold shadow-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
