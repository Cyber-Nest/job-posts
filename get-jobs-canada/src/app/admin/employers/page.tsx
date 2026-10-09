"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Building2,
  MapPin,
  Briefcase,
  Package as PackageIcon,
  RefreshCw,
  Globe,
  ChevronRight,
  User,
  Mail,
  ChevronLeft,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface EmployerData {
  _id: string;
  orgName: string;
  province: string;
  website: string;
  package: { 
    packageName: string; 
    status: string;
    totalCreditsPurchased?: number;
    remainingCredits?: number;
    unlimitedJobs?: boolean;
  } | null;
  jobCount: number;
  createdAt: string;
  name?: string;
  email?: string;
}

export default function AdminEmployersPage() {
  const [allEmployers, setAllEmployers] = useState<EmployerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchEmployers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/employers`);
      const data = await res.json();
      if (data.success) {
        setAllEmployers(data.employers);
      } else {
        toast.error("Failed to load employers.");
      }
    } catch {
      toast.error("Network error loading employers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployers();
  }, [fetchEmployers]);

  // Filtering
  const filteredEmployers = allEmployers.filter((emp) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (emp.orgName && emp.orgName.toLowerCase().includes(term)) ||
      (emp.province && emp.province.toLowerCase().includes(term)) ||
      (emp.name && emp.name.toLowerCase().includes(term)) ||
      (emp.email && emp.email.toLowerCase().includes(term))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployers.length / itemsPerPage) || 1;
  const paginatedEmployers = filteredEmployers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Employer Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View employers, active packages, and manage their job postings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search employer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full md:w-64 transition-all"
            />
          </form>
          <button
            onClick={fetchEmployers}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 animate-pulse h-52" />
          ))}
        </div>
      ) : filteredEmployers.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 bg-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Employers Found
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            We could not find any employers matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedEmployers.map((emp) => (
            <div
              key={emp._id}
              className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3
                        className="font-bold text-base text-slate-900 line-clamp-1"
                        title={emp.orgName}
                      >
                        {emp.orgName}
                      </h3>
                      {emp.province && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <MapPin size={12} className="text-slate-400" />
                          <span>{emp.province}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                      <PackageIcon size={14} className="text-emerald-600" />
                      Current Plan
                    </span>
                    <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs">
                      {emp.package ? emp.package.packageName : "No Plan"}
                    </span>
                  </div>

                  {emp.name && (
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-2 text-slate-500 font-medium">
                        <User size={14} className="text-emerald-600" />
                        Contact
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                        {emp.name}
                      </span>
                    </div>
                  )}

                  {emp.email && (
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-2 text-slate-500 font-medium">
                        <Mail size={14} className="text-emerald-600" />
                        Email
                      </span>
                      <a href={`mailto:${emp.email}`} className="font-semibold text-emerald-600 hover:underline truncate max-w-[160px]">
                        {emp.email}
                      </a>
                    </div>
                  )}

                  {emp.website && (
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-2 text-slate-500 font-medium">
                        <Globe size={14} className="text-emerald-600" />
                        Website
                      </span>
                      <a href={emp.website.startsWith("http") ? emp.website : `https://${emp.website}`} target="_blank" rel="noreferrer" className="font-semibold text-emerald-600 hover:underline truncate max-w-[160px]">
                        {emp.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                      <Briefcase size={14} className="text-emerald-600" />
                      Total Jobs
                    </span>
                    <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md text-xs">
                      {emp.jobCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                      <CreditCard size={14} className="text-emerald-600" />
                      Total Credits
                    </span>
                    <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md text-xs">
                      {emp.package?.unlimitedJobs ? "Unlimited" : emp.package?.totalCreditsPurchased || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      Used Credits
                    </span>
                    <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md text-xs">
                      {emp.package?.unlimitedJobs 
                        ? "N/A" 
                        : ((emp.package?.totalCreditsPurchased || 0) - (emp.package?.remainingCredits || 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 p-3">
                <Link
                  href={`/admin/employers/${emp._id}`}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-2 rounded-xl hover:bg-emerald-700 transition-colors text-xs sm:text-sm shadow-sm"
                >
                  View Job Posts
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredEmployers.length > itemsPerPage && (
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
