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
  Calendar,
  CheckCircle2,
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
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileText,
  ArrowRight,
  Bookmark,
  Send,
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

/* ── Apply Modal Component ──────────────────────────────────────────── */

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
        return <Mail size={18} className="text-[#059669]" />;
      case "phone":
        return <Phone size={18} className="text-[#059669]" />;
      case "mail":
        return <MapPin size={18} className="text-[#059669]" />;
      case "inPerson":
        return <Building2 size={18} className="text-[#059669]" />;
      default:
        return <MessageCircle size={18} className="text-[#059669]" />;
    }
  };

  const getMethodTitle = (method: string) => {
    switch (method) {
      case "email":
        return "Apply via Email";
      case "phone":
        return "Apply via Phone";
      case "mail":
        return "Apply via Postal Mail";
      case "inPerson":
        return "Apply in Person";
      default:
        return "Direct Application";
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ ease: "easeOut", duration: 0.25 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full border border-slate-200/80 pointer-events-auto"
            >
              {/* Emerald Top Accent Banner */}
              <div className="bg-gradient-to-r from-[#059669] via-emerald-600 to-teal-700 px-6 py-6 flex justify-between items-start text-white relative">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                    <Send size={11} /> Application Hub
                  </div>
                  <h3 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                    How to Apply
                  </h3>
                  <p className="text-emerald-100 text-xs sm:text-sm font-medium line-clamp-1">
                    {jobTitle} • <span className="text-white font-bold">{company}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-2xl transition-all"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Methods List */}
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                {applyMethods.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                    <AlertCircle size={40} className="text-[#059669]/60 mx-auto mb-3" />
                    <p className="text-slate-800 font-bold text-base">
                      No direct contact instructions provided
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Please check the employer website or company profile for application instructions.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Follow the employer's instructions below:
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
                          actionLink = `mailto:${method.email}?subject=${encodeURIComponent(`Application for ${jobTitle} - GetJobsCanada`)}`;
                          subtitle = "Send your resume and cover letter directly to:";
                        } else if (isPhone && method.phone) {
                          displayValue = method.phone;
                          actionLink = `tel:${method.phone}`;
                          subtitle = "Call hiring team during business hours:";
                        } else if (isMail && method.mailAddress) {
                          displayValue = method.mailAddress;
                          subtitle = "Mail your printed application package to:";
                        } else if (isInPerson && method.inPersonAddress) {
                          displayValue = method.inPersonAddress;
                          subtitle = "Submit your resume in person at:";
                        }

                        return (
                          <div
                            key={idx}
                            className="bg-slate-50/70 border border-slate-200/80 hover:border-[#059669]/50 hover:bg-emerald-50/30 rounded-2xl p-4 transition-all duration-200 group"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#059669] group-hover:text-white transition-colors">
                                {getMethodIcon(method.method)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-extrabold text-slate-900 text-sm">
                                  {getMethodTitle(method.method)}
                                </h4>
                                {subtitle && (
                                  <p className="text-xs text-slate-500 mt-0.5 mb-1.5 font-medium">
                                    {subtitle}
                                  </p>
                                )}

                                {actionLink ? (
                                  <a
                                    href={actionLink}
                                    className="text-xs font-bold text-[#059669] hover:text-[#047857] underline-offset-2 hover:underline inline-flex items-center gap-1.5 break-all"
                                  >
                                    {displayValue}
                                    <ExternalLink size={12} className="flex-shrink-0" />
                                  </a>
                                ) : (
                                  <p className="text-xs font-semibold text-slate-800 break-words leading-relaxed">
                                    {displayValue}
                                  </p>
                                )}

                                {isInPerson && method.inPersonTiming && (
                                  <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/60 border border-emerald-200/80 rounded-lg px-2.5 py-1">
                                    <Clock size={12} className="text-[#059669]" />
                                    <span>{method.inPersonTiming}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notice Callout */}
                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 flex items-start gap-3">
                      <ShieldCheck size={18} className="text-[#059669] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        Tip: Always mention <strong className="font-extrabold text-[#059669]">&quot;Application for {jobTitle} via GetJobsCanada&quot;</strong> in your subject line or introduction.
                      </p>
                    </div>
                  </>
                )}

                <button
                  onClick={onClose}
                  className="w-full mt-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-colors text-xs text-center cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
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
      icon: <MessageCircle size={18} />,
      color: "bg-[#25D366] hover:bg-[#1EBE55]",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} />,
      color: "bg-[#0A66C2] hover:bg-[#08539E]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "X (Twitter)",
      icon: <Twitter size={18} />,
      color: "bg-slate-900 hover:bg-slate-800",
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ ease: "easeOut", duration: 0.25 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full border border-slate-200/80 pointer-events-auto"
            >
              <div className="bg-gradient-to-r from-[#059669] to-teal-700 px-5 py-4 flex justify-between items-center text-white">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Share2 size={16} /> Share Opportunity
                </h3>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-2.5">
                  {shareOptions.map((option) => (
                    <a
                      key={option.name}
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={`${option.color} text-white rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all hover:scale-105 shadow-xs`}
                    >
                      {option.icon}
                      <span className="text-[10px] font-bold">{option.name}</span>
                    </a>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-600 truncate font-mono">
                    {url}
                  </div>
                  <Button
                    onClick={handleCopyLink}
                    className="bg-[#059669] hover:bg-[#047857] text-white rounded-2xl px-4 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Helper Functions ───────────────────────────────────────────────── */

function formatSalary(salary: string, salaryType?: string): string {
  if (!salary) return "Salary Undisclosed";
  const typeMap: Record<string, string> = {
    hour: "/hr",
    week: "/wk",
    month: "/mo",
    year: "/yr",
  };
  const suffix = salaryType && typeMap[salaryType] ? typeMap[salaryType] : "";
  return `${salary} CAD${suffix}`;
}

function getStartDateLabel(startDate: string): string {
  const dateMap: Record<string, string> = {
    asap: "Immediate / ASAP",
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
  return parts.join(", ") || job.location || "Canada";
}

function formatDate(postDate?: string | Date): string {
  if (!postDate) return "Recently posted";
  const date = new Date(postDate);
  if (isNaN(date.getTime())) return "Recently posted";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getExpiryDate(expiresAt?: string | Date, postDate?: string | Date, runDays?: string): string {
  if (expiresAt) {
    const d = new Date(expiresAt);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  if (postDate && runDays) {
    const d = new Date(postDate);
    if (!isNaN(d.getTime())) {
      d.setDate(d.getDate() + Number(runDays));
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return "Open until filled";
}

function calculateClosingDate(postDate?: string | Date, runDays?: string): string {
  if (!postDate || !runDays) return "Open until filled";
  const closingDate = new Date(postDate);
  closingDate.setDate(closingDate.getDate() + Number(runDays));
  return closingDate.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ── Main Job Detail Page Component ──────────────────────────────────── */

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

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

  // Fetch similar jobs
  const { data: relatedJobsResponse } = useQuery({
    queryKey: ["related-jobs", job?.category, job?._id],
    queryFn: async () => {
      if (!job?.category) return { data: [] };
      const res = await fetch(
        `/api/jobs?category=${encodeURIComponent(job.category)}&limit=4`
      );
      if (!res.ok) return { data: [] };
      return res.json() as Promise<{ success: boolean; data: JobDetail[] }>;
    },
    enabled: !!job?.category,
  });

  const related =
    relatedJobsResponse?.data
      ?.filter((rj) => rj._id !== job?._id)
      .slice(0, 3) || [];

  /* ── Skeleton Loading View ────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 font-sans">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded-full" />
          <div className="h-12 w-3/4 bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-36 bg-white rounded-3xl border border-slate-200" />
            <div className="h-36 bg-white rounded-3xl border border-slate-200" />
            <div className="h-36 bg-white rounded-3xl border border-slate-200" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-4 h-96 bg-white rounded-3xl border border-slate-200" />
            <div className="lg:col-span-8 h-[600px] bg-white rounded-3xl border border-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  /* ── 404 Not Found View ───────────────────────────────────────────── */
  if (!job) {
    return (
      <section className="bg-slate-50/50 min-h-[80vh] flex items-center justify-center py-20 px-4 font-sans">
        <div className="text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-[#059669]">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Job Listing Not Found
          </h1>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            This position may have expired or been filled. Explore open opportunities across Canada on our main job portal.
          </p>
          <Link href="/jobs">
            <Button className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-7 py-3 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 mx-auto">
              Browse All Opportunities <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const applyMethods = job.applyMethods || [];
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-24">
      {/* Modals */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={job.title}
        company={job.company}
        applyMethods={applyMethods}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={currentUrl}
        title={job.title}
      />

      {/* ── Section 1: Hero Header (Matches Contact Page Theme & Open Layout) ── */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60 py-10 lg:py-14 overflow-hidden">
        {/* Subtle Ambient Emerald Accent Glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-4"
          >
            <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none flex items-center gap-1">
              <Building2 size={11} /> {job.company}
            </span>
            <span className="text-xs font-semibold text-slate-700 leading-none">
              Verified Canadian Listing
            </span>
          </motion.div>

          {/* Main Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-4xl"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              {job.title}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-bold text-slate-900">{job.company}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                <MapPin size={15} className="text-[#059669]" /> {getLocation(job)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                <Clock size={15} className="text-[#059669]" /> {job.employmentType}
              </span>
            </p>
          </motion.div>

          {/* 3 Floating Top Stat Cards (Matching Contact Page 3-Card Grid Layout) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-8"
          >
            {/* Card 1: Pay */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-200 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-3">
                <DollarSign size={20} />
              </div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Pay / Compensation
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5 truncate">
                {formatSalary(job.salary, job.salaryType)}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-1">
                Competitive Compensation
              </span>
            </div>

            {/* Card 2: Employment Type */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-200 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Employment Type
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5 truncate">
                {job.employmentType || "Full-time"}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-1">
                {job.remote ? "Remote Work Available" : getLocation(job)}
              </span>
            </div>

            {/* Card 3: Target Start Date */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-emerald-200 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-3">
                <Calendar size={20} />
              </div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Target Start Date
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5 truncate">
                {job.startDate ? getStartDateLabel(job.startDate) : "Immediate / ASAP"}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-1">
                {job.vacancies ? `${job.vacancies} Vacancy Available` : `NOC: ${job.nocCode || "N/A"}`}
              </span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Section 2: Main 2-Column Section (Matches Contact Page Grid Architecture) ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column (4 Cols): Solid Emerald CTA Banner & Employer Card ── */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Solid Emerald Feature Banner (Identical to Contact Page Left Banner) */}
            <div className="bg-[#059669] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
              {/* Subtle background glow circle */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                <Send size={12} /> Apply Direct
              </div>

              {/* Headline */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  Ready to Apply for this Position?
                </h3>
                <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                  Follow the employer's direct contact instructions to submit your resume and cover letter.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full h-12 bg-white text-[#059669] hover:bg-emerald-50 font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 group"
                >
                  How to Apply <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="h-10 border border-white/30 text-white hover:bg-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Share2 size={13} /> Share
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaved(!saved)}
                    className="h-10 border border-white/30 text-white hover:bg-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Bookmark size={13} className={saved ? "fill-white" : ""} />
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>

              {/* Closing Date Footer */}
              {/* <div className="pt-4 border-t border-white/20 text-[11px] text-emerald-100 font-medium flex items-center justify-between">
                <span>Application Deadline:</span>
                <span className="font-extrabold text-white">
                  {calculateClosingDate(job.postDate, job.runDays)}
                </span>
              </div> */}
            </div>

            {/* Employer Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm tracking-wide pb-3 border-b border-slate-100 flex items-center gap-2">
                <Building2 size={16} className="text-[#059669]" /> Employer Profile
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-100 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
                  {job.company ? job.company.charAt(0).toUpperCase() : <Building2 size={20} />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1">
                    {job.company}
                    <CheckCircle2 size={14} className="text-[#059669]" />
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{getLocation(job)}</p>
                </div>
              </div>

              {job.contactName && (
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <User size={13} className="text-[#059669]" />
                  <span>Hiring Contact: <strong className="font-bold text-slate-900">{job.contactName}</strong></span>
                </div>
              )}

              {job.website && (
                <a
                  href={job.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-bold text-[#059669] hover:underline bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100"
                >
                  <span className="truncate">Visit Employer Website</span>
                  <ExternalLink size={13} className="flex-shrink-0" />
                </a>
              )}

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-[#059669]" />
                <span>Verified recruiter on GetJobsCanada</span>
              </div>
            </div>

            {/* Similar Opportunities Widget */}
            {related.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-wide">
                    Similar Opportunities
                  </h3>
                  <Link
                    href={`/jobs?category=${encodeURIComponent(job.category)}`}
                    className="text-xs font-bold text-[#059669] hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {related.map((rj) => (
                    <Link
                      key={rj._id}
                      href={`/jobs/${rj._id || rj.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:border-[#059669]/40 hover:bg-white transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-xs group-hover:text-[#059669] transition-colors line-clamp-1">
                            {rj.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {rj.company} • {rj.province}
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-[#059669] group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-0.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>

          {/* ── Right Column (8 Cols): Main White Content Cards ──────────────── */}
          <main className="lg:col-span-8 flex flex-col gap-6">

            {/* About the Role */}
            {job.descriptionHtml && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                  <FileText size={20} className="text-[#059669]" /> About the Role
                </h2>
                <div
                  className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-4
                    [&>p]:leading-relaxed [&>p]:mb-3
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:my-3 [&>ul]:text-slate-700
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:my-3
                    [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-6 [&>h3]:mb-2
                    [&_li]:marker:text-[#059669]"
                  dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                />
              </div>
            )}

            {/* Qualifications & Requirements */}
            {job.requirementsHtml && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                  <CheckCircle2 size={20} className="text-[#059669]" /> Qualifications & Requirements
                </h2>
                <div
                  className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-4
                    [&>p]:leading-relaxed [&>p]:mb-3
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:my-3 [&>ul]:text-slate-700
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:my-3
                    [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-6 [&>h3]:mb-2
                    [&_li]:marker:text-[#059669]"
                  dangerouslySetInnerHTML={{ __html: job.requirementsHtml }}
                />
              </div>
            )}

            {/* Position Summary & Specifications Matrix */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
                <Code2 size={18} className="text-[#059669]" /> Position Summary & Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 rounded-2xl p-5 border border-slate-200/60">
                {job.nocCode && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-mono font-bold shadow-xs">
                      #
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block">NOC Classification</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{job.nocCode}</span>
                    </div>
                  </div>
                )}

                {job.experience && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-[#059669] flex items-center justify-center shadow-xs">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block">Experience Level</span>
                      <span className="text-xs font-bold text-slate-800">{job.experience} {parseInt(job.experience) > 1 ? "Years" : "Year"}</span>
                    </div>
                  </div>
                )}

                {job.startDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-[#059669] flex items-center justify-center shadow-xs">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block">Target Start Date</span>
                      <span className="text-xs font-bold text-slate-800">{getStartDateLabel(job.startDate)}</span>
                    </div>
                  </div>
                )}

                {/* {job.runDays && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-[#059669] flex items-center justify-center shadow-xs">
                      <Clock size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Listing Duration</span>
                      <span className="text-xs font-bold text-slate-800">{job.runDays} Days Active</span>
                    </div>
                  </div>
                )} */}

                {/* Posted Date */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-[#059669] flex items-center justify-center shadow-xs">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Posted Date</span>
                    <span className="text-xs font-bold text-slate-800">{formatDate(job.postDate || job.postedAt)}</span>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-xs">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] text-rose-400 font-extrabold block uppercase tracking-wider">Expiry Date</span>
                    <span className="text-xs font-extrabold text-rose-600">{getExpiryDate(job.expiresAt, job.postDate || job.postedAt, job.runDays)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Floating Action Bar */}
            <div className="lg:hidden sticky bottom-4 z-30 bg-white/95 backdrop-blur-md border border-slate-200/80 p-4 rounded-3xl shadow-xl flex items-center gap-3">
              <Button
                onClick={() => setIsApplyModalOpen(true)}
                className="flex-1 h-12 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2"
              >
                <Send size={16} /> How to Apply
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsShareModalOpen(true)}
                className="h-12 w-12 border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center p-0"
              >
                <Share2 size={18} />
              </Button>
            </div>

          </main>

        </div>
      </div>
    </div>
  );
}
