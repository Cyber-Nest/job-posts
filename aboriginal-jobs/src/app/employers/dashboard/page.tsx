"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  Wifi,
  Leaf,
  Mail,
  Phone,
  ChevronDown,
  Hash,
  UserIcon,
  Download,
  Package,
  Crown,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth/auth-client";

/* ── Types ──────────────────────────────────────────────────────────── */
interface ApplyMethod {
  method: string;
  email?: string;
  phone?: string;
  mailAddress?: string;
  inPersonAddress?: string;
  inPersonTiming?: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  city: string;
  province: string;
  salary: string;
  salaryType: string;
  employmentType: string;
  category: string;
  nocCode: string;
  contactName?: string;
  jobId?: string;
  status: "active" | "closed" | "expired";
  remote: boolean;
  indigenousOwned: boolean;
  postedAt: string;
  expiresAt: string;
  descriptionHtml?: string;
  requirementsHtml?: string;
  applyMethods?: ApplyMethod[];
  experience?: string;
  startDate?: string;
  runDays?: string;
  website?: string;
  vacancies?: number;
  packageId?: string | null;
  postDate?: string;
  creditConsumed?: boolean;
}

interface Stats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
}

interface EmployerPackageData {
  id: string;
  packageName: string;
  remainingCredits: number;
  totalCreditsPurchased: number;
  unlimitedJobs: boolean;
  isFreePlan: boolean;
  jobPostExpiryDays: number;
  status: string;
  purchasedAt?: string | null;
  expiresAt?: string | null;

  paymentMethod?: string | null;
}

/* ── Helper Functions ───────────────────────────────────────────────── */
function formatDate(date: string) {
  if (!date) return "Not specified";
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function calculateClosingDate(
  postDate?: string | Date,
  runDays?: string,
): string {
  if (!postDate || !runDays) return "Not specified";

  const closingDate = new Date(postDate);
  closingDate.setDate(closingDate.getDate() + Number(runDays));

  return closingDate.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium border-0 px-2.5 py-0.5 rounded-full shadow-sm text-xs">
          Active
        </Badge>
      );
    case "closed":
      return (
        <Badge className="bg-neutral-500 hover:bg-neutral-600 text-white font-medium border-0 px-2.5 py-0.5 rounded-full shadow-sm text-xs">
          Closed
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-rose-600 hover:bg-rose-700 text-white font-medium border-0 px-2.5 py-0.5 rounded-full shadow-sm text-xs">
          Expired
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="font-medium text-xs rounded-full px-2.5 py-0.5"
        >
          {status}
        </Badge>
      );
  }
}

function getSalaryDisplay(salary: string, salaryType: string): string {
  if (!salary) return "Not specified";
  const typeMap: Record<string, string> = {
    hour: "/hr",
    week: "/wk",
    month: "/mo",
    year: "/yr",
  };
  return `${salary}${typeMap[salaryType] || ""}`;
}

/* ── Stat Card Component ────────────────────────────── */
function StatCard({
  title,
  value,
  icon,
  isLoading,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border border-[#C8782A]/10 bg-white shadow-sm relative overflow-hidden rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-6 pt-5">
          <Skeleton className="h-4 w-20 bg-neutral-200" />
          <Skeleton className="h-8 w-8 rounded-xl bg-neutral-200" />
        </CardHeader>
        <CardContent className="px-6 pb-5 pt-1">
          <Skeleton className="h-9 w-16 bg-neutral-200" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[#C8782A]/10 bg-white shadow-sm relative overflow-hidden group hover:border-[#C8782A]/30 transition-all duration-300 rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-6 pt-5">
        <CardTitle className="text-xs font-bold text-[#6B3A2A]/60 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="text-[#C8782A] bg-[#FAF5EE] p-2.5 rounded-xl border border-[#C8782A]/5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-5 pt-1">
        <div className="text-3xl font-extrabold text-[#1C1C1C] tracking-tight">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Current Package Card ───────────────────────────────────────────── */
function PackageCard({
  pkg,
  isLoading,
  canPostJob,
}: {
  pkg: EmployerPackageData | null;
  isLoading: boolean;
  canPostJob: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-[#C8782A]/10 bg-white shadow-sm overflow-hidden">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-9 w-9 rounded-xl bg-neutral-200" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-28 bg-neutral-200" />
              <Skeleton className="h-4 w-40 bg-neutral-200" />
            </div>
          </div>
          <Skeleton className="h-8 w-36 bg-neutral-200" />
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0 space-y-3">
          <Skeleton className="h-4 w-full bg-neutral-200" />
          <Skeleton className="h-4 w-5/6 bg-neutral-200" />
          <Skeleton className="h-4 w-4/6 bg-neutral-200" />
        </CardContent>
      </Card>
    );
  }

  const packageName = pkg?.packageName || "Free Plan";
  const packageStatus = pkg?.status || "Active";
  const remainingCredits = pkg?.remainingCredits ?? 0;
  const totalCreditsPurchased = pkg?.totalCreditsPurchased ?? 0;
  const unlimitedJobs = pkg?.unlimitedJobs ?? false;
  const isFreePlan = pkg?.isFreePlan ?? true;
  const jobPostExpiryDays = pkg?.jobPostExpiryDays ?? 30;

  return (
    <Card className="rounded-2xl border border-[#C8782A]/10 bg-gradient-to-br from-[#6B3A2A] via-[#8A4D2A] to-[#C8782A] text-white shadow-lg overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/10">
            <Package size={17} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-bold">
              Package Overview
            </p>
            <h3
              className="text-xl font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Current Package
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xl font-black tracking-tight">
            {packageName}
          </span>
          {isFreePlan && (
            <span className="text-[10px] uppercase tracking-wider bg-white/15 border border-white/10 px-2.5 py-0.5 rounded-md font-bold text-white/90">
              Free Plan
            </span>
          )}
          {unlimitedJobs && (
            <span className="text-[10px] uppercase tracking-wider bg-amber-300 text-[#1C1C1C] px-2.5 py-0.5 rounded-md font-extrabold flex items-center gap-1">
              <Crown size={10} className="fill-current" />
              Unlimited
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0 space-y-2.5 text-sm text-white/90">
        <div className="flex justify-between items-center py-1.5 border-b border-white/10">
          <span className="text-white/60">Status</span>
          <span className="font-semibold px-2 py-0.5 bg-white/15 rounded-full text-xs">
            {packageStatus}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-white/10">
          <span className="text-white/60">Credits Left</span>
          <span className="font-bold text-lg">
            {unlimitedJobs ? "∞" : remainingCredits}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-white/10">
          <span className="text-white/60">Total Purchased</span>
          <span className="font-semibold">{totalCreditsPurchased}</span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-white/10">
          <span className="text-white/60">Job Post Expiry</span>
          <span className="font-semibold">{jobPostExpiryDays} days</span>
        </div>

        {pkg?.purchasedAt && (
          <div className="flex justify-between items-center py-1.5 border-b border-white/10">
            <span className="text-white/60">Purchased On</span>
            <span className="font-semibold">{formatDate(pkg.purchasedAt)}</span>
          </div>
        )}

        {pkg?.expiresAt && (
          <div className="flex justify-between items-center py-1.5">
            <span className="text-white/60">Expiry Date</span>
            <span className="font-semibold text-amber-200">
              {formatDate(pkg.expiresAt)}
            </span>
          </div>
        )}

        {pkg?.paymentMethod && (
          <div className="flex justify-between items-center py-1.5 border-t border-white/10">
            <span className="text-white/60">Payment Method</span>

            <span className="font-semibold capitalize">
              {pkg.paymentMethod}
            </span>
          </div>
        )}
      </CardContent>

      {!canPostJob && (
        <CardFooter className="px-5 pb-5 pt-0">
          <Link href="/pricing" className="w-full">
            <Button className="w-full h-11 bg-white text-[#C8782A] hover:bg-[#FAF5EE] font-bold rounded-xl shadow-md shadow-black/5">
              Upgrade Plan
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

/* ── View Job Modal Component ───────────────────────────────────────── */
function ViewJobModal({
  job,
  open,
  onClose,
}: {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!job) return null;

  const getApplyMethodDisplay = (method: ApplyMethod) => {
    switch (method.method) {
      case "email":
        return { icon: Mail, label: "Email Address", value: method.email };
      case "phone":
        return { icon: Phone, label: "Phone Number", value: method.phone };
      case "mail":
        return {
          icon: MapPin,
          label: "Mail Address",
          value: method.mailAddress,
        };
      case "inPerson":
        return {
          icon: Building2,
          label: "In Person",
          value: method.inPersonAddress,
        };
      default:
        return null;
    }
  };

  const getStartDateDisplay = (startDate: string) => {
    if (!startDate) return "Not specified";
    const map: Record<string, string> = {
      asap: "As Soon As Possible",
      immediate: "Immediate Joining",
      "1week": "Within 1 Week",
      "2weeks": "Within 2 Weeks",
      "1month": "Within 1 Month",
    };
    return map[startDate] || startDate;
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col overflow-x-hidden rounded-2xl border border-neutral-100 shadow-2xl p-0 gap-0 bg-white">
        <div className="bg-gradient-to-br from-[#C8782A] via-[#BD6F23] to-[#A05D1A] px-6 py-6 text-white relative flex-shrink-0">
          <DialogHeader className="text-left">
            <DialogTitle
              className="text-2xl sm:text-3xl font-bold tracking-wide text-white pr-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {job.title}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-white/90 mt-2.5 font-medium text-sm tracking-wide">
              <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                <Building2 size={14} className="text-white/80" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                <MapPin size={14} className="text-white/80" />
                {job.city}, {job.province}
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                {job.jobId && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-md backdrop-blur-sm text-white/80 text-xs font-mono">
                    <Hash size={14} className="text-white/80" /> {job.jobId}
                  </span>
                )}
                {job.contactName && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-md backdrop-blur-sm text-white/80 text-xs">
                    <UserIcon size={14} className="text-white/80" />{" "}
                    {job.contactName}
                  </span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 max-h-[calc(90vh-140px)]">
          <div className="flex flex-wrap gap-2 pb-2 border-b border-neutral-100">
            {getStatusBadge(job.status)}
            {job.remote && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200/60 rounded-full px-3 py-0.5 text-xs font-semibold shadow-sm"
              >
                <Wifi size={12} className="mr-1.5" /> Remote
              </Badge>
            )}
            {job.indigenousOwned && (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-800 border-emerald-200/60 rounded-full px-3 py-0.5 text-xs font-semibold shadow-sm"
              >
                <Leaf size={12} className="mr-1.5" /> Indigenous-owned
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 p-5 bg-[#FAF5EE]/40 border border-[#C8782A]/10 rounded-xl">
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Employment Type
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1">
                {job.employmentType}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Vacancies
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1">
                {job.vacancies ?? "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Salary
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1">
                {getSalaryDisplay(job.salary, job.salaryType)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                NOC Code
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1">
                {job.nocCode || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Category
              </p>
              <p
                className="text-sm font-semibold text-neutral-800 mt-1 truncate"
                title={job.category}
              >
                {job.category}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Experience Required
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1">
                {job.experience || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Expected Start Date
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1">
                {getStartDateDisplay(job.startDate as any)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Run Duration
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1">
                {job.runDays ? `${job.runDays} Days` : "30 Days (default)"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Posted Date
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1">
                {formatDate(job.postDate as any)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60">
                Expiry Date
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1 text-rose-700">
                {calculateClosingDate(job.postDate as any, job.runDays as any)}
              </p>
            </div>
          </div>

          {job.website && (
            <div className="bg-[#FAF5EE]/30 border border-[#C8782A]/10 rounded-xl p-4">
              <p className="text-[11px] uppercase font-bold tracking-wider text-[#6B3A2A]/60 mb-1">
                Company Website
              </p>
              <a
                href={
                  job.website.startsWith("http")
                    ? job.website
                    : `https://${job.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#C8782A] hover:underline break-all"
              >
                {job.website}
              </a>
            </div>
          )}

          {job.descriptionHtml && (
            <div className="space-y-2">
              <h4 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <span className="w-1 h-4 bg-[#C8782A] rounded-full"></span>
                About the Role
              </h4>
              <div
                className="text-sm text-neutral-700 prose prose-neutral max-w-none [word-break:break-word] overflow-wrap-anywhere list-inside pl-1"
                dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
              />
            </div>
          )}

          {job.requirementsHtml && (
            <div className="pt-2 space-y-2">
              <h4 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <span className="w-1 h-4 bg-[#C8782A] rounded-full"></span>
                Qualifications & Requirements
              </h4>
              <div
                className="text-sm text-neutral-700 prose prose-neutral max-w-none [word-break:break-word] overflow-wrap-anywhere list-inside pl-1"
                dangerouslySetInnerHTML={{ __html: job.requirementsHtml }}
              />
            </div>
          )}

          {job.applyMethods && job.applyMethods.length > 0 && (
            <div className="border-t border-neutral-100 pt-5 space-y-3">
              <h4 className="font-bold text-neutral-900 text-base">
                How to Apply
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.applyMethods.map((method, idx) => {
                  const display = getApplyMethodDisplay(method);
                  if (!display) return null;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-[#FAF5EE]/30 border border-[#C8782A]/10 rounded-xl hover:bg-[#FAF5EE]/50 transition-colors min-w-0 w-full"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white border border-[#C8782A]/20 flex items-center justify-center flex-shrink-0 text-[#C8782A] shadow-sm">
                        <display.icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          {display.label}
                        </p>
                        <p className="text-xs font-semibold text-neutral-800 break-all mt-0.5 select-all">
                          {display.value}
                        </p>
                        {method.method === "inPerson" &&
                          method.inPersonTiming && (
                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#A05D1A] font-semibold bg-[#FAF5EE] border border-[#C8782A]/10 px-2 py-0.5 w-max rounded-md whitespace-normal">
                              <Clock size={11} className="flex-shrink-0" />{" "}
                              {method.inPersonTiming}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-3 px-6 py-4 bg-neutral-50 border-t border-neutral-100 rounded-b-2xl flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 rounded-xl h-10 px-5 font-semibold text-sm transition-colors"
          >
            Close
          </Button>
          <Link href={`/post-a-job?id=${job._id}`} passHref>
            <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl h-10 px-5 text-sm shadow-md shadow-[#C8782A]/10 transition-all flex items-center">
              <Edit size={14} className="mr-2" /> Edit Job
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Job Card Component  ─────────────────────────────── */
function JobCard({
  job,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onDownload,
  isDownloading,
}: {
  job: Job;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (jobId: string, newStatus: string) => void;
  onDownload: (jobId: string, jobTitle: string) => void;
  isDownloading?: boolean;
}) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    onStatusChange(job._id, newStatus);
    setIsUpdatingStatus(false);
  };

  return (
    <Card className="hover:shadow-md border border-[#C8782A]/10 hover:border-[#C8782A]/20 transition-all duration-300 rounded-2xl bg-white overflow-hidden flex flex-col group">
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle
              onClick={onView}
              className="text-lg font-bold text-[#1C1C1C] line-clamp-1 group-hover:text-[#C8782A] transition-colors cursor-pointer"
            >
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-1.5 mt-1">
              <Building2 size={13} className="text-[#C8782A] flex-shrink-0" />
              <span className="text-xs font-semibold text-[#6B3A2A]/70 truncate">
                {job.company}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="relative">
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
                className={`
                  text-xs px-2.5 py-1 rounded-full font-semibold cursor-pointer appearance-none
                  ${
                    job.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                      : job.status === "closed"
                        ? "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                  }
                  ${isUpdatingStatus ? "opacity-70 cursor-wait" : ""}
                  pr-6
                `}
              >
                <option value="active">
                  {isUpdatingStatus && job.status === "active"
                    ? "Updating..."
                    : "● Active"}
                </option>
                <option value="closed">
                  {isUpdatingStatus && job.status === "closed"
                    ? "Updating..."
                    : "○ Closed"}
                </option>
                <option value="expired">
                  {isUpdatingStatus && job.status === "expired"
                    ? "Updating..."
                    : "○ Expired"}
                </option>
              </select>

              {!isUpdatingStatus && (
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60"
                />
              )}

              {isUpdatingStatus && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Loader2
                    size={12}
                    className="animate-spin text-current"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 pb-4 flex-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs border-y border-neutral-50 py-3 my-1">
          <div className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium min-w-0">
            <MapPin
              size={13}
              className="text-[#C8782A] flex-shrink-0 opacity-80"
            />
            <span className="truncate">
              {job.city}, {job.province}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#6B3A2A]/80 font-medium">
            <Clock
              size={13}
              className="text-[#C8782A] flex-shrink-0 opacity-80"
            />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-2 text-[#6B3A2A]/80 font-bold">
            <DollarSign
              size={13}
              className="text-[#C8782A] flex-shrink-0 opacity-80"
            />
            <span>{getSalaryDisplay(job.salary, job.salaryType)}</span>
          </div>
          <div className="flex items-center gap-2 text-[#6B3A2A]/60 font-medium">
            <Calendar
              size={13}
              className="text-[#C8782A] flex-shrink-0 opacity-60"
            />
            <span className="truncate">
              Posted: {formatDate(job.postDate as any)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {typeof job.vacancies === "number" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-[#FAF5EE]/70 text-[#6B3A2A] border-[#C8782A]/15 rounded-md font-medium px-2 py-0"
            >
              <User size={10} className="mr-1" /> Vacancies: {job.vacancies}
            </Badge>
          )}
          {job.remote && (
            <Badge
              variant="outline"
              className="text-[10px] bg-blue-50/50 text-blue-700 border-blue-100 rounded-md font-medium px-2 py-0"
            >
              <Wifi size={10} className="mr-1" /> Remote
            </Badge>
          )}
          {job.indigenousOwned && (
            <Badge
              variant="outline"
              className="text-[10px] bg-[#7A9E7E]/10 text-[#4a7a4e] border-[#7A9E7E]/20 rounded-md font-medium px-2 py-0"
            >
              <Leaf size={10} className="mr-1" /> Indigenous
            </Badge>
          )}
          {job.jobId && (
            <Badge
              variant="outline"
              className="text-[10px] bg-neutral-100 text-neutral-600 border-neutral-300 rounded-md font-mono px-2 py-0"
            >
              <Hash size={10} className="mr-1" /> {job.jobId}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex gap-2 border-t border-neutral-50/50 bg-neutral-50/20">
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="flex-1 h-9 rounded-xl border-neutral-200 font-semibold text-xs text-neutral-600 hover:bg-[#C8782A]/5 hover:text-[#C8782A] hover:border-[#C8782A]/20 transition-all cursor-pointer"
        >
          <Eye size={13} className="sm:mr-1" />
          <span className="hidden sm:inline">View</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 h-9 rounded-xl border-neutral-200 font-semibold text-xs text-neutral-600 hover:bg-[#C8782A]/5 hover:text-[#C8782A] hover:border-[#C8782A]/20 transition-all cursor-pointer"
        >
          <Edit size={13} className="sm:mr-1" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex-1 h-9 rounded-xl font-semibold text-xs bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
        >
          <Trash2 size={13} className="sm:mr-1" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ── Delete Confirmation Modal ──────────────────────────────────────── */
function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  jobTitle,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  isLoading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-900">
            Delete Job Posting
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-sm mt-2 leading-relaxed">
            Are you sure you want to delete{" "}
            <strong className="text-[#C8782A] font-bold">
              &quot;{jobTitle}&quot;
            </strong>
            ? This action cannot be undone and will remove it from search
            listings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl h-10 border-neutral-200 text-neutral-600 font-medium"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl h-10 bg-rose-600 hover:bg-rose-700 font-semibold"
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin mr-2" />
            ) : (
              <Trash2 size={15} className="mr-2" />
            )}
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Job Skeleton Card Component─────────────────────────────── */
function JobSkeletonCard() {
  return (
    <Card className="border border-[#C8782A]/10 bg-white rounded-2xl overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 bg-neutral-200" />
            <Skeleton className="h-4 w-1/2 bg-neutral-200" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full bg-neutral-200" />
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 pb-4">
        <div className="space-y-2 border-y border-neutral-50 py-3 my-1">
          <Skeleton className="h-4 w-full bg-neutral-200" />
          <Skeleton className="h-4 w-2/3 bg-neutral-200" />
        </div>
        <div className="flex gap-1.5 mt-3">
          <Skeleton className="h-5 w-16 rounded-md bg-neutral-200" />
          <Skeleton className="h-5 w-20 rounded-md bg-neutral-200" />
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl bg-neutral-200" />
        <Skeleton className="h-9 flex-1 rounded-xl bg-neutral-200" />
        <Skeleton className="h-9 flex-1 rounded-xl bg-neutral-200" />
      </CardFooter>
    </Card>
  );
}

/* ── Full Dashboard Skeleton ────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="bg-gradient-to-b from-[#FAF5EE]/70 to-white min-h-[85vh] animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <div className="h-8 w-64 bg-[#C8782A]/15 rounded mb-2" />
            <div className="h-4 w-48 bg-neutral-200 rounded" />
          </div>
          <div className="h-11 w-36 bg-[#C8782A]/20 rounded-xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-[#C8782A]/10 h-[100px]"
            >
              <div className="h-4 w-24 bg-neutral-200 rounded mb-3" />
              <div className="h-8 w-16 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="h-11 flex-1 bg-neutral-100 rounded-xl" />
          <div className="h-11 w-full sm:w-[140px] bg-neutral-100 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <JobSkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard Component ───────────────────────────────────────── */
export default function EmployerDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [downloadingJobId, setDownloadingJobId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { session, isPending: sessionLoading } = useSession();

  const { data: packageResponse, isLoading: packageLoading } = useQuery({
    queryKey: ["employer-package", session?.user?.id],
    queryFn: async () => {
      const res = await fetch("/api/employer/package", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch package");
      return res.json();
    },
    enabled: !!session?.user,
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: [
      "employer-jobs",
      statusFilter,
      searchQuery,
      currentPage,
      session?.user?.id,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());

      const res = await fetch(`/api/employer/jobs?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
    enabled: !!session?.user,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["employer-stats", session?.user?.id],
    queryFn: async () => {
      const res = await fetch("/api/employer/stats", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!session?.user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete job");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["employer-stats"] });
      setJobToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete job");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      jobId,
      status,
    }: {
      jobId: string;
      status: string;
    }) => {
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Job status updated");
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["employer-stats"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination || { total: 0, totalPages: 1 };
  const stats = statsData?.stats || {
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
  };

  const packageData: EmployerPackageData | null =
    packageResponse?.package || null;
  const remainingCredits = packageData?.remainingCredits ?? 0;
  const unlimitedJobs = packageData?.unlimitedJobs ?? false;
  const canPostJob = packageLoading
    ? true
    : unlimitedJobs || remainingCredits > 0;
  const packageHasEnded = !packageLoading && !canPostJob;

  const handleDelete = () => {
    if (jobToDelete) {
      deleteMutation.mutate(jobToDelete._id);
    }
  };

  const handleEdit = (jobId: string) => {
    router.push(`/post-a-job?id=${jobId}`);
  };

  const handleStatusChange = (jobId: string, newStatus: string) => {
    statusMutation.mutate({ jobId, status: newStatus });
  };

  const handleDownload = async (jobId: string, jobTitle: string) => {
    setDownloadingJobId(jobId);
    try {
      toast.loading("Preparing download...", { id: "download" });

      const response = await fetch(`/api/jobs/${jobId}/download`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${jobTitle.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Download started!", { id: "download" });
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to download job posting",
        {
          id: "download",
        },
      );
    } finally {
      setDownloadingJobId(null);
    }
  };

  if (sessionLoading) {
    return <DashboardSkeleton />;
  }

  if (!session?.user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-sm w-full border border-[#C8782A]/10 p-8 rounded-2xl bg-[#FAF5EE]/20 shadow-sm">
          <AlertCircle
            size={44}
            className="text-amber-600 mx-auto mb-4 opacity-90"
          />
          <h2 className="text-xl font-bold text-[#1C1C1C] tracking-wide">
            Authentication Required
          </h2>
          <p className="text-sm text-[#6B3A2A]/70 mt-1.5 leading-relaxed">
            Please authenticate your account session to safely load your
            employer console.
          </p>
          <Link href="/login" className="block mt-5">
            <Button className="w-full h-11 bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl shadow-md shadow-[#C8782A]/10">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ViewJobModal
        job={viewJob}
        open={!!viewJob}
        onClose={() => setViewJob(null)}
      />

      <DeleteConfirmModal
        open={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDelete}
        jobTitle={jobToDelete?.title || ""}
        isLoading={deleteMutation.isPending}
      />

      <div className="bg-gradient-to-b from-[#FAF5EE]/70 to-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div>
              <h1
                className="text-3xl font-extrabold text-[#1C1C1C] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Employer Dashboard
              </h1>
              <p className="text-sm font-medium text-[#6B3A2A]/60 mt-1">
                Workspace panel • Welcome back,{" "}
                <span className="text-[#C8782A] font-bold">
                  {session.user.name || session.user.email}
                </span>
              </p>
            </div>

            {packageLoading ? (
              <div className="h-11 w-40 rounded-xl bg-[#C8782A]/15 animate-pulse" />
            ) : canPostJob ? (
              <Link href="/post-a-job">
                <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-bold h-11 px-5 rounded-xl shadow-md shadow-[#C8782A]/15 active:scale-[0.99] transition-all cursor-pointer">
                  <Plus size={16} className="mr-2 stroke-[2.5]" />
                  Post New Job
                </Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-11 px-5 rounded-xl shadow-md active:scale-[0.99] transition-all cursor-pointer">
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {packageHasEnded && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/80 px-5 py-4 text-rose-700 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">
                  Your job posting credits are exhausted.
                </p>
                <p className="text-sm mt-0.5 text-rose-600/90">
                  Upgrade your plan to continue posting jobs.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={<Briefcase size={18} />}
            isLoading={statsLoading}
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={<CheckCircle size={18} className="text-emerald-600" />}
            isLoading={statsLoading}
          />
          <StatCard
            title="Closed Jobs"
            value={stats.closedJobs}
            icon={<X size={18} className="text-neutral-500" />}
            isLoading={statsLoading}
          />
          <StatCard
            title="Credits Left"
            value={
              packageLoading ? "..." : unlimitedJobs ? "∞" : remainingCredits
            }
            icon={<DollarSign size={18} className="text-[#C8782A]" />}
            isLoading={packageLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B3A2A]/50"
            />
            <Input
              placeholder="Search postings by title, company, or city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-11 border-neutral-200 focus-visible:ring-[#C8782A]/30 text-sm rounded-xl placeholder:text-neutral-400"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 pl-4 pr-10 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/20 focus:border-[#C8782A] appearance-none min-w-[140px] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
              <option value="expired">Expired Only</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">
          <div>
            {jobsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <JobSkeletonCard key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <Card className="border border-dashed border-[#C8782A]/20 bg-[#FAF5EE]/10 text-center py-16 rounded-2xl">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-[#FAF5EE] border border-[#C8782A]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C8782A]/70">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1C1C1C]">
                    No listings match criteria
                  </h3>
                  <p className="text-sm text-[#6B3A2A]/70 mt-1 max-w-sm mx-auto leading-relaxed">
                    {searchQuery || statusFilter !== "all"
                      ? "We couldn't find anything matching your search. Try resetting filters."
                      : packageHasEnded
                        ? "Your credits are finished. Upgrade your plan to create new job postings."
                        : "You haven't initialized any job listings on your business dashboard."}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
                      {canPostJob ? (
                        <Link href="/post-a-job" className="inline-block">
                          <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold rounded-xl h-10 px-5 shadow-sm">
                            <Plus size={15} className="mr-1.5" /> Post Your
                            First Job
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/pricing" className="inline-block">
                          <Button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl h-10 px-5 shadow-sm">
                            Upgrade Plan
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {jobs.map((job: Job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onView={() => setViewJob(job)}
                      onEdit={() => handleEdit(job._id)}
                      onDelete={() => setJobToDelete(job)}
                      onStatusChange={handleStatusChange}
                      onDownload={handleDownload}
                      isDownloading={downloadingJobId === job._id}
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-neutral-200 h-9 w-9 rounded-xl p-0 flex items-center justify-center"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <div className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 h-9 flex items-center justify-center text-xs font-bold text-neutral-700 shadow-sm">
                      Page {currentPage} of {pagination.totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(pagination.totalPages, p + 1),
                        )
                      }
                      disabled={currentPage === pagination.totalPages}
                      className="border-neutral-200 h-9 w-9 rounded-xl p-0 flex items-center justify-center"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="space-y-5">
            <PackageCard
              pkg={packageData}
              isLoading={packageLoading}
              canPostJob={canPostJob}
            />

            <Card className="rounded-2xl border border-[#C8782A]/10 bg-white shadow-sm overflow-hidden">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2.5 bg-[#FAF5EE] rounded-xl border border-[#C8782A]/10 text-[#C8782A]">
                    <Building2 size={17} />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold text-[#6B3A2A]/60 uppercase tracking-wider">
                      Company Profile
                    </CardTitle>
                    <h3
                      className="text-xl font-bold text-[#1C1C1C]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {session.user.name || session.user.email}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-2 text-sm text-[#6B3A2A]/80">
                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <span>Email</span>
                  <span className="font-semibold text-[#1C1C1C] truncate max-w-[160px]">
                    {session.user.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                  <span>Account</span>
                  <span className="font-semibold text-[#1C1C1C]">Employer</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>Current Status</span>
                  <span className="font-semibold text-[#1C1C1C]">
                    {packageData?.status || "Active"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
