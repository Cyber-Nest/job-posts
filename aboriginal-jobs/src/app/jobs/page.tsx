"use client";

import { useState, useMemo, ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ── Constants ──────────────────────────────────────────────────────── */
const PAGE_SIZE = 8;

// Categories from your job posting form
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
    hour: "/hour",
    week: "/week",
    month: "/month",
    year: "/year",
  };
  const suffix = salaryType && typeMap[salaryType] ? typeMap[salaryType] : "";
  return `${salary}${suffix}`;
}

function getStartDateLabel(startDate: string): string {
  const dateMap: Record<string, string> = {
    asap: "ASAP",
    immediate: "Immediate",
    "1week": "Within 1 week",
    "2weeks": "Within 2 weeks",
    "1month": "Within 1 month",
  };
  return dateMap[startDate] || startDate;
}

function getLocation(job: Job): string {
  const parts = [];
  if (job.city && job.city !== job.province) parts.push(job.city);
  if (job.province) parts.push(job.province);
  return parts.join(", ") || job.location || "Location not specified";
}

// Filter jobs function
function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    // Search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.descriptionHtml?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Province
    if (filters.province && job.province !== filters.province) return false;

    // Category
    if (filters.category && job.category !== filters.category) return false;

    // Employment type
    if (filters.type) {
      const typeMap: Record<string, string> = {
        "Full-time": "Full-time",
        "Part-time": "Part-time",
        Contract: "Contract",
        "Casual / Seasonal": "Casual",
        Volunteer: "Volunteer",
      };
      const jobType = typeMap[job.employmentType] || job.employmentType;
      if (jobType !== filters.type) return false;
    }

    // Remote only
    if (filters.remote && !job.remote) return false;

    // Indigenous employers only
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
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ── Job card ───────────────────────────────────────────────────────── */
function JobCard({ job }: { job: Job }) {
  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/jobs/${job._id || job.id}`}
        className="group block bg-white rounded-2xl border border-[#C8782A]/10 hover:border-[#C8782A]/35 hover:shadow-md transition-all duration-200 p-5"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Company icon */}
          <div className="w-11 h-11 rounded-xl bg-[#FAF5EE] border border-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-[#C8782A]" />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 justify-end">
            {job.featured && (
              <span className="text-xs bg-[#C8782A] text-white px-2.5 py-0.5 rounded-full font-semibold">
                Featured
              </span>
            )}
            {job.remote && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#1a64c4]/10 text-[#1a64c4] px-2.5 py-0.5 rounded-full font-medium">
                <Wifi size={10} /> Remote
              </span>
            )}
            {(job.indigenousOwned || job.indigenousPreference) && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#7A9E7E]/15 text-[#4a7a4e] px-2.5 py-0.5 rounded-full font-medium">
                <Leaf size={10} /> Indigenous Employer
              </span>
            )}
            {/* Job ID Badge */}
            {job.jobId && (
              <span className="inline-flex items-center gap-1 text-xs bg-neutral-100 text-neutral-600 border border-neutral-200 px-2.5 py-0.5 rounded-full font-mono">
                <Hash size={10} /> {job.jobId}
              </span>
            )}
          </div>
        </div>

        {/* Title + company */}
        <h3 className="font-bold text-[#1C1C1C] text-base leading-snug mb-0.5 group-hover:text-[#C8782A] transition-colors duration-200 line-clamp-2">
          {job.title}
        </h3>
        <p className="text-sm text-[#C8782A] font-semibold mb-3">
          {job.company}
        </p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/65 min-w-0">
            <MapPin size={11} className="text-[#C8782A] flex-shrink-0" />
            <span className="truncate">{getLocation(job)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/65">
            <Clock size={11} className="text-[#C8782A]" />
            {job.employmentType}
          </span>
          {formatSalary(job.salary, job.salaryType) && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/65">
              <DollarSign size={11} className="text-[#C8782A]" />
              {formatSalary(job.salary, job.salaryType)}
            </span>
          )}
          {job.nocCode && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/65">
              <Code2 size={11} className="text-[#C8782A]" />
              NOC: {job.nocCode}
            </span>
          )}
        </div>

        {/*  Experience, start date, and vacancies */}
        {(job.experience || job.startDate || job.vacancies) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.vacancies && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#FAF5EE] border border-[#C8782A]/10 text-[#6B3A2A]/70 px-2 py-0.5 rounded-full font-medium">
                <Users size={10} className="text-[#C8782A]" /> {job.vacancies} {job.vacancies > 1 ? "Vacancies" : "Vacancy"}
              </span>
            )}
            {job.experience && (
              <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                <Briefcase size={10} /> {job.experience}{" "}
                {parseInt(job.experience) > 1 ? "years" : "year"}
              </span>
            )}
            {job.startDate && (
              <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                <Calendar size={10} /> Start: {getStartDateLabel(job.startDate)}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#C8782A]/8">
          <span className="text-xs text-[#6B3A2A]/45">
            {job?.postDate
              ? new Date(job.postDate as string).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "N/A"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8782A] group-hover:gap-2 transition-all duration-200">
            View Job <ChevronRight size={13} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Filter pill ────────────────────────────────────────────────────── */
function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs bg-[#C8782A]/10 text-[#6B3A2A] border border-[#C8782A]/20 rounded-full px-3 py-1 font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-[#C8782A] hover:text-[#B06820] transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X size={11} />
      </button>
    </span>
  );
}

/* ── Select field ───────────────────────────────────────────────────── */
function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-[#6B3A2A]/60 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[#C8782A]/20 bg-white px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30 pr-8"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40 pointer-events-none"
        />
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
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
  const [showFilters, setShowFilters] = useState(false);

  const { data: dbJobsResponse, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json() as Promise<{ success: boolean; data: Job[] }>;
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
      }),
    );
  }, [dbJobs]);

  const filtered = useMemo(
    () => filterJobs(allJobs, filters),
    [allJobs, filters],
  );
  const featured = useMemo(() => allJobs.filter((j) => j.featured), [allJobs]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = [
    filters.province,
    filters.category,
    filters.type,
    filters.remote ? "remote" : "",
    filters.indigenous ? "indigenous" : "",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0 || filters.query;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#FAF5EE] py-14 lg:py-20 relative overflow-hidden">
        <div
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-[380px] h-[380px] text-[#C8782A] pointer-events-none opacity-20"
          aria-hidden="true"
        >
          <svg viewBox="0 0 400 400" fill="none">
            <circle
              cx="200"
              cy="200"
              r="180"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="200"
              cy="200"
              r="120"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
            <circle
              cx="200"
              cy="200"
              r="60"
              fill="currentColor"
              opacity="0.15"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <p className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">
              Job Board
            </p>
            <h1
              className="text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Find Your Next Opportunity
            </h1>
            <p className="text-[#6B3A2A]/70 text-lg leading-relaxed mb-8">
              Explore jobs from Indigenous organizations and inclusive employers
              committed to reconciliation — across every province and territory
              in Canada.
            </p>

            {/* Search bar */}
            <div className="flex gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40"
                />
                <Input
                  type="search"
                  value={filters.query}
                  onChange={(e) => set("query", e.target.value)}
                  placeholder="Job title, company, or keyword…"
                  className="pl-10 border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 bg-white h-12 text-sm"
                />
              </div>
              <Button
                type="button"
                className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold h-12 px-6 shadow-sm"
              >
                Search
              </Button>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-wrap gap-6 mt-10"
          >
            {[
              { value: `${allJobs.length}`, label: "Active Listings" },
              {
                value: `${allJobs.filter((j) => j.indigenousOwned).length}`,
                label: "Indigenous Employers",
              },
              {
                value: `${allJobs.filter((j) => j.remote).length}`,
                label: "Remote Roles",
              },
              {
                value: `${new Set(allJobs.map((j) => j.province)).size}`,
                label: "Provinces & Territories",
              },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-bold text-[#C8782A]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {value}
                </span>
                <span className="text-sm text-[#6B3A2A]/60">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-white py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">
              <div className="bg-[#FAF5EE] rounded-2xl p-5 border border-[#C8782A]/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[#1C1C1C] text-sm">
                    Filter Jobs
                  </h2>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs text-[#C8782A] hover:underline font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <FilterSelect
                    id="filter-province"
                    label="Province / Territory"
                    value={filters.province}
                    onChange={(v) => set("province", v)}
                    options={ALL_PROVINCES}
                    placeholder="All provinces"
                  />
                  <FilterSelect
                    id="filter-category"
                    label="Category"
                    value={filters.category}
                    onChange={(v) => set("category", v)}
                    options={ALL_CATEGORIES}
                    placeholder="All categories"
                  />
                  <FilterSelect
                    id="filter-type"
                    label="Employment Type"
                    value={filters.type}
                    onChange={(v) => set("type", v)}
                    options={ALL_TYPES}
                    placeholder="All types"
                  />

                  <div className="flex flex-col gap-2.5 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.remote}
                        onChange={(e) => set("remote", e.target.checked)}
                        className="w-4 h-4 accent-[#C8782A]"
                      />
                      <span className="text-sm text-[#6B3A2A]/75 font-medium">
                        Remote / Hybrid only
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.indigenous}
                        onChange={(e) => set("indigenous", e.target.checked)}
                        className="w-4 h-4 accent-[#7A9E7E]"
                      />
                      <span className="text-sm text-[#6B3A2A]/75 font-medium">
                        Indigenous employers only
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Post a job CTA */}
              <div className="bg-[#6B3A2A] rounded-2xl p-5 text-[#FAF5EE]">
                <h3
                  className="font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Hiring Indigenous Talent?
                </h3>
                <p className="text-[#FAF5EE]/70 text-xs leading-relaxed mb-4">
                  Post your job and reach thousands of qualified Indigenous job
                  seekers across Canada.
                </p>
                <Link href="/post-a-job">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#6B3A2A] w-full text-sm font-semibold"
                  >
                    Post a Job
                  </Button>
                </Link>
              </div>
            </aside>

            {/* Job listings */}
            <div>
              {/* Mobile filter toggle */}
              <div className="flex items-center justify-between mb-5 lg:hidden">
                <p className="text-sm text-[#6B3A2A]/60">
                  <span className="font-bold text-[#1C1C1C]">
                    {filtered.length}
                  </span>{" "}
                  jobs found
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters((v) => !v)}
                  className="border-[#C8782A]/25 text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-black gap-2"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-[#C8782A] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Mobile filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-5 lg:hidden"
                  >
                    <div className="bg-[#FAF5EE] rounded-2xl p-5 border border-[#C8782A]/10 flex flex-col gap-4">
                      <FilterSelect
                        id="m-filter-province"
                        label="Province / Territory"
                        value={filters.province}
                        onChange={(v) => set("province", v)}
                        options={ALL_PROVINCES}
                        placeholder="All provinces"
                      />
                      <FilterSelect
                        id="m-filter-category"
                        label="Category"
                        value={filters.category}
                        onChange={(v) => set("category", v)}
                        options={ALL_CATEGORIES}
                        placeholder="All categories"
                      />
                      <FilterSelect
                        id="m-filter-type"
                        label="Employment Type"
                        value={filters.type}
                        onChange={(v) => set("type", v)}
                        options={ALL_TYPES}
                        placeholder="All types"
                      />
                      <div className="flex flex-col gap-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.remote}
                            onChange={(e) => set("remote", e.target.checked)}
                            className="w-4 h-4 accent-[#C8782A]"
                          />
                          <span className="text-sm text-[#6B3A2A]/75 font-medium">
                            Remote / Hybrid only
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.indigenous}
                            onChange={(e) =>
                              set("indigenous", e.target.checked)
                            }
                            className="w-4 h-4 accent-[#7A9E7E]"
                          />
                          <span className="text-sm text-[#6B3A2A]/75 font-medium">
                            Indigenous employers only
                          </span>
                        </label>
                      </div>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-xs text-[#C8782A] hover:underline font-medium text-left"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results header + active filter pills */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <p className="hidden lg:block text-sm text-[#6B3A2A]/60">
                  <span className="font-bold text-[#1C1C1C]">
                    {filtered.length}
                  </span>{" "}
                  job{filtered.length !== 1 ? "s" : ""} found
                </p>
                {filters.province && (
                  <FilterPill
                    label={filters.province}
                    onRemove={() => set("province", "")}
                  />
                )}
                {filters.category && (
                  <FilterPill
                    label={filters.category}
                    onRemove={() => set("category", "")}
                  />
                )}
                {filters.type && (
                  <FilterPill
                    label={filters.type}
                    onRemove={() => set("type", "")}
                  />
                )}
                {filters.remote && (
                  <FilterPill
                    label="Remote"
                    onRemove={() => set("remote", false)}
                  />
                )}
                {filters.indigenous && (
                  <FilterPill
                    label="Indigenous Employers"
                    onRemove={() => set("indigenous", false)}
                  />
                )}
              </div>

              {/* Featured strip */}
              {page === 1 && !hasActiveFilters && featured.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-semibold text-[#6B3A2A]/50 uppercase tracking-wider mb-3">
                    Featured Listings
                  </p>
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {featured.slice(0, 3).map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </motion.div>
                  <div className="my-8 border-t border-[#C8782A]/10" />
                  <p className="text-xs font-semibold text-[#6B3A2A]/50 uppercase tracking-wider mb-3">
                    All Listings
                  </p>
                </div>
              )}

              {/* Job grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#C8782A]/10 bg-white p-5 animate-pulse"
                    >
                      {/* Top section */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-[#FAF5EE]" />
                        <div className="flex gap-1.5">
                          <div className="h-5 w-16 rounded-full bg-[#FAF5EE]" />
                          <div className="h-5 w-16 rounded-full bg-[#FAF5EE]" />
                          <div className="h-5 w-20 rounded-full bg-[#FAF5EE]" />
                        </div>
                      </div>

                      {/* Title & company */}
                      <div className="h-5 w-3/4 rounded bg-[#FAF5EE] mb-2" />
                      <div className="h-4 w-1/3 rounded bg-[#FAF5EE] mb-3" />

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="h-4 w-full rounded bg-[#FAF5EE]" />
                        <div className="h-4 w-full rounded bg-[#FAF5EE]" />
                        <div className="h-4 w-full rounded bg-[#FAF5EE]" />
                        <div className="h-4 w-full rounded bg-[#FAF5EE]" />
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between pt-3 border-t border-[#C8782A]/8">
                        <div className="h-4 w-20 rounded bg-[#FAF5EE]" />
                        <div className="h-4 w-16 rounded bg-[#FAF5EE]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginated.length > 0 ? (
                <motion.div
                  key={`${page}-${JSON.stringify(filters)}`}
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {paginated.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C8782A]/10 flex items-center justify-center mb-4">
                    <Search size={24} className="text-[#C8782A]/50" />
                  </div>
                  <h3
                    className="text-xl font-bold text-[#1C1C1C] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    No jobs found
                  </h3>
                  <p className="text-[#6B3A2A]/60 text-sm mb-5 max-w-xs">
                    Try adjusting your search terms or removing some filters.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearAll}
                    className="border-[#C8782A]/30 text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-black"
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => {
                      setPage((p) => p - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="border-[#C8782A]/25 text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-black disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, i) => {
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
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            page === pageNum
                              ? "bg-[#C8782A] text-white shadow-sm"
                              : "text-[#6B3A2A]/70 hover:bg-[#C8782A]/10"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage((p) => p + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="border-[#C8782A]/25 text-[#6B3A2A] hover:bg-[#C8782A]/5 hover:text-black disabled:opacity-40"
                  >
                    <ChevronRight size={15} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}