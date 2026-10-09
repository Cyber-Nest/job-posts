"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Globe,
  Mail,
  ChevronRight,
  Wifi,
  Leaf,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Share2,
  X,
  AlertCircle,
  Code2,
  Briefcase,
  Phone,
  MessageCircle,
  Linkedin,
  Twitter,
  Copy,
  Check,
  Hash,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Types ──────────────────────────────────────────────────────────── */

interface ApplyMethod {
  method: "email" | "phone" | "mail" | "inPerson" | string;
  email?: string;
  phone?: string;
  mailAddress?: string;
  inPersonAddress?: string;
  inPersonTiming?: string;
}

interface JobDetail {
  _id: string;
  id?: string;
  title: string;
  company: string;
  contactName?: string;
  jobId?: string;
  city: string;
  province: string;
  location: string;
  salary: string;
  salaryType?: "hour" | "week" | "month" | "year";
  employmentType: string;
  vacancies?: number;
  category: string;
  nocCode: string;
  runDays?: string;
  experience?: string;
  startDate?: string;
  descriptionHtml: string;
  requirementsHtml?: string;
  contactEmail?: string;
  website?: string;
  indigenousOwned: boolean;
  remote: boolean;
  status: string;
  featured?: boolean;
  postedAt: string | Date;
  expiresAt?: string | Date;
  indigenousPreference?: boolean;
  applyMethods?: ApplyMethod[];
  postDate?: string | Date;
}

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  applyMethods: ApplyMethod[];
}

function ApplyModal({
  isOpen,
  onClose,
  jobTitle,
  company,
  applyMethods,
}: ApplyModalProps) {
  //Background Scroll Prevention
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "email":
        return <Mail size={20} className="text-[#C8782A]" />;
      case "phone":
        return <Phone size={20} className="text-[#C8782A]" />;
      case "mail":
        return <MapPin size={20} className="text-[#C8782A]" />;
      case "inPerson":
        return <Building2 size={20} className="text-[#C8782A]" />;
      default:
        return <MessageCircle size={20} className="text-[#C8782A]" />;
    }
  };

  const getMethodTitle = (method: string) => {
    switch (method) {
      case "email":
        return "Apply by Email";
      case "phone":
        return "Apply by Phone";
      case "mail":
        return "Apply by Mail";
      case "inPerson":
        return "Apply in Person";
      default:
        return "Apply Now";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full pointer-events-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#C8782A] to-[#B06820] px-6 py-5 flex justify-between items-center">
                <div>
                  <h3
                    className="text-white font-bold text-xl tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    How to Apply
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {jobTitle} •{" "}
                    <span className="font-medium text-white">{company}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {applyMethods.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <AlertCircle
                      size={44}
                      className="text-[#C8782A]/50 mx-auto mb-3"
                    />
                    <p className="text-[#1C1C1C] font-medium text-base">
                      No application methods specified
                    </p>
                    <p className="text-sm text-[#6B3A2A]/60 mt-1">
                      Please check back later or contact the employer directly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-[#6B3A2A]/80 font-medium">
                      Choose your preferred method to apply for this position:
                    </p>

                    <div className="space-y-3">
                      {applyMethods.map((method, idx) => {
                        const isEmail = method.method === "email";
                        const isPhone = method.method === "phone";
                        const isMail = method.method === "mail";
                        const isInPerson = method.method === "inPerson";

                        let displayValue = "";
                        let actionLink = "";
                        let subtitle = "";

                        if (isEmail && method.email) {
                          displayValue = method.email;
                          actionLink = `mailto:${method.email}`;
                          subtitle = "Send your resume and cover letter";
                        } else if (isPhone && method.phone) {
                          displayValue = method.phone;
                          actionLink = `tel:${method.phone}`;
                          subtitle = "Call during business hours";
                        } else if (isMail && method.mailAddress) {
                          displayValue = method.mailAddress;
                          subtitle = "Send your application by mail";
                        } else if (isInPerson && method.inPersonAddress) {
                          displayValue = method.inPersonAddress;
                          subtitle = "Drop off your application in person";
                        }

                        return (
                          <div
                            key={idx}
                            className="border border-[#C8782A]/15 rounded-xl p-4 bg-[#FAF5EE]/30 hover:bg-[#FAF5EE]/60 hover:border-[#C8782A]/40 transition-all duration-200 group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#C8782A]/10 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                {getMethodIcon(method.method)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[#1C1C1C] text-base">
                                  {getMethodTitle(method.method)}
                                </h4>
                                {subtitle && (
                                  <p className="text-xs text-[#6B3A2A]/60 mt-0.5 mb-2 font-medium">
                                    {subtitle}
                                  </p>
                                )}

                                {actionLink ? (
                                  <a
                                    href={actionLink}
                                    className="text-sm text-[#1a64c4] hover:text-[#114b94] font-medium break-all inline-flex items-center gap-1 hover:underline"
                                  >
                                    {displayValue}
                                    <ChevronRight
                                      size={14}
                                      className="group-hover:translate-x-0.5 transition-transform duration-200"
                                    />
                                  </a>
                                ) : (
                                  <p className="text-sm text-[#1C1C1C] font-medium break-words leading-relaxed">
                                    {displayValue}
                                  </p>
                                )}

                                {isInPerson && method.inPersonTiming && (
                                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#C8782A] bg-[#FAF5EE] border border-[#C8782A]/10 rounded-lg px-3 py-2 w-max max-w-full">
                                    <Clock
                                      size={13}
                                      className="flex-shrink-0"
                                    />
                                    <span className="truncate">
                                      {method.inPersonTiming}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notice Banner */}
                    <div className="mt-5 p-4 bg-[#7A9E7E]/10 rounded-xl border border-[#7A9E7E]/20">
                      <div className="flex items-start gap-2.5 text-xs text-[#2A442E]">
                        <CheckCircle
                          size={16}
                          className="text-[#558259] flex-shrink-0 mt-0.5"
                        />
                        <p className="leading-normal">
                          Please mention{" "}
                          <strong className="text-[#1C1C1C] font-bold">
                            &quot;{jobTitle} - Aboriginal Jobs Canada&quot;
                          </strong>{" "}
                          in your application.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full mt-5 py-3 px-4 border border-[#C8782A]/30 text-[#6B3A2A] font-semibold rounded-xl hover:bg-[#C8782A]/5 hover:text-black transition-colors duration-200 active:bg-[#C8782A]/10 text-center text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Helper functions ───────────────────────────────────────────────── */
function formatSalary(salary: string, salaryType?: string): string {
  if (!salary) return "Salary not specified";
  const typeMap: Record<string, string> = {
    hour: "/hour",
    week: "/week",
    month: "/month",
    year: "/year",
  };
  const suffix = salaryType && typeMap[salaryType] ? typeMap[salaryType] : "";
  return `${salary} CAD${suffix}`;
}

function getStartDateLabel(startDate: string): string {
  const dateMap: Record<string, string> = {
    asap: "As Soon As Possible",
    immediate: "Immediate Joining",
    "1week": "Within 1 Week",
    "2weeks": "Within 2 Weeks",
    "1month": "Within 1 Month",
  };
  return dateMap[startDate] || startDate;
}

function getLocation(job: JobDetail): string {
  const parts = [];
  if (job.city && job.city !== job.province) parts.push(job.city);
  if (job.province) parts.push(job.province);
  return parts.join(", ") || job.location || "Location not specified";
}

function formatClosingDate(expiresAt?: string | Date): string {
  if (!expiresAt) return "Not specified";
  const date = new Date(expiresAt);
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
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

/* ── Share Modal Component ──────────────────────────────────────────── */
function ShareModal({
  isOpen,
  onClose,
  url,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={20} />,
      color: "bg-[#25D366] hover:bg-[#20BD5A]",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      color: "bg-[#0077B5] hover:bg-[#006399]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      color: "bg-[#1DA1F2] hover:bg-[#1A91DA]",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full pointer-events-auto"
            >
              <div className="bg-gradient-to-r from-[#C8782A] to-[#B06820] px-5 py-4 flex justify-between items-center">
                <h3
                  className="text-white font-bold text-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Share this job
                </h3>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {shareOptions.map((option) => (
                    <a
                      key={option.name}
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={`${option.color} text-white rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all hover:scale-105`}
                    >
                      {option.icon}
                      <span className="text-[10px] font-semibold">
                        {option.name}
                      </span>
                    </a>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#FAF5EE] rounded-xl px-3 py-2 text-xs text-[#6B3A2A]/70 truncate border border-[#C8782A]/10">
                    {url}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="bg-[#C8782A] hover:bg-[#B06820] text-white rounded-xl px-4 flex items-center gap-1.5 transition-all text-sm font-medium"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Related job card ───────────────────────────────────────────────── */
function RelatedCard({ job }: { job: JobDetail }) {
  return (
    <Link
      href={`/jobs/${job._id || job.id}`}
      className="group flex gap-3 p-3 sm:p-4 rounded-xl border border-[#C8782A]/10 hover:border-[#C8782A]/30 hover:bg-[#FAF5EE]/50 transition-all duration-200"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FAF5EE] border border-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
        <Building2 size={14} className="text-[#C8782A]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-xs sm:text-sm text-[#1C1C1C] group-hover:text-[#C8782A] transition-colors leading-snug line-clamp-2">
          {job.title}
        </p>
        <p className="text-xs text-[#C8782A] font-medium truncate">
          {job.company}
        </p>
        <p className="text-xs text-[#6B3A2A]/50 mt-0.5 truncate">
          {getLocation(job)}
        </p>
      </div>
      <ChevronRight
        size={14}
        className="text-[#C8782A]/40 flex-shrink-0 self-center ml-auto group-hover:translate-x-0.5 transition-transform"
      />
    </Link>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: dbJobResponse, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) {
        if (res.status === 404) return { success: false, data: null };
        throw new Error("Failed to fetch job details");
      }
      return res.json() as Promise<{ success: boolean; data: JobDetail }>;
    },
    enabled: !!id,
  });

  const job = dbJobResponse?.data;

  // Fetch related jobs
  const { data: relatedJobsResponse } = useQuery({
    queryKey: ["related-jobs", job?.category, job?._id],
    queryFn: async () => {
      if (!job?.category) return { data: [] };
      const res = await fetch(
        `/api/jobs?category=${encodeURIComponent(job.category)}&limit=4`,
      );
      if (!res.ok) return { data: [] };
      return res.json() as Promise<{ success: boolean; data: JobDetail[] }>;
    },
    enabled: !!job?.category,
  });

  const related =
    relatedJobsResponse?.data
      ?.filter((rj) => rj._id !== job?._id)
      .slice(0, 4) || [];

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] animate-pulse">
        {/* Breadcrumb */}
        <div className="border-b border-[#C8782A]/10 bg-[#FAF5EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-12 rounded bg-[#E8D9C7]" />
              <div className="h-3 w-3 rounded bg-[#E8D9C7]" />
              <div className="h-3 w-16 rounded bg-[#E8D9C7]" />
              <div className="h-3 w-3 rounded bg-[#E8D9C7]" />
              <div className="h-3 w-32 rounded bg-[#E8D9C7]" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-[#FAF5EE] py-8 sm:py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-[#C8782A]/10 shadow-sm p-5 sm:p-6 lg:p-10">
              {/* Back Button */}
              <div className="h-4 w-32 rounded bg-[#F3E7D8] mb-6" />

              <div className="flex flex-col lg:flex-row justify-between gap-8">
                {/* Left */}
                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <div className="h-6 w-20 rounded-full bg-[#F3E7D8]" />
                    <div className="h-6 w-28 rounded-full bg-[#F3E7D8]" />
                    <div className="h-6 w-16 rounded-full bg-[#F3E7D8]" />
                    <div className="h-6 w-24 rounded-full bg-[#F3E7D8]" />
                  </div>

                  {/* Title */}
                  <div className="space-y-3 mb-4">
                    <div className="h-10 w-full max-w-2xl rounded bg-[#F3E7D8]" />
                    <div className="h-10 w-3/4 rounded bg-[#F3E7D8]" />
                  </div>

                  {/* Company */}
                  <div className="h-5 w-48 rounded bg-[#F3E7D8] mb-6" />

                  {/* Chips */}
                  <div className="flex flex-wrap gap-3">
                    <div className="h-10 w-44 rounded-full bg-[#F7EFE5]" />
                    <div className="h-10 w-32 rounded-full bg-[#F7EFE5]" />
                    <div className="h-10 w-52 rounded-full bg-[#F7EFE5]" />
                    <div className="h-10 w-36 rounded-full bg-[#F7EFE5]" />
                  </div>
                </div>

                {/* Right CTA */}
                <div className="hidden lg:flex flex-col gap-3 w-52">
                  <div className="h-11 rounded-xl bg-[#E8D9C7]" />
                  <div className="h-11 rounded-xl bg-[#F3E7D8]" />
                  <div className="h-4 w-32 mx-auto rounded bg-[#F3E7D8]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Body */}
        <section className="bg-white py-10 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
              {/* LEFT CONTENT */}
              <div className="flex-1">
                {/* About Role */}
                <div className="mb-10">
                  <div className="h-8 w-52 rounded bg-[#F3E7D8] mb-5" />

                  <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-[#F8F1E8]" />
                    <div className="h-4 w-full rounded bg-[#F8F1E8]" />
                    <div className="h-4 w-5/6 rounded bg-[#F8F1E8]" />
                    <div className="h-4 w-full rounded bg-[#F8F1E8]" />
                    <div className="h-4 w-4/6 rounded bg-[#F8F1E8]" />
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-10">
                  <div className="h-8 w-72 rounded bg-[#F3E7D8] mb-5" />

                  <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-[#F8F1E8]" />
                    <div className="h-4 w-11/12 rounded bg-[#F8F1E8]" />
                    <div className="h-4 w-3/4 rounded bg-[#F8F1E8]" />
                    <div className="h-4 w-full rounded bg-[#F8F1E8]" />
                  </div>
                </div>

                {/* Additional Details Card */}
                <div className="bg-[#FAF5EE] border border-[#C8782A]/10 rounded-2xl p-6 mb-8">
                  <div className="h-7 w-44 rounded bg-[#E8D9C7] mb-6" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F3E7D8]" />
                        <div className="flex-1">
                          <div className="h-3 w-24 rounded bg-[#F3E7D8] mb-2" />
                          <div className="h-4 w-36 rounded bg-[#E8D9C7]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile CTA */}
                <div className="lg:hidden bg-white border border-[#C8782A]/10 rounded-2xl p-4 shadow-lg flex flex-col gap-3 sticky bottom-4">
                  <div className="h-11 rounded-xl bg-[#E8D9C7]" />
                  <div className="h-11 rounded-xl bg-[#F3E7D8]" />
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="lg:w-[320px] flex-shrink-0">
                <div className="flex flex-col gap-5">
                  {/* Apply Card */}
                  <div className="bg-[#FAF5EE] border border-[#C8782A]/10 rounded-2xl p-6">
                    <div className="h-11 rounded-xl bg-[#E8D9C7] mb-5" />

                    <div className="space-y-4">
                      <div className="h-4 w-full rounded bg-[#F3E7D8]" />
                      <div className="h-4 w-5/6 rounded bg-[#F3E7D8]" />
                      <div className="h-4 w-4/6 rounded bg-[#F3E7D8]" />
                    </div>
                  </div>

                  {/* Employer Card */}
                  <div className="bg-white border border-[#C8782A]/10 rounded-2xl p-6">
                    <div className="h-7 w-44 rounded bg-[#F3E7D8] mb-5" />

                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#F3E7D8]" />

                      <div className="flex-1">
                        <div className="h-4 w-36 rounded bg-[#E8D9C7] mb-2" />
                        <div className="h-3 w-28 rounded bg-[#F3E7D8]" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="h-10 rounded-xl bg-[#FAF5EE]" />
                      <div className="h-10 rounded-xl bg-[#FAF5EE]" />
                    </div>
                  </div>

                  {/* Similar Jobs */}
                  <div className="bg-white border border-[#C8782A]/10 rounded-2xl p-6">
                    <div className="h-7 w-36 rounded bg-[#F3E7D8] mb-5" />

                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="border border-[#C8782A]/10 rounded-xl p-4"
                        >
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#F3E7D8]" />

                            <div className="flex-1">
                              <div className="h-4 w-full rounded bg-[#E8D9C7] mb-2" />
                              <div className="h-3 w-28 rounded bg-[#F3E7D8] mb-2" />
                              <div className="h-3 w-20 rounded bg-[#F8F1E8]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-4 w-32 rounded bg-[#F3E7D8] mt-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  if (!job) {
    return (
      <section className="bg-[#FAF5EE] min-h-[85vh] flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#C8782A]/10 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={28} className="text-[#C8782A]" />
          </div>
          <h1
            className="text-3xl font-bold text-[#1C1C1C] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Job Not Found
          </h1>
          <p className="text-[#6B3A2A]/65 mb-7">
            This listing may have expired or been removed. Browse our current
            openings below.
          </p>
          <Link href="/jobs">
            <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-8">
              Browse All Jobs
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const applyMethods = job.applyMethods || [];
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={job.title}
        company={job.company}
        applyMethods={applyMethods}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={currentUrl}
        title={job.title}
      />

      {/* Breadcrumb */}
      <div className="bg-[#FAF5EE] border-b border-[#C8782A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[#6B3A2A]/55 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#C8782A] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/jobs"
              className="hover:text-[#C8782A] transition-colors"
            >
              Jobs
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#C8782A] font-medium truncate max-w-[150px] sm:max-w-[200px]">
              {job.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-[#FAF5EE] py-8 sm:py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-10 border border-[#C8782A]/10 shadow-sm"
          >
            {/* Back button */}
            <div className="mb-4 sm:mb-6">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C8782A] hover:underline"
              >
                <ArrowLeft size={14} /> Back to Jobs
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8 items-start">
              {/* Main info */}
              <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.remote && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-[#1a64c4]/10 text-[#1a64c4] px-2.5 py-1 rounded-full font-medium">
                      <Wifi size={11} /> Remote
                    </span>
                  )}
                  {(job.indigenousOwned || job.indigenousPreference) && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-[#7A9E7E]/15 text-[#4a7a4e] px-2.5 py-1 rounded-full font-medium">
                      <Leaf size={11} /> Indigenous Employer
                    </span>
                  )}
                  <span className="text-xs bg-white border border-[#C8782A]/15 text-[#6B3A2A]/60 px-2.5 py-1 rounded-full">
                    {job.category}
                  </span>
                  {job.nocCode && (
                    <span className="text-xs bg-white border border-[#C8782A]/15 text-[#6B3A2A]/60 px-2.5 py-1 rounded-full">
                      NOC: {job.nocCode}
                    </span>
                  )}
                  {/* Job ID Badge */}
                  {job.jobId && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 text-neutral-600 border border-neutral-200 px-2.5 py-1 rounded-full font-mono">
                      <Hash size={11} /> {job.jobId}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1
                  className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#1C1C1C] leading-tight mb-2 break-words"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {job.title}
                </h1>

                {/* Company */}
                <p className="text-[#C8782A] font-bold text-base sm:text-lg mb-4 sm:mb-5">
                  {job.company}
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                    <MapPin size={12} className="text-[#C8782A]" />
                    <span className="truncate max-w-[150px] sm:max-w-none">
                      {getLocation(job)}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                    <Clock size={12} className="text-[#C8782A]" />
                    {job.employmentType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                    <DollarSign size={12} className="text-[#C8782A]" />
                    {formatSalary(job.salary, job.salaryType)}
                  </span>
                  {job.vacancies && (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                      <Users size={12} className="text-[#C8782A]" />
                      {job.vacancies} Vacancies
                    </span>
                  )}
                  {job.experience && (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                      <Briefcase size={12} className="text-[#C8782A]" />
                      {job.experience}{" "}
                      {parseInt(job.experience) > 1 ? "years" : "year"}
                    </span>
                  )}
                  {job.startDate && (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                      <Calendar size={12} className="text-[#C8782A]" />
                      Start: {getStartDateLabel(job.startDate)}
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex flex-col gap-3 flex-shrink-0 w-48">
                <Button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold w-full shadow-md"
                >
                  How to Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-full border-[#C8782A]/25 text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-black"
                >
                  <Share2 size={14} className="mr-1" />
                  Share
                </Button>
                <p className="text-xs text-[#6B3A2A]/45 text-center">
                  Posted on{" "}
                  {job.postDate
                    ? new Date(job.postDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Recently"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Left Column - Job Content */}
            <div className="flex-1 min-w-0">
              {/* About the Role */}
              {job.descriptionHtml && (
                <div className="mb-8">
                  <h2
                    className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    About the Role
                  </h2>
                  <div
                    className="text-[#1C1C1C]/75 leading-relaxed prose prose-sm sm:prose-base max-w-none break-words
                      [&>p]:mb-3 [&>p]:break-words 
                      [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 
                      [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3
                      [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2
                      [&_li]:break-words"
                    dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                  />
                </div>
              )}

              {/* Qualifications & Requirements */}
              {job.requirementsHtml && (
                <div className="mb-8">
                  <h2
                    className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Qualifications & Requirements
                  </h2>
                  <div
                    className="text-[#1C1C1C]/75 leading-relaxed prose prose-sm sm:prose-base max-w-none break-words
                      [&>p]:mb-3 [&>p]:break-words 
                      [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 
                      [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3
                      [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2
                      [&_li]:break-words"
                    dangerouslySetInnerHTML={{ __html: job.requirementsHtml }}
                  />
                </div>
              )}

              {/* Additional Details Card */}
              {(job.nocCode ||
                job.runDays ||
                job.experience ||
                job.startDate) && (
                <div className="bg-[#FAF5EE] rounded-2xl p-5 sm:p-6 border border-[#C8782A]/10 mb-8">
                  <h3
                    className="font-bold text-[#1C1C1C] mb-4 text-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Additional Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.nocCode && (
                      <div className="flex items-start gap-2.5">
                        <Code2
                          size={14}
                          className="text-[#C8782A] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-xs text-[#6B3A2A]/50">NOC Code</p>
                          <p className="text-sm font-semibold text-[#1C1C1C] break-words">
                            {job.nocCode}
                          </p>
                        </div>
                      </div>
                    )}
                    {job.runDays && (
                      <div className="flex items-start gap-2.5">
                        <Calendar
                          size={14}
                          className="text-[#C8782A] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-xs text-[#6B3A2A]/50">
                            Posted for
                          </p>
                          <p className="text-sm font-semibold text-[#1C1C1C]">
                            {job.runDays} days
                          </p>
                        </div>
                      </div>
                    )}
                    {job.experience && (
                      <div className="flex items-start gap-2.5">
                        <Briefcase
                          size={14}
                          className="text-[#C8782A] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-xs text-[#6B3A2A]/50">
                            Experience Required
                          </p>
                          <p className="text-sm font-semibold text-[#1C1C1C]">
                            {job.experience} years
                          </p>
                        </div>
                      </div>
                    )}
                    {job.startDate && (
                      <div className="flex items-start gap-2.5">
                        <Calendar
                          size={14}
                          className="text-[#C8782A] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-xs text-[#6B3A2A]/50">
                            Expected Start Date
                          </p>
                          <p className="text-sm font-semibold text-[#1C1C1C]">
                            {getStartDateLabel(job.startDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile CTA */}
              <div className="flex flex-col gap-3 lg:hidden sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-[#C8782A]/20 z-10">
                <Button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold w-full"
                >
                  How to Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-full border-[#C8782A]/25 text-[#6B3A2A]"
                >
                  <Share2 size={15} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-[320px] flex-shrink-0">
              <div className="flex flex-col gap-5 lg:sticky lg:top-24">
                {/* Apply Card */}
                <div className="bg-[#FAF5EE] rounded-2xl p-5 sm:p-6 border border-[#C8782A]/10">
                  <Button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold w-full shadow-sm mb-4"
                  >
                    How to Apply
                  </Button>
                  <div className="flex flex-col gap-2.5 text-sm">
                    <div className="flex items-center gap-2.5 text-[#6B3A2A]/65">
                      <Clock
                        size={14}
                        className="text-[#C8782A] flex-shrink-0"
                      />
                      <span className="text-xs text-[#6B3A2A]/45">
                        Posted on{" "}
                        {job.postDate
                          ? new Date(job.postDate).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Recently"}
                      </span>
                    </div>
                    {job.postDate && job.runDays && (
                      <div className="flex items-center gap-2.5 text-[#6B3A2A]/65">
                        <Calendar
                          size={14}
                          className="text-[#C8782A] flex-shrink-0"
                        />
                        <span>
                          Closes{" "}
                          <strong className="text-[#1C1C1C]">
                            {calculateClosingDate(job.postDate, job.runDays)}
                          </strong>
                        </span>
                      </div>
                    )}
                    {job.website && (
                      <div className="flex items-center gap-2.5 text-[#6B3A2A]/65">
                        <Globe
                          size={14}
                          className="text-[#C8782A] flex-shrink-0"
                        />
                        <a
                          href={job.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1a64c4] hover:underline truncate"
                        >
                          {job.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* About Employer Card */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#C8782A]/10">
                  <h3
                    className="font-bold text-[#1C1C1C] mb-3 text-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    About the Employer
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#C8782A]/10 flex items-center justify-center">
                      <Building2 size={16} className="text-[#C8782A]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1C1C1C]">
                        {job.company}
                      </p>
                      <p className="text-xs text-[#6B3A2A]/55 truncate">
                        {getLocation(job)}
                      </p>
                    </div>
                  </div>
                  {/* Contact Name*/}
                  {job.contactName && (
                    <div className="flex items-center gap-2 text-xs text-[#6B3A2A]/70 bg-[#FAF5EE] rounded-lg px-3 py-2 mb-2">
                      <User size={12} className="text-[#C8782A]" />
                      <span>
                        Contact: <strong>{job.contactName}</strong>
                      </span>
                    </div>
                  )}
                  {(job.indigenousOwned || job.indigenousPreference) && (
                    <div className="flex items-center gap-2 text-xs text-[#4a7a4e] bg-[#7A9E7E]/10 rounded-lg px-3 py-2 mb-2">
                      <Leaf size={12} />
                      Indigenous-owned organization
                    </div>
                  )}
                  {job.remote && (
                    <div className="flex items-center gap-2 text-xs text-[#1a64c4] bg-[#1a64c4]/10 rounded-lg px-3 py-2">
                      <Wifi size={12} />
                      Remote / Hybrid work available
                    </div>
                  )}
                </div>

                {/* Related Jobs */}
                {related.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#C8782A]/10">
                    <h3
                      className="font-bold text-[#1C1C1C] mb-4 text-lg"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Similar Jobs
                    </h3>
                    <div className="flex flex-col gap-2">
                      {related.map((rj) => (
                        <RelatedCard key={rj._id} job={rj} />
                      ))}
                    </div>
                    <Link
                      href={`/jobs?category=${encodeURIComponent(job.category)}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#C8782A] font-semibold mt-4 hover:gap-2.5 transition-all duration-200"
                    >
                      More {job.category} jobs <ChevronRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
