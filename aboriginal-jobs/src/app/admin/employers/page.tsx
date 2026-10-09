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

  //Filtering
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#1C1C1C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Employer Management
          </h1>
          <p className="text-sm text-[#6B3A2A]/60 mt-1">
            View employers, their active packages, and manage their job posts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <button type="submit" className="absolute left-3 text-[#C8782A]/60 hover:text-[#C8782A] transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Search employer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-[#C8782A]/20 bg-white text-sm outline-none focus:ring-2 focus:ring-[#C8782A]/30 w-full md:w-64"
            />
          </form>
          <button
            onClick={fetchEmployers}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-[#C8782A]/20 text-[#6B3A2A] hover:bg-[#FAF5EE] transition-all bg-white"
          >
            <RefreshCw size={14} />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-[#C8782A]/10 animate-pulse h-48" />
          ))}
        </div>
      ) : filteredEmployers.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#C8782A]/20 rounded-2xl p-12 bg-white text-center">
          <Building2 className="w-16 h-16 text-[#C8782A]/40 mb-4" />
          <h3 className="text-lg font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
            No Employers Found
          </h3>
          <p className="text-sm text-[#6B3A2A]/60 max-w-sm mt-1 mb-6">
            We could not find any employers matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedEmployers.map((emp) => (
            <div
              key={emp._id}
              className="rounded-2xl border border-[#C8782A]/20 bg-white overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#C8782A]/10 flex items-center justify-center text-[#C8782A]">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3
                        className="font-bold text-lg text-[#1C1C1C] line-clamp-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        title={emp.orgName}
                      >
                        {emp.orgName}
                      </h3>
                      {emp.province && (
                        <div className="flex items-center gap-1 text-xs text-[#6B3A2A]/70 mt-1">
                          <MapPin size={12} />
                          <span>{emp.province}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium">
                      <PackageIcon size={14} className="text-[#C8782A]" />
                      Current Plan
                    </span>
                    <span className="font-semibold text-[#1C1C1C]">
                      {emp.package ? emp.package.packageName : "No Plan"}
                    </span>
                  </div>

                  {emp.name && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium">
                        <User size={14} className="text-[#C8782A]" />
                        Name
                      </span>
                      <span className="font-semibold text-[#1C1C1C] truncate max-w-[150px]">
                        {emp.name}
                      </span>
                    </div>
                  )}

                  {emp.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium">
                        <Mail size={14} className="text-[#C8782A]" />
                        Email
                      </span>
                      <a href={`mailto:${emp.email}`} className="font-semibold text-[#C8782A] hover:underline truncate max-w-[150px]">
                        {emp.email}
                      </a>
                    </div>
                  )}

                  {emp.website && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium">
                        <Globe size={14} className="text-[#C8782A]" />
                        Website
                      </span>
                      <a href={emp.website.startsWith("http") ? emp.website : `https://${emp.website}`} target="_blank" rel="noreferrer" className="font-semibold text-[#C8782A] hover:underline truncate max-w-[150px]">
                        {emp.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium">
                      <Briefcase size={14} className="text-[#C8782A]" />
                      Total Jobs
                    </span>
                    <span className="font-bold text-[#1C1C1C] bg-[#FAF5EE] px-2 py-0.5 rounded-md">
                      {emp.jobCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium">
                      <CreditCard size={14} className="text-[#C8782A]" />
                      Total Credits
                    </span>
                    <span className="font-bold text-[#1C1C1C] bg-[#FAF5EE] px-2 py-0.5 rounded-md">
                      {emp.package?.unlimitedJobs ? "Unlimited" : emp.package?.totalCreditsPurchased || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium">
                      <CheckCircle2 size={14} className="text-[#C8782A]" />
                      Used Credits
                    </span>
                    <span className="font-bold text-[#1C1C1C] bg-[#FAF5EE] px-2 py-0.5 rounded-md">
                      {emp.package?.unlimitedJobs 
                        ? "N/A" 
                        : ((emp.package?.totalCreditsPurchased || 0) - (emp.package?.remainingCredits || 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#C8782A]/10 bg-[#FAF5EE]/30 p-3">
                <Link
                  href={`/admin/employers/${emp._id}`}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-[#C8782A]/30 text-[#C8782A] font-semibold py-2 rounded-xl hover:bg-[#C8782A] hover:text-white transition-colors"
                >
                  View Posts
                  <ChevronRight size={16} />
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C8782A]/20 text-[#C8782A] bg-white hover:bg-[#FAF5EE] disabled:opacity-50 disabled:hover:bg-white transition-all text-sm font-semibold"
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C8782A]/20 text-[#C8782A] bg-white hover:bg-[#FAF5EE] disabled:opacity-50 disabled:hover:bg-white transition-all text-sm font-semibold"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
