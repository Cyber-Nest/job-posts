"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
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

const COLORS = ['#059669', '#0284C7', '#7C3AED', '#DB2777', '#0D9488', '#D97706', '#4F46E5'];

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
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Payment Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View transaction history, revenue statistics, and package sales.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {loading ? "..." : `$${stats?.totalRevenue.toLocaleString() || 0}`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Packages Sold</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {loading ? "..." : stats?.totalSales || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Promo Codes Used</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {loading ? "..." : stats?.promoCodesUsedCount || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Credits Issued</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {loading ? "..." : totalCreditsIssued}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Plan Popularity Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-emerald-600" size={20} />
            <h2 className="text-base font-bold text-slate-900">Plan Popularity</h2>
          </div>
          
          <div className="space-y-4 h-[280px] overflow-y-auto pr-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
            ) : (
              frontendPlanPopularity.map((plan, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-slate-800">{plan.name}</span>
                    <span className="font-bold text-slate-600">{plan.count} Sales</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                      style={{ width: `${(plan.count / maxPopularity) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Revenue by Plan Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-emerald-600" size={20} />
            <h2 className="text-base font-bold text-slate-900">Revenue by Plan</h2>
          </div>
          
          <div className="h-[280px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
            ) : revenueChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No paid transactions yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={revenueChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="amount"
                    stroke="none"
                  >
                    {revenueChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, 'Revenue']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900 whitespace-nowrap">
            Transaction History
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full sm:w-60 shadow-sm transition-all"
              />
            </form>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 shadow-sm cursor-pointer"
                >
                  <option value="All">All Plans</option>
                  {uniquePlans.map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterPromo}
                  onChange={(e) => setFilterPromo(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 shadow-sm cursor-pointer"
                >
                  <option value="All">All Promo Codes</option>
                  <option value="None">No Promo Code</option>
                  <option value="ST">Starter (ST)</option>
                  <option value="DE">Deluxe (DE)</option>
                  <option value="UL">Ultimate (UL)</option>
                  <option value="PP">Pro Plan (PP)</option>
                  <option value="UN">Unlimited (UN)</option>
                </select>
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 shadow-sm cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Activity className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={fetchData}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm whitespace-nowrap"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plan & Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount & Method</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    <Receipt className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-slate-900 font-semibold">
                        {new Date(tx.purchasedAt).toLocaleDateString()}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(tx.purchasedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-xs sm:text-sm">{tx.employerName}</span>
                        <span className="text-xs text-slate-400 mt-0.5">{tx.employerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 text-xs sm:text-sm">{tx.packageName}</span>
                        <span className="text-xs text-emerald-600 font-medium mt-0.5">
                          {tx.unlimitedJobs ? "Unlimited Jobs" : `+${tx.creditsAdded} Credits`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">${tx.amount.toFixed(2)}</span>
                        {tx.promoCodeUsed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase text-purple-600 font-bold mt-0.5 tracking-wider">
                            <Tag size={10} />
                            ({tx.promoCodeUsed})
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase text-slate-400 font-semibold mt-0.5 tracking-wider">
                            {tx.paymentMethod}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${tx.status.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                          tx.status.toLowerCase() === 'failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                          'bg-amber-50 text-amber-700 border border-amber-200'}`}
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all text-xs sm:text-sm font-semibold shadow-sm"
          >
            <ChevronLeft size={16} />
            Prev
          </button>
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all text-xs sm:text-sm font-semibold shadow-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
