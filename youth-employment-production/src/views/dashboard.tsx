"use client";

import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Link } from "@/router";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Eye,
  Edit,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  Plus,
  Building2,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Crown,
  ChevronDown,
} from "lucide-react";

// ============ SKELETON COMPONENTS (Mobile Optimized) ============
const Skeleton = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded ${className}`}
  />
);

const DashboardSkeleton = () => (
  <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-8 px-4 sm:py-12">
    <div className="mx-auto max-w-7xl">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 sm:h-4 sm:w-32" />
          <Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />
          <Skeleton className="h-3 w-56 sm:h-4 sm:w-80" />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Skeleton className="h-9 w-28 sm:h-10 sm:w-32 rounded-lg" />
          <Skeleton className="h-9 w-20 sm:h-10 sm:w-24 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column Skeleton */}
        <div className="flex-1 space-y-5 sm:space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl sm:h-36" />
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Skeleton className="h-6 w-32 sm:h-7 sm:w-40" />
              <Skeleton className="h-5 w-16 sm:h-6 sm:w-20 rounded-full" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-xl p-3 sm:p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-40 sm:h-6 sm:w-48" />
                      <Skeleton className="h-3 w-28 sm:h-4 sm:w-32" />
                      <Skeleton className="h-3 w-36 sm:h-4 sm:w-40" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-14 sm:h-8 sm:w-16 rounded-md" />
                      <Skeleton className="h-7 w-14 sm:h-8 sm:w-16 rounded-md" />
                      <Skeleton className="h-7 w-14 sm:h-8 sm:w-16 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:w-96 space-y-5 sm:space-y-6">
          <Skeleton className="h-56 w-full rounded-2xl sm:h-64" />
          <Skeleton className="h-64 w-full rounded-2xl sm:h-72" />
          <Skeleton className="h-40 w-full rounded-2xl sm:h-44" />
        </div>
      </div>
    </div>
  </div>
);

// ============ TYPES ============
interface EmployerProfile {
  businessName: string;
  phoneNumber?: string;
  province?: string;
  packageName: string;
  packageStatus: string;
  remainingCredits: number;
  totalCreditsPurchased: number;
  unlimitedJobs: boolean;
  isFreePlan: boolean;
  jobPostExpiryDays: number;
  expiresAt?: string | null;
}

interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  username?: string;
  accountType?: string;
  employerProfile?: EmployerProfile | null;
}

interface PackageData {
  id: string;
  packageName: string;
  paymentMethod?: string | null;
  remainingCredits: number;
  totalCreditsPurchased: number;
  unlimitedJobs: boolean;
  isFreePlan: boolean;
  jobPostExpiryDays: number;
  status: string;
  expiresAt?: string | null;
  purchasedAt?: string | null;
}

interface Job {
  jobType: string;
  id: string;
  jobUniqueId: string;
  title: string;
  company: string;
  location: string;
  province: string;
  employmentType: string;
  category: string;
  status: "active" | "draft" | "closed" | "expired";
  jobPostingDate: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
  salary?: string;
  salaryPeriod?: string;
}

// ============ HELPERS ============
const formatDate = (dateString?: string, locale: string = "en-CA") => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const isUtcDateOnly = typeof dateString === "string" &&
    (/^\d{4}-\d{2}-\d{2}$/.test(dateString) ||
     dateString.endsWith("T00:00:00.000Z") ||
     dateString.endsWith("T00:00:00Z"));

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: isUtcDateOnly ? "UTC" : "America/Edmonton",
  });
};

const formatSalary = (salary?: string, period?: string) => {
  if (!salary) return null;
  const parsed = Number(salary);
  if (Number.isNaN(parsed)) return null;
  return `${parsed.toLocaleString()}${period ? ` / ${period}` : ""}`;
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [_packageLoading, setPackageLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setError("Unable to load account details.");
        }
      } catch {
        setError("Unable to load account details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch package data
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch("/api/employer/package", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setPackageData(data.package);
        }
      } catch (error) {
        console.error("Failed to fetch package:", error);
      } finally {
        setPackageLoading(false);
      }
    };
    fetchPackage();
  }, []);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs/my-jobs", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    setDeletingJobId(jobId);

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        toast.success("Job posting deleted successfully.");
      } else {
        toast.error(data.error || "Failed to delete job");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      setStatusUpdatingId(jobId);

      const nextStatus = currentStatus === "active" ? "closed" : "active";

      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update job");
      }

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: nextStatus,
              }
            : job,
        ),
      );
      toast.success(`Job marked as ${nextStatus}.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <section className="bg-gradient-to-b from-slate-50 to-white min-h-screen flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-100 shadow-xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Unable to Load Dashboard
          </h1>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
          >
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  const profile = user?.employerProfile;
  const packageName =
    packageData?.packageName || profile?.packageName || "Free Plan";
  const packageStatus =
    packageData?.status || profile?.packageStatus || "Active";
  const remainingCredits =
    packageData?.remainingCredits ?? profile?.remainingCredits ?? 0;
  const totalCreditsPurchased =
    packageData?.totalCreditsPurchased ?? profile?.totalCreditsPurchased ?? 0;
  const unlimitedJobs =
    packageData?.unlimitedJobs ?? profile?.unlimitedJobs ?? false;
  const isFreePlan = packageData?.isFreePlan ?? profile?.isFreePlan ?? true;
  const jobPostExpiryDays =
    packageData?.jobPostExpiryDays ?? profile?.jobPostExpiryDays ?? 180;
  const packageExpiresAt = packageData?.expiresAt ?? profile?.expiresAt ?? null;
  const canPostJob = unlimitedJobs || remainingCredits > 0;

  const activeJobsCount = jobs.filter((j) => j.status === "active").length;
  const closedJobsCount = jobs.filter((j) => j.status === "closed").length;

  return (
    <>
      <Helmet>
        <title>Employer Dashboard | Youth Employment Canada</title>
      </Helmet>

      <section className="bg-[#FAFCFF] min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8 sm:mb-10">
            <div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Welcome back,{" "}
                {user?.firstName || user?.name?.split(" ")[0] || "Employer"} 👋
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Manage your jobs, credits and hiring activity from your control
                center.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* LEFT - Workspace Area */}
            <div className="lg:col-span-2 space-y-6 w-full">
              {/* ACTION BANNER */}
              <div
                className={`relative overflow-hidden rounded-2xl p-6 sm:p-7 text-white shadow-xl border ${
                  canPostJob
                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-700/20"
                    : "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-900"
                }`}
              >
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-lg pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="max-w-md">
                    <h3 className="text-xl font-bold tracking-tight mb-1.5">
                      {canPostJob
                        ? "Ready to scale your team?"
                        : "Hiring Paused • No Credits Left"}
                    </h3>
                    <p className="text-blue-100/80 text-sm leading-relaxed">
                      {canPostJob
                        ? "Post a new job requisition now and leverage our active community network instantly."
                        : "Your active credits are exhausted. Re-up or update your existing platform plan to resume postings."}
                    </p>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    {canPostJob ? (
                      <Link to="/post-a-job" className="block w-full">
                        <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold px-5 py-5 rounded-xl shadow-md border border-white transition-all">
                          <Plus size={16} className="mr-2 stroke-[2.5]" />
                          Create Job Posting
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/pricing" className="block w-full">
                        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold px-5 py-5 rounded-xl shadow-md transition-all">
                          Upgrade Account
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD-STYLE RECENT JOBS MANAGEMENT CARD */}
              <div className="bg-transparent space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 border border-slate-100 rounded-2xl shadow-sm">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Recent Job Openings
                    </h2>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Manage, monitor and update your active job postings
                    </p>
                  </div>

                  <span className="self-start sm:self-center text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full tracking-wide">
                    {jobs.length} Total Jobs
                  </span>
                </div>

                {jobsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-white border border-blue-100/50 rounded-2xl p-6 h-64 animate-pulse space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <div className="h-5 w-1/2 bg-slate-100 rounded-lg" />
                          <div className="h-6 w-16 bg-slate-100 rounded-full" />
                        </div>
                        <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="h-4 bg-slate-100 rounded-md" />
                          <div className="h-4 bg-slate-100 rounded-md" />
                          <div className="h-4 bg-slate-100 rounded-md" />
                          <div className="h-4 bg-slate-100 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-blue-200/60 rounded-2xl bg-blue-50/10">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 border border-blue-100 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase size={22} />
                    </div>
                    <p className="text-slate-900 font-bold mb-1">
                      No positions archived yet
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5 leading-relaxed">
                      Deploy your first placement campaign to start sourcing
                      talent instantly.
                    </p>
                  </div>
                ) : (
                  /* RESPONSIVE BLUE-THEMED CARD GRID SYSTEM */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {jobs.slice(0, 10).map((job) => (
                      <div
                        key={job.id}
                        className="group bg-white border border-slate-100 hover:border-blue-200/80 rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between p-5 sm:p-6 transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Top Accent line on card hover */}
                        {/* <div className="absolute top-0 inset-x-0 h-[3px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" /> */}

                        <div>
                          {/* TOP HEADER: Title & Dynamic Status Dropdown/Badge */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors duration-200 cursor-pointer truncate flex-1">
                              {job.title}
                            </h3>

                            {/* Standard Status Controls Button with Adaptive Sizing */}
                            <button
                              onClick={() =>
                                handleJobStatus(job.id, job.status)
                              }
                              disabled={statusUpdatingId === job.id}
                              className={`shrink-0 flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full border transition-all duration-200 shadow-sm ${
                                job.status === "active"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {statusUpdatingId === job.id ? (
                                <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" />
                              ) : (
                                <>
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      job.status === "active"
                                        ? "bg-blue-500"
                                        : "bg-slate-400"
                                    }`}
                                  />
                                  <span className="uppercase tracking-wider text-[10px]">
                                    {job.status}
                                  </span>
                                  <ChevronDown
                                    size={11}
                                    className="opacity-70"
                                  />
                                </>
                              )}
                            </button>
                          </div>

                          {/* Subtitle: Corporate Identifier */}
                          <p className="text-slate-500 font-semibold text-xs flex items-center gap-1.5 mb-5">
                            <Building2 size={13} className="text-blue-600/70" />
                            <span>{job.company}</span>
                          </p>

                          {/* 2-Column Content Data Grid */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-slate-600 text-xs font-medium mb-5">
                            <span className="flex items-center gap-1.5 truncate">
                              <MapPin size={14} className="text-blue-600/50" />
                              {job.location?.split(",")[0] || job.province}
                            </span>
                            <span className="flex items-center gap-1.5 truncate">
                              <Briefcase
                                size={14}
                                className="text-blue-600/50"
                              />
                              {job.jobType || "Full-time"}
                            </span>
                            <span className="flex items-center gap-1.5 font-bold text-slate-800 truncate">
                              <DollarSign
                                size={14}
                                className="text-blue-600/60 stroke-[2.5]"
                              />
                              {job.salary
                                ? formatSalary(job.salary, job.salaryPeriod)
                                : "N/A"}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-400 truncate text-[11px]">
                              <Calendar size={14} className="text-slate-300" />
                              Posted: {formatDate(job.jobPostingDate)}
                            </span>
                          </div>

                          {/* Tags Section */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-6">
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider text-blue-700 bg-blue-50/80 border border-blue-100 px-2 py-0.5 rounded-md uppercase">
                              JOB-ID
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md tracking-wide">
                              #
                              {job.id?.slice(-5).toUpperCase() || "REQUISITION"}
                            </span>
                          </div>
                        </div>

                        {/* BOTTOM ACTION BUTTONS: Modern Clean Layout */}
                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mt-auto">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="w-full"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-9 text-xs font-bold text-slate-700 border-slate-200 bg-white hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                            >
                              <Eye
                                size={13}
                                className="text-slate-400 group-hover:text-blue-500"
                              />
                              View
                            </Button>
                          </Link>

                          <Link to={`/edit-job/${job.id}`} className="w-full">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-9 text-xs font-bold text-slate-700 border-slate-200 bg-white hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                            >
                              <Edit
                                size={13}
                                className="text-slate-400 group-hover:text-blue-500"
                              />
                              Edit
                            </Button>
                          </Link>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deletingJobId === job.id}
                            className="h-9 text-xs font-bold text-red-600 border-red-100 bg-red-50/30 hover:bg-red-50 hover:border-red-200 rounded-xl w-full flex items-center justify-center gap-1 transition-all"
                          >
                            {deletingJobId === job.id ? (
                              <div className="animate-spin h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full" />
                            ) : (
                              <>
                                <Trash2 size={13} className="text-red-500/80" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT - Context Analytics Columns */}
            <div className="space-y-6 w-full lg:w-auto">
              {/* PLATFORM METRICS GRID — BRAND BLUE THEME */}
              <div className="grid grid-cols-2 gap-4">
                {/* Active Jobs Card */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Active Jobs
                    </span>
                    <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <TrendingUp size={14} className="stroke-[2.5]" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {activeJobsCount}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">
                    Currently live postings
                  </p>
                </div>

                {/* Closed Jobs Card */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Closed Jobs
                    </span>
                    <div className="w-7 h-7 bg-blue-50/60 text-blue-500/80 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Briefcase size={14} className="stroke-[2]" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {closedJobsCount}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">
                    Closed or archived jobs
                  </p>
                </div>

                {/* Credits Left Card - Main Interactive Blue Focus */}
                <div className="bg-gradient-to-br from-blue-50/50 via-white to-white rounded-xl p-4 border border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-md pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-blue-600/80 uppercase tracking-wider">
                      Credits Left
                    </span>
                    <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors shadow-sm">
                      <DollarSign size={14} className="stroke-[2.5]" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-blue-600 tracking-tight">
                    {unlimitedJobs ? "∞" : remainingCredits}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">
                    Available job posting credits
                  </p>
                </div>

                {/* Total Jobs Card */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Jobs
                    </span>
                    <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Users size={14} className="stroke-[2]" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {jobs.length}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">
                    All jobs created so far
                  </p>
                </div>
              </div>

              {/* COMPANY DETAILS SECTION */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-50">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700">
                    <Building2 size={15} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                    Corporate Identity
                  </h3>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">
                  {profile?.businessName || user?.name || "Employer"}
                </h2>

                <div className="space-y-2 text-xs font-medium">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400">Primary Contact</span>
                    <span className="text-slate-700 truncate max-w-[170px]">
                      {user?.email}
                    </span>
                  </div>

                  {profile?.phoneNumber && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-400">Phone Matrix</span>
                      <span className="text-slate-700">
                        {profile.phoneNumber}
                      </span>
                    </div>
                  )}

                  {profile?.province && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400">Jurisdiction</span>
                      <span className="text-slate-700">{profile.province}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* PREMIUM PACKAGE COMPONENT CARD */}
              <div className="bg-gradient-to-b from-blue-900 to-blue-950 border border-slate-800 rounded-2xl p-5 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-1.5 bg-white/10 rounded-lg border border-white/5 text-blue-400">
                    <Package size={15} />
                  </div>

                  <h3 className="font-bold text-sm tracking-tight text-slate-200">
                    Current Employer Plan
                  </h3>
                </div>

                <div className="flex items-baseline justify-between mb-4">
                  <p className="text-2xl font-black text-white tracking-tight">
                    {packageName}
                  </p>

                  {isFreePlan && (
                    <span className="text-[10px] tracking-wider bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-md font-bold text-slate-300 uppercase">
                      Free Plan
                    </span>
                  )}

                  {unlimitedJobs && (
                    <span className="text-[10px] tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md font-extrabold flex items-center gap-1 uppercase">
                      <Crown size={10} className="fill-current" />
                      Unlimited
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-xs font-medium text-slate-300">
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Package Status</span>

                    <span className="font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[11px]">
                      {packageStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Remaining Credits</span>

                    <span className="font-extrabold text-white">
                      {unlimitedJobs
                        ? "Unlimited Jobs"
                        : `${remainingCredits} Credits`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">
                      Total Credits Purchased
                    </span>

                    <span className="text-slate-100">
                      {totalCreditsPurchased}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Purchased On</span>

                    <span className="text-slate-100">
                      {formatDate(packageData?.purchasedAt || "")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Job Duration</span>

                    <span className="text-slate-100">
                      {jobPostExpiryDays} Days
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Payment Method</span>

                    <span className="text-slate-100">
                      {packageData?.paymentMethod || "N/A"}
                    </span>
                  </div>

                  {packageExpiresAt && (
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-400">Package Expiry</span>

                      <span className="text-amber-400 font-semibold">
                        {formatDate(packageExpiresAt)}
                      </span>
                    </div>
                  )}
                </div>

                {!canPostJob && (
                  <Link to="/pricing" className="block mt-5">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg text-xs">
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
