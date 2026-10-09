"use client";

import { useState, useMemo, ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  SlidersHorizontal,
  X,
  ChevronRight,
  Wifi,
  Leaf,
  ChevronLeft,
  ChevronDown,
  Briefcase,
  Calendar,
  Code2,
  Hash,
  Users,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  RotateCcw,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ── Constants ──────────────────────────────────────────────────────── */
const PAGE_SIZE = 8;

const ALL_CATEGORIES = [
  "Administration & Office",
  "Arts, Culture & Heritage",
  "Community & Social Services",
  "Construction & Trades",
  "Education & Training",
  "Environment & Natural Resources",
  "Finance & Accounting",
  "Government & Public Administration",
  "Health & Medical",
  "Hospitality & Tourism",
  "Information Technology",
  "Legal & Justice",
  "Management & Executive",
  "Marketing & Communications",
  "Natural Resources & Forestry",
  "Nursing & Allied Health",
  "Oil, Gas & Mining",
  "Other",
  "Sales & Customer Service",
  "Science & Research",
  "Security & Law Enforcement",
  "Transportation & Logistics",
  "Restaurant & Food Service",
];

const ALL_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland & Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Québec",
  "Saskatchewan",
  "Yukon",
];

const ALL_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Casual / Seasonal",
  "Volunteer",
];

/* ── Types ──────────────────────────────────────────────────────────── */
export interface Job {
  postDate: ReactNode;
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
  category: string;
  nocCode: string;
  runDays?: string;
  experience?: string;
  startDate?: string;
  descriptionHtml: string;
  requirementsHtml?: string;
  contactEmail: string;
  website?: string;
  indigenousOwned: boolean;
  remote: boolean;
  status: string;
  featured?: boolean;
  postedAt: string | Date;
  createdAt?: string | Date;
  expiresAt?: string | Date;
  indigenousPreference?: boolean;
  vacancies?: number;
}

export interface JobFilters {
  query: string;
  province: string;
  category: string;
  type: string;
  remote: boolean;
  indigenous: boolean;
}

/* ── Helper functions ───────────────────────────────────────────────── */
function formatSalary(salary: string, salaryType?: string): string {
  if (!salary) return "";
  const typeMap: Record<string, string> = {
    hour: "/hr",
    week: "/wk",
    month: "/mo",
    year: "/yr",
  };
  const suffix = salaryType && typeMap[salaryType] ? typeMap[salaryType] : "";
  return `${salary}${suffix}`;
}

function getStartDateLabel(startDate: string): string {
  const dateMap: Record<string, string> = {
    asap: "ASAP",
    immediate: "Immediate",
    "1week": "Within 1 wk",
    "2weeks": "Within 2 wks",
    "1month": "Within 1 mo",
  };
  return dateMap[startDate] || startDate;
}

function getLocation(job: Job): string {
  const parts = [];
  if (job.city && job.city !== job.province) parts.push(job.city);
  if (job.province) parts.push(job.province);
  return parts.join(", ") || job.location || "Location N/A";
}

function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    if (filters.query) {
      const query = filters.query.toLowerCase().trim();
      const matchesSearch =
        (job.title || "").toLowerCase().includes(query) ||
        (job.company || "").toLowerCase().includes(query) ||
        (job.category || "").toLowerCase().includes(query) ||
        (job.descriptionHtml || "").toLowerCase().includes(query) ||
        (getLocation(job) || "").toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (filters.province && (job.province || "") !== filters.province) return false;
    if (filters.category && (job.category || "") !== filters.category) return false;

    if (filters.type) {
      const typeMap: Record<string, string> = {
        "Full-time": "Full-time",
        "Part-time": "Part-time",
        Contract: "Contract",
        "Casual / Seasonal": "Casual",
        Volunteer: "Volunteer",
      };
      const jobType = typeMap[job.employmentType || ""] || job.employmentType || "";
      if (jobType !== filters.type) return false;
    }

    if (filters.remote && !job.remote) return false;
    if (filters.indigenous && !job.indigenousOwned && !job.indigenousPreference)
      return false;

    return true;
  });
}

/* ── Animations ─────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

/* ── Job Card Component (Matches App Emerald Brand Theme) ─────────────── */
function JobCard({ job, viewMode = "grid" }: { job: Job; viewMode?: "grid" | "list" }) {
  const isList = viewMode === "list";

  return (
    <motion.div variants={fadeUp} className="w-full">
      <Link
        href={`/jobs/${job._id || job.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative block bg-white rounded-2xl border border-slate-200/80 hover:border-[#059669]/50 hover:shadow-md hover:shadow-emerald-950/5 transition-all duration-200 p-5 lg:p-6 overflow-hidden ${
          job.featured ? "ring-1 ring-[#059669]/30 bg-gradient-to-br from-emerald-50/20 via-white to-white" : ""
        } ${isList ? "flex flex-col md:flex-row md:items-center justify-between gap-6" : "flex flex-col justify-between h-full"}`}
      >
        <div className="flex-1">
          {/* Top Bar: Company Logo Avatar & Badges */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-100 flex items-center justify-center font-extrabold text-lg flex-shrink-0 group-hover:bg-[#059669] group-hover:text-white transition-colors duration-200">
                {job.company ? job.company.charAt(0).toUpperCase() : <Building2 size={20} />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#059669] transition-colors flex items-center gap-1">
                  {job.company}
                  <CheckCircle2 size={13} className="text-[#059669] fill-emerald-50" />
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">
                  {job.category || "General Role"}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 justify-end">
              {job.featured && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-[#059669] text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                  <Sparkles size={10} /> Featured
                </span>
              )}
              {job.remote && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 rounded-full font-medium">
                  <Wifi size={10} /> Remote
                </span>
              )}
              {(job.indigenousOwned || job.indigenousPreference || job.featured) && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-medium">
                  <CheckCircle2 size={10} className="text-[#059669]" /> Verified Employer
                </span>
              )}
              {job.jobId && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono border border-slate-200">
                  <Hash size={9} /> {job.jobId}
                </span>
              )}
            </div>
          </div>

          {/* Job Title */}
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#059669] transition-colors duration-200 mb-3 leading-snug line-clamp-2">
            {job.title}
          </h3>

          {/* Meta Details Grid */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-600 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-slate-100/70 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
              <MapPin size={12} className="text-[#059669]" />
              {getLocation(job)}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-100/70 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
              <Clock size={12} className="text-[#059669]" />
              {job.employmentType}
            </span>
            {formatSalary(job.salary, job.salaryType) && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#059669] border border-emerald-200/60 px-2.5 py-1 rounded-lg font-bold">
                <DollarSign size={12} className="text-[#059669]" />
                {formatSalary(job.salary, job.salaryType)}
              </span>
            )}
            {job.nocCode && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-mono text-[11px]">
                <Code2 size={11} /> NOC {job.nocCode}
              </span>
            )}
          </div>

          {/* Secondary Details Row */}
          {(job.vacancies || job.startDate || job.experience) && (
            <div className="flex flex-wrap items-center gap-2 mb-4 pt-1 border-t border-slate-100 text-xs">
              {job.vacancies && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-md font-medium">
                  <Users size={11} className="text-[#059669]" /> {job.vacancies} {job.vacancies > 1 ? "Vacancies" : "Vacancy"}
                </span>
              )}
              {job.startDate && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-md font-medium">
                  <Calendar size={11} className="text-slate-400" /> Start: {getStartDateLabel(job.startDate)}
                </span>
              )}
              {job.experience && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-md font-medium">
                  <Briefcase size={11} className="text-slate-400" /> Exp: {job.experience} {parseInt(job.experience) > 1 ? "yrs" : "yr"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Action */}
        <div className={`flex items-center justify-between pt-3 border-t border-slate-100 ${isList ? "md:border-t-0 md:pt-0 md:flex-col md:items-end md:gap-3" : ""}`}>
          <span className="text-[11px] font-medium text-slate-400">
            {job?.postDate
              ? new Date(job.postDate as string).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Recently posted"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#059669] group-hover:bg-[#047857] px-3.5 py-2 rounded-xl transition-all duration-200 shadow-xs">
            View Job <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Custom Filter Select Component ─────────────────────────────────── */
function CustomFilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  icon?: any;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-[#059669]" />}
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 pr-8 transition-all cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

/* ── Main Jobs Page Component ────────────────────────────────────────── */
export default function JobsPage() {
  const [filters, setFilters] = useState<JobFilters>({
    query: "",
    province: "",
    category: "",
    type: "",
    remote: false,
    indigenous: false,
  });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { data: dbJobsResponse, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      return apiClient.get("/jobs");
    },
  });

  const dbJobs = dbJobsResponse?.data || [];

  const set = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearAll = () => {
    setFilters({
      query: "",
      province: "",
      category: "",
      type: "",
      remote: false,
      indigenous: false,
    });
    setPage(1);
  };

  const allJobs = useMemo(() => {
    return dbJobs.map(
      (job: any): Job => ({
        _id: job._id,
        id: job._id,
        title: job.title,
        company: job.company,
        contactName: job.contactName,
        jobId: job.jobId,
        city: job.city || "",
        province: job.province,
        location: job.location,
        salary: job.salary || "",
        salaryType: job.salaryType || "hour",
        employmentType:
          job.employmentType === "Casual"
            ? "Casual / Seasonal"
            : job.employmentType,
        category: job.category,
        nocCode: job.nocCode || "",
        runDays: job.runDays,
        experience: job.experience,
        startDate: job.startDate,
        descriptionHtml: job.descriptionHtml || job.description || "",
        requirementsHtml: job.requirementsHtml || job.requirements || "",
        contactEmail: job.contactEmail,
        website: job.website,
        indigenousOwned:
          job.indigenousOwned ?? job.indigenousPreference ?? false,
        remote: job.remote ?? false,
        status: job.status,
        featured: job.package === "featured" || false,
        postedAt: job.postedAt || job.createdAt || new Date(),
        createdAt: job.createdAt,
        expiresAt: job.expiresAt,
        indigenousPreference: job.indigenousPreference,
        postDate: job.postDate,
        vacancies: job.vacancies,
      })
    );
  }, [dbJobs]);

  const filtered = useMemo(() => filterJobs(allJobs, filters), [allJobs, filters]);
  const featured = useMemo(() => allJobs.filter((j: { featured: any; }) => j.featured), [allJobs]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = [
    filters.province,
    filters.category,
    filters.type,
    filters.remote ? "remote" : "",
    filters.indigenous ? "indigenous" : "",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0 || filters.query !== "";

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20">
      
      {/* ─── Fresh Light Theme Hero (Matches Contact Page Theme) ─────────────── */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60 py-12 lg:py-16 overflow-hidden">
        {/* Subtle Brand Accent Glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl text-left"
          >
            {/* Top Hero Pill Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-4"
            >
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none flex items-center gap-1">
                <Compass size={11} /> Job Portal
              </span>
              <span className="text-xs font-semibold text-slate-700 leading-none">
                Explore Verified Opportunities Across Canada
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3"
            >
              Find Your Next Opportunity with{" "}
              <span className="text-[#059669]">GetJobsCanada</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-slate-600 text-base sm:text-lg leading-relaxed"
            >
              Explore top jobs and career opportunities from verified employers
              and leading companies across every province and territory in Canada.
            </motion.p>
          </motion.div>

          {/* ── Unified Clean Light Search Command Hub ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white p-3.5 rounded-3xl shadow-lg border border-slate-200/80 flex flex-col md:flex-row items-stretch gap-3 mt-8 max-w-5xl"
          >
            {/* Search Input */}
            <div className="relative flex-1 flex items-center bg-slate-50/70 border border-slate-200/60 rounded-2xl px-4 py-1 focus-within:bg-white focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#059669]/20 transition-all">
              <Search size={18} className="text-[#059669] flex-shrink-0 mr-3" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => set("query", e.target.value)}
                placeholder="Job title, keywords, or company..."
                className="w-full h-11 bg-transparent border-none outline-none text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Province Select */}
            <div className="relative md:w-56 flex items-center">
              <MapPin size={18} className="absolute left-3.5 text-[#059669]" />
              <select
                value={filters.province}
                onChange={(e) => set("province", e.target.value)}
                className="w-full h-12 pl-10 pr-8 bg-slate-50/60 border-0 text-xs font-semibold text-slate-800 rounded-2xl outline-none appearance-none focus:bg-white cursor-pointer"
              >
                <option value="">All Provinces</option>
                {ALL_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Category Select */}
            <div className="relative md:w-60 flex items-center">
              <Briefcase size={18} className="absolute left-3.5 text-[#059669]" />
              <select
                value={filters.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full h-12 pl-10 pr-8 bg-slate-50/60 border-0 text-xs font-semibold text-slate-800 rounded-2xl outline-none appearance-none focus:bg-white cursor-pointer"
              >
                <option value="">All Categories</option>
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              className="h-12 px-7 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
            >
              Search <ArrowRight size={16} />
            </Button>
          </motion.div>

          {/* Quick Filter Tag Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap items-center gap-2 mt-5 text-xs"
          >
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">Trending:</span>
            {[
              { label: "Remote / Hybrid", action: () => set("remote", !filters.remote), active: filters.remote },
              { label: "Verified Employers", action: () => set("indigenous", !filters.indigenous), active: filters.indigenous },
              { label: "Full-Time", action: () => set("type", filters.type === "Full-time" ? "" : "Full-time"), active: filters.type === "Full-time" },
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={tag.action}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  tag.active
                    ? "bg-[#059669] border-[#059669] text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-emerald-50/60 hover:border-emerald-200"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </motion.div>

          {/* Stats Summary Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap gap-8 mt-8 pt-6 border-t border-slate-200/60 text-left"
          >
            {[
              { value: `${allJobs.length}`, label: "Active Listings" },
              {
                value: `${allJobs.filter((j: { featured: any; indigenousOwned: any; }) => j.featured || j.indigenousOwned).length || allJobs.length}`,
                label: "Verified Employers",
              },
              {
                value: `${allJobs.filter((j: { remote: any; }) => j.remote).length}`,
                label: "Remote Roles",
              },
              {
                value: `${new Set(allJobs.map((j: { province: any; }) => j.province)).size}`,
                label: "Provinces & Territories",
              },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#059669]">
                  {value}
                </span>
                <span className="text-xs font-semibold text-slate-600">{label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ─── Main Content Body ────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-8">
        
        {/* Top Control Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800">
              <span className="text-[#059669] font-black text-base">{filtered.length}</span> Opportunities Found
            </span>
            {hasActiveFilters && (
              <span className="text-xs bg-emerald-50 text-[#059669] px-3 py-1 rounded-full font-bold border border-emerald-200/60">
                {activeFilterCount} Active Filters
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Reset All */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline"
              >
                <RotateCcw size={13} /> Reset All
              </button>
            )}

            {/* Mobile Filter Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden border-slate-200 text-slate-700 text-xs font-bold gap-1.5 rounded-2xl"
            >
              <Filter size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "grid" ? "bg-white text-[#059669] shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "list" ? "bg-white text-[#059669] shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>

          </div>
        </div>

        {/* ── Active Filter Pills Bar ────────────────────────────────────────── */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active:</span>
            {filters.query && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-slate-900 text-white rounded-full px-3 py-1 font-medium shadow-xs">
                "{filters.query}"
                <button type="button" onClick={() => set("query", "")} className="hover:text-emerald-300"><X size={12} /></button>
              </span>
            )}
            {filters.province && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-white text-slate-800 border border-slate-200 rounded-full px-3 py-1 font-medium shadow-xs">
                📍 {filters.province}
                <button type="button" onClick={() => set("province", "")} className="text-slate-400 hover:text-slate-700"><X size={12} /></button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-white text-slate-800 border border-slate-200 rounded-full px-3 py-1 font-medium shadow-xs">
                💼 {filters.category}
                <button type="button" onClick={() => set("category", "")} className="text-slate-400 hover:text-slate-700"><X size={12} /></button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-white text-slate-800 border border-slate-200 rounded-full px-3 py-1 font-medium shadow-xs">
                ⏱️ {filters.type}
                <button type="button" onClick={() => set("type", "")} className="text-slate-400 hover:text-slate-700"><X size={12} /></button>
              </span>
            )}
            {filters.remote && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-semibold shadow-xs">
                🌐 Remote
                <button type="button" onClick={() => set("remote", false)} className="hover:text-blue-900"><X size={12} /></button>
              </span>
            )}
            {filters.indigenous && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-[#059669] border border-emerald-200 rounded-full px-3 py-1 font-semibold shadow-xs">
                ✅ Verified Employers
                <button type="button" onClick={() => set("indigenous", false)} className="hover:text-emerald-900"><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Main Grid: Sidebar + Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ── Sidebar Filters (Desktop 4 Cols) ─────────────────────────────── */}
          <aside className="hidden lg:flex lg:col-span-4 flex-col gap-6 sticky top-24">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-sm tracking-wide flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#059669]" /> Refine Search
                </h2>
                {hasActiveFilters && (
                  <button type="button" onClick={clearAll} className="text-xs text-[#059669] font-bold hover:underline">
                    Reset
                  </button>
                )}
              </div>

              {/* Province */}
              <CustomFilterSelect
                id="d-province"
                label="Province / Territory"
                value={filters.province}
                onChange={(v) => set("province", v)}
                options={ALL_PROVINCES}
                placeholder="All Provinces"
                icon={MapPin}
              />

              {/* Category */}
              <CustomFilterSelect
                id="d-category"
                label="Job Category"
                value={filters.category}
                onChange={(v) => set("category", v)}
                options={ALL_CATEGORIES}
                placeholder="All Categories"
                icon={Briefcase}
              />

              {/* Type */}
              <CustomFilterSelect
                id="d-type"
                label="Employment Type"
                value={filters.type}
                onChange={(v) => set("type", v)}
                options={ALL_TYPES}
                placeholder="All Types"
                icon={Clock}
              />

              {/* Checkbox Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <Wifi size={14} className="text-blue-600" /> Remote / Hybrid Only
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => set("remote", e.target.checked)}
                    className="w-4 h-4 rounded accent-[#059669] cursor-pointer"
                  />
                </label>

                {/* <label className="flex items-center justify-between cursor-pointer p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#059669]" /> Verified Employers Only
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.indigenous}
                    onChange={(e) => set("indigenous", e.target.checked)}
                    className="w-4 h-4 rounded accent-[#059669] cursor-pointer"
                  />
                </label> */}
              </div>
            </div>

            {/* Post a Job CTA Card */}
            <div className="bg-[#059669] text-white rounded-3xl p-6 lg:p-7 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-white/15 border border-white/20 shadow-xs mb-4 text-white">
                  <span className="bg-emerald-300 text-emerald-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                    Employers
                  </span>
                  <span className="text-xs font-semibold text-white leading-none">
                    Reach Canadian Talent
                  </span>
                </div>

                <h3 className="font-extrabold text-xl text-white mb-2 leading-tight">
                  Hiring Top Canadian Talent?
                </h3>
                <p className="text-emerald-50 text-xs leading-relaxed mb-6">
                  Post your job today to connect with thousands of qualified job seekers across Canada.
                </p>
              </div>

              <Link href="/post-a-job" className="block">
                <Button className="w-full bg-white text-[#059669] hover:bg-emerald-50 font-bold text-xs py-3 rounded-2xl transition-all shadow-md">
                  Post a Job Now
                </Button>
              </Link>
            </div>

          </aside>

          {/* ── Mobile Filter Modal Drawer ───────────────────────────────────── */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white rounded-3xl p-5 border border-slate-200 mb-6 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Filter Jobs</h3>
                  <button type="button" onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-slate-700">
                    <X size={18} />
                  </button>
                </div>
                <CustomFilterSelect
                  id="m-province"
                  label="Province / Territory"
                  value={filters.province}
                  onChange={(v) => set("province", v)}
                  options={ALL_PROVINCES}
                  placeholder="All Provinces"
                />
                <CustomFilterSelect
                  id="m-category"
                  label="Job Category"
                  value={filters.category}
                  onChange={(v) => set("category", v)}
                  options={ALL_CATEGORIES}
                  placeholder="All Categories"
                />
                <CustomFilterSelect
                  id="m-type"
                  label="Employment Type"
                  value={filters.type}
                  onChange={(v) => set("type", v)}
                  options={ALL_TYPES}
                  placeholder="All Types"
                />
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                  <label className="flex items-center justify-between cursor-pointer py-1.5">
                    <span className="text-xs font-semibold text-slate-700">Remote Only</span>
                    <input type="checkbox" checked={filters.remote} onChange={(e) => set("remote", e.target.checked)} className="w-4 h-4 accent-[#059669]" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer py-1.5">
                    <span className="text-xs font-semibold text-slate-700">Verified Employers</span>
                    <input type="checkbox" checked={filters.indigenous} onChange={(e) => set("indigenous", e.target.checked)} className="w-4 h-4 accent-[#059669]" />
                  </label>
                </div>
                <Button type="button" onClick={() => setShowMobileFilters(false)} className="w-full bg-[#059669] text-white font-bold text-xs py-2.5 rounded-2xl">
                  Apply Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Job Listings Stream (8 Cols) ─────────────────────────────────── */}
          <div className="lg:col-span-8">
            
            {/* Featured Section (If page 1 and no active filters) */}
            {page === 1 && !hasActiveFilters && featured.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={15} className="text-[#059669]" /> Featured Employers
                  </h2>
                </div>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-4"}
                >
                  {featured.slice(0, 4).map((job: Job) => (
                    <JobCard key={job._id} job={job} viewMode={viewMode} />
                  ))}
                </motion.div>
                <div className="my-8 border-t border-slate-200/80" />
              </div>
            )}

            {/* Main Job Cards Feed */}
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-4"}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="w-11 h-11 rounded-xl bg-slate-100" />
                      <div className="w-20 h-5 rounded-full bg-slate-100" />
                    </div>
                    <div className="h-5 bg-slate-100 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-10 bg-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : paginated.length > 0 ? (
              <motion.div
                key={`${page}-${JSON.stringify(filters)}-${viewMode}`}
                variants={stagger}
                initial="hidden"
                animate="visible"
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-4"}
              >
                {paginated.map((job) => (
                  <JobCard key={job._id} job={job} viewMode={viewMode} />
                ))}
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8 shadow-xs"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto mb-4">
                  <Search size={26} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs matched your criteria</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  Try broadening your search term or clearing some filters to see more results.
                </p>
                <Button
                  type="button"
                  onClick={clearAll}
                  className="bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}

            {/* ── Pagination ─────────────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => {
                    setPage((p) => p - 1);
                    window.scrollTo({ top: 250, behavior: "smooth" });
                  }}
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 rounded-xl"
                >
                  <ChevronLeft size={16} />
                </Button>

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && page > 3) {
                    pageNum = page - 2 + i;
                    if (pageNum > totalPages) return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setPage(pageNum);
                        window.scrollTo({ top: 250, behavior: "smooth" });
                      }}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        page === pageNum
                          ? "bg-[#059669] text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 250, behavior: "smooth" });
                  }}
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 rounded-xl"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}