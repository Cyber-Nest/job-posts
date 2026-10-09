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
        <Badge className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold border-0 px-3 py-1 rounded-full shadow-xs text-xs uppercase tracking-wider">
          Active
        </Badge>
      );
    case "closed":
      return (
        <Badge className="bg-slate-500 hover:bg-slate-600 text-white font-bold border-0 px-3 py-1 rounded-full shadow-xs text-xs uppercase tracking-wider">
          Closed
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-rose-600 hover:bg-rose-700 text-white font-bold border-0 px-3 py-1 rounded-full shadow-xs text-xs uppercase tracking-wider">
          Expired
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="font-bold text-xs rounded-full px-3 py-1 uppercase tracking-wider"
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
      <Card className="border border-slate-200/80 bg-white shadow-xs relative overflow-hidden rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-6 pt-5">
          <Skeleton className="h-4 w-20 bg-slate-200" />
          <Skeleton className="h-8 w-8 rounded-2xl bg-slate-200" />
        </CardHeader>
        <CardContent className="px-6 pb-5 pt-1">
          <Skeleton className="h-9 w-16 bg-slate-200" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200/80 bg-white shadow-xs relative overflow-hidden group hover:border-emerald-300 hover:shadow-xl transition-all duration-300 rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-6 pt-5">
        <CardTitle className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="text-[#059669] bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100 group-hover:bg-[#059669] group-hover:text-white transition-colors duration-300 shadow-xs">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-5 pt-1">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
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
      <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-10 w-10 rounded-2xl bg-slate-200" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-28 bg-slate-200" />
              <Skeleton className="h-4 w-40 bg-slate-200" />
            </div>
          </div>
          <Skeleton className="h-8 w-36 bg-slate-200" />
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0 space-y-3">
          <Skeleton className="h-4 w-full bg-slate-200" />
          <Skeleton className="h-4 w-5/6 bg-slate-200" />
          <Skeleton className="h-4 w-4/6 bg-slate-200" />
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
    <Card className="rounded-3xl border border-slate-800 bg-slate-900 text-white shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#059669]/15 rounded-full blur-2xl pointer-events-none" />

      <CardHeader className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-slate-800 rounded-2xl border border-slate-700 text-[#059669]">
            <Package size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-extrabold">
              PACKAGE OVERVIEW
            </p>
            <h3 className="text-xl font-extrabold text-white leading-tight">
              Current Package
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xl font-black text-white tracking-tight">
            {packageName}
          </span>
          {isFreePlan && (
            <span className="text-[10px] uppercase tracking-wider bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full font-bold text-slate-300">
              Free Plan
            </span>
          )}
          {unlimitedJobs && (
            <span className="text-[10px] uppercase tracking-wider bg-[#059669] text-white px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1">
              <Crown size={10} fill="currentColor" />
              Unlimited
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0 space-y-3 text-xs sm:text-sm text-slate-300 font-medium">
        <div className="flex justify-between items-center py-2 border-b border-slate-800">
          <span className="text-slate-400">Status</span>
          <span className="font-extrabold px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs">
            {packageStatus}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-slate-800">
          <span className="text-slate-400">Credits Left</span>
          <span className="font-black text-lg text-emerald-400">
            {unlimitedJobs ? "∞" : remainingCredits}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-slate-800">
          <span className="text-slate-400">Total Purchased</span>
          <span className="font-bold text-white">{totalCreditsPurchased}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-slate-800">
          <span className="text-slate-400">Job Post Expiry</span>
          <span className="font-bold text-white">{jobPostExpiryDays} days</span>
        </div>

        {pkg?.purchasedAt && (
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-400">Purchased On</span>
            <span className="font-bold text-white">{formatDate(pkg.purchasedAt)}</span>
          </div>
        )}

        {pkg?.expiresAt && (
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400">Expiry Date</span>
            <span className="font-bold text-amber-300">
              {formatDate(pkg.expiresAt)}
            </span>
          </div>
        )}

        {pkg?.paymentMethod && (
          <div className="flex justify-between items-center py-2 border-t border-slate-800">
            <span className="text-slate-400">Payment Method</span>
            <span className="font-bold capitalize text-white">
              {pkg.paymentMethod}
            </span>
          </div>
        )}
      </CardContent>

      {!canPostJob && (
        <CardFooter className="px-6 pb-6 pt-0">
          <Link href="/pricing" className="w-full">
            <Button className="w-full h-11 bg-[#059669] hover:bg-[#047857] text-white font-extrabold rounded-2xl shadow-lg">
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
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col overflow-x-hidden rounded-3xl border border-slate-200/80 shadow-2xl p-0 gap-0 bg-white">
        <div className="bg-slate-900 px-6 py-6 text-white relative flex-shrink-0 border-b border-slate-800">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white pr-6 leading-tight">
              {job.title}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-slate-300 mt-2.5 font-medium text-sm">
              <span className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                <Building2 size={14} className="text-[#059669]" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                <MapPin size={14} className="text-[#059669]" />
                {job.city}, {job.province}
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                {job.jobId && (
                  <span className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full text-slate-300 text-xs font-mono">
                    <Hash size={14} className="text-[#059669]" /> {job.jobId}
                  </span>
                )}
                {job.contactName && (
                  <span className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full text-slate-300 text-xs">
                    <UserIcon size={14} className="text-[#059669]" />{" "}
                    {job.contactName}
                  </span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 max-h-[calc(90vh-140px)]">
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
            {getStatusBadge(job.status)}
            {job.remote && (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-[#059669] border-emerald-200/80 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider"
              >
                <Wifi size= {12} className="mr-1.5" /> Remote
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Employment Type
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {job.employmentType}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Vacancies
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {job.vacancies ?? "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Salary
              </p>
              <p className="text-sm font-extrabold text-[#059669] mt-1">
                {getSalaryDisplay(job.salary, job.salaryType)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                NOC Code
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {job.nocCode || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Category
              </p>
              <p
                className="text-sm font-extrabold text-slate-900 mt-1 truncate"
                title={job.category}
              >
                {job.category}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Experience Required
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {job.experience || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Expected Start Date
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {getStartDateDisplay(job.startDate as any)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Run Duration
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {job.runDays ? `${job.runDays} Days` : "30 Days (default)"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Posted Date
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {formatDate(job.postDate as any)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                Expiry Date
              </p>
              <p className="text-sm font-extrabold text-rose-600 mt-1">
                {calculateClosingDate(job.postDate as any, job.runDays as any)}
              </p>
            </div>
          </div>

          {job.website && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mb-1">
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
                className="text-sm font-bold text-[#059669] hover:underline break-all"
              >
                {job.website}
              </a>
            </div>
          )}

          {job.descriptionHtml && (
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#059669] rounded-full"></span>
                About the Role
              </h4>
              <div
                className="text-sm text-slate-700 prose prose-slate max-w-none [word-break:break-word] overflow-wrap-anywhere list-inside pl-1"
                dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
              />
            </div>
          )}

          {job.requirementsHtml && (
            <div className="pt-2 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#059669] rounded-full"></span>
                Qualifications & Requirements
              </h4>
              <div
                className="text-sm text-slate-700 prose prose-slate max-w-none [word-break:break-word] overflow-wrap-anywhere list-inside pl-1"
                dangerouslySetInnerHTML={{ __html: job.requirementsHtml }}
              />
            </div>
          )}

          {job.applyMethods && job.applyMethods.length > 0 && (
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-base">
                How to Apply
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.applyMethods.map((method, idx) => {
                  const display = getApplyMethodDisplay(method);
                  if (!display) return null;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl hover:bg-slate-100/80 transition-colors min-w-0 w-full"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#059669] shadow-xs">
                        <display.icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          {display.label}
                        </p>
                        <p className="text-xs font-bold text-slate-900 break-all mt-0.5 select-all">
                          {display.value}
                        </p>
                        {method.method === "inPerson" &&
                          method.inPersonTiming && (
                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#059669] font-bold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 w-max rounded-md">
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

        <DialogFooter className="flex flex-row items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-2xl h-10 px-5 font-bold text-sm transition-colors"
          >
            Close
          </Button>
          <Link href={`/post-a-job?id=${job._id}`} passHref>
            <Button className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold rounded-2xl h-10 px-5 text-sm shadow-md transition-all flex items-center">
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
    <Card className="hover:shadow-xl border border-slate-200/80 hover:border-emerald-300 transition-all duration-300 rounded-3xl bg-white overflow-hidden flex flex-col group">
      <CardHeader className="p-6 pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle
              onClick={onView}
              className="text-lg font-extrabold text-slate-900 line-clamp-1 group-hover:text-[#059669] transition-colors cursor-pointer"
            >
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-1.5 mt-1">
              <Building2 size={13} className="text-[#059669] flex-shrink-0" />
              <span className="text-xs font-bold text-slate-600 truncate">
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
                  text-xs px-3 py-1 rounded-full font-bold cursor-pointer appearance-none uppercase tracking-wider
                  ${
                    job.status === "active"
                      ? "bg-emerald-50 text-[#059669] border border-emerald-200/80 hover:bg-emerald-100"
                      : job.status === "closed"
                        ? "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
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
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 pb-4 flex-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs border-y border-slate-100 py-3 my-1">
          <div className="flex items-center gap-2 text-slate-600 font-medium min-w-0">
            <MapPin
              size={13}
              className="text-[#059669] flex-shrink-0"
            />
            <span className="truncate">
              {job.city}, {job.province}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Clock
              size={13}
              className="text-[#059669] flex-shrink-0"
            />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-900 font-extrabold">
            <DollarSign
              size={13}
              className="text-[#059669] flex-shrink-0"
            />
            <span>{getSalaryDisplay(job.salary, job.salaryType)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Calendar
              size={13}
              className="text-[#059669] flex-shrink-0"
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
              className="text-[10px] bg-slate-100 text-slate-700 border-slate-200 rounded-full font-bold px-2.5 py-0.5"
            >
              <User size={10} className="mr-1" /> Vacancies: {job.vacancies}
            </Badge>
          )}
          {job.remote && (
            <Badge
              variant="outline"
              className="text-[10px] bg-emerald-50 text-[#059669] border-emerald-200/80 rounded-full font-bold px-2.5 py-0.5 uppercase tracking-wider"
            >
              <Wifi size={10} className="mr-1" /> Remote
            </Badge>
          )}
          {job.jobId && (
            <Badge
              variant="outline"
              className="text-[10px] bg-slate-100 text-slate-600 border-slate-200 rounded-md font-mono px-2 py-0.5"
            >
              <Hash size={10} className="mr-1" /> {job.jobId}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2 border-t border-slate-100 bg-slate-50/50">
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="flex-1 h-9 rounded-2xl border-slate-200 font-bold text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#059669] hover:border-emerald-200 transition-all cursor-pointer"
        >
          <Eye size={13} className="sm:mr-1" />
          <span className="hidden sm:inline">View</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 h-9 rounded-2xl border-slate-200 font-bold text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#059669] hover:border-emerald-200 transition-all cursor-pointer"
        >
          <Edit size={13} className="sm:mr-1" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex-1 h-9 rounded-2xl font-bold text-xs bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
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
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-slate-900">
            Delete Job Posting
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm mt-2 leading-relaxed">
            Are you sure you want to delete{" "}
            <strong className="text-[#059669] font-bold">
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
            className="rounded-2xl h-10 border-slate-200 text-slate-700 font-bold"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-2xl h-10 bg-rose-600 hover:bg-rose-700 font-bold"
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
    <Card className="border border-slate-200/80 bg-white rounded-3xl overflow-hidden">
      <CardHeader className="p-6 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 bg-slate-200" />
            <Skeleton className="h-4 w-1/2 bg-slate-200" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 pb-4">
        <div className="space-y-2 border-y border-slate-100 py-3 my-1">
          <Skeleton className="h-4 w-full bg-slate-200" />
          <Skeleton className="h-4 w-2/3 bg-slate-200" />
        </div>
        <div className="flex gap-1.5 mt-3">
          <Skeleton className="h-5 w-16 rounded-md bg-slate-200" />
          <Skeleton className="h-5 w-20 rounded-md bg-slate-200" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-2xl bg-slate-200" />
        <Skeleton className="h-9 flex-1 rounded-2xl bg-slate-200" />
        <Skeleton className="h-9 flex-1 rounded-2xl bg-slate-200" />
      </CardFooter>
    </Card>
  );
}

/* ── Full Dashboard Skeleton ────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="bg-slate-50/50 min-h-[85vh] animate-pulse">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 border-b border-slate-200/60">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <div className="h-8 w-64 bg-emerald-500/10 rounded mb-2" />
            <div className="h-4 w-48 bg-slate-200 rounded" />
          </div>
          <div className="h-11 w-36 bg-[#059669]/20 rounded-2xl" />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 h-[100px]"
            >
              <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
              <div className="h-8 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="h-11 flex-1 bg-slate-100 rounded-2xl" />
          <div className="h-11 w-full sm:w-[140px] bg-slate-100 rounded-2xl" />
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
        { id: "download" }
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
        <div className="text-center max-w-sm w-full border border-slate-200/80 p-8 rounded-3xl bg-slate-50/50 shadow-sm">
          <AlertCircle
            size={44}
            className="text-amber-500 mx-auto mb-4"
          />
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Authentication Required
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
            Please authenticate your account session to safely load your
            employer console.
          </p>
          <Link href="/login" className="block mt-6">
            <Button className="w-full h-11 bg-[#059669] hover:bg-[#047857] text-white font-extrabold rounded-2xl shadow-md">
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

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Employer Dashboard
              </h1>
              <p className="text-sm font-medium text-slate-600 mt-1">
                Workspace panel • Welcome back,{" "}
                <span className="text-[#059669] font-extrabold">
                  {session.user.name || session.user.email}
                </span>
              </p>
            </div>

            {packageLoading ? (
              <div className="h-11 w-40 rounded-2xl bg-emerald-500/10 animate-pulse" />
            ) : canPostJob ? (
              <Link href="/post-a-job">
                <Button className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold h-11 px-6 rounded-2xl shadow-lg transition-all cursor-pointer">
                  <Plus size={16} className="mr-2 stroke-[2.5]" />
                  Post New Job
                </Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-6 rounded-2xl shadow-md transition-all cursor-pointer">
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {packageHasEnded && (
          <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50/80 px-6 py-4 text-rose-700 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-sm">
                  Your job posting credits are exhausted.
                </p>
                <p className="text-sm mt-0.5 text-rose-600 font-medium">
                  Upgrade your plan to continue posting jobs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
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
            icon={<CheckCircle size={18} className="text-[#059669]" />}
            isLoading={statsLoading}
          />
          <StatCard
            title="Closed Jobs"
            value={stats.closedJobs}
            icon={<X size={18} className="text-slate-500" />}
            isLoading={statsLoading}
          />
          <StatCard
            title="Credits Left"
            value={
              packageLoading ? "..." : unlimitedJobs ? "∞" : remainingCredits
            }
            icon={<DollarSign size={18} className="text-[#059669]" />}
            isLoading={packageLoading}
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 bg-white border border-slate-200/80 rounded-2xl px-4 py-1 focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#059669]/20 transition-all">
            <div className="flex items-center h-10 gap-3">
              <Search size={16} className="text-[#059669] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search postings by title, company, or city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-0 outline-none border-none"
              />
            </div>
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-12 pl-4 pr-10 rounded-2xl border border-slate-200/80 bg-white text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] appearance-none min-w-[140px] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
              <option value="expired">Expired Only</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Jobs List Grid & Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          <div>
            {jobsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <JobSkeletonCard key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <Card className="border border-dashed border-slate-300 bg-slate-50/50 text-center py-16 rounded-3xl">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#059669]">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    No listings match criteria
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed font-medium">
                    {searchQuery || statusFilter !== "all"
                      ? "We couldn't find anything matching your search. Try resetting filters."
                      : packageHasEnded
                        ? "Your credits are finished. Upgrade your plan to create new job postings."
                        : "You haven't initialized any job listings on your business dashboard."}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                      {canPostJob ? (
                        <Link href="/post-a-job" className="inline-block">
                          <Button className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold rounded-2xl h-11 px-6 shadow-md">
                            <Plus size={15} className="mr-1.5" /> Post Your
                            First Job
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/pricing" className="inline-block">
                          <Button className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl h-11 px-6 shadow-md">
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
                      onView={() => window.open(`/jobs/${job._id}`, "_blank")}
                      onEdit={() => handleEdit(job._id)}
                      onDelete={() => setJobToDelete(job)}
                      onStatusChange={handleStatusChange}
                      onDownload={handleDownload}
                      isDownloading={downloadingJobId === job._id}
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-slate-200 h-10 w-10 rounded-2xl p-0 flex items-center justify-center text-slate-700"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <div className="bg-white border border-slate-200/80 rounded-2xl px-5 h-10 flex items-center justify-center text-xs font-extrabold text-slate-700 shadow-xs">
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
                      className="border-slate-200 h-10 w-10 rounded-2xl p-0 flex items-center justify-center text-slate-700"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <PackageCard
              pkg={packageData}
              isLoading={packageLoading}
              canPostJob={canPostJob}
            />

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-[#059669]">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      Company Profile
                    </CardTitle>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                      {session.user.name || session.user.email}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span>Email</span>
                  <span className="font-extrabold text-slate-900 truncate max-w-[160px]">
                    {session.user.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span>Account</span>
                  <span className="font-extrabold text-slate-900">Employer</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Current Status</span>
                  <span className="font-extrabold text-[#059669]">
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
