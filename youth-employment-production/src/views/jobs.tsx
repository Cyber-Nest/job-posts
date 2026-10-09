import { useState, useMemo, useEffect } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Link, useSearchParams } from "@/router";
import { motion, AnimatePresence } from "motion/react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ── Constants ──────────────────────────────────────────────────────── */
const PAGE_SIZE = 8;

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
  "Restaurant and Food Service",
  "Sales & Customer Service",
  "Science & Research",
  "Security & Law Enforcement",
  "Transportation & Logistics",
];

const ALL_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Casual / Seasonal",
  "Volunteer",
];

interface Job {
  createdAt: string;
  id: string;
  jobUniqueId: string;
  title: string;
  company: string;
  location: string;
  province: string;
  employmentType: string;
  category: string;
  salary?: string;
  salaryPeriod?: string;
  description: string;
  featured?: boolean;
  remote?: boolean;
  indigenous?: boolean;
  postedAt: string;
  postedDaysAgo: number;
}

interface JobFilters {
  query: string;
  location: string;
  province: string;
  category: string;
  type: string;
  remote: boolean;
  indigenous: boolean;
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

/* ── Skeleton Card ──────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="w-11 h-11 rounded-xl bg-gray-200" />
      <div className="flex gap-1.5">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-14 bg-gray-200 rounded-full" />
      </div>
    </div>
    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
    <div className="flex gap-4 mb-4">
      <div className="h-3 w-20 bg-gray-200 rounded" />
      <div className="h-3 w-16 bg-gray-200 rounded" />
      <div className="h-3 w-14 bg-gray-200 rounded" />
    </div>
    <div className="flex justify-between pt-3 border-t border-gray-100">
      <div className="h-3 w-20 bg-gray-200 rounded" />
      <div className="h-3 w-16 bg-gray-200 rounded" />
    </div>
  </div>
);

/* ── Helper Functions ───────────────────────────────────────────────── */
function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    // Search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesQuery =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query);
      if (!matchesQuery) return false;
    }

    // Province
    if (filters.province && job.province !== filters.province) return false;

    // Category
    if (filters.category && job.category !== filters.category) return false;

    // Employment type
    if (filters.type && job.employmentType !== filters.type) return false;

    // Remote
    if (filters.remote && !job.remote) return false;

    // Indigenous
    if (filters.indigenous && !job.indigenous) return false;

    return true;
  });
}


/* ── Job card ───────────────────────────────────────────────────────── */
function JobCard({ job }: { job: Job }) {
  return (
    <motion.div variants={fadeUp}>
      <Link
        to={`/jobs/${job.id}`}
        className="group block bg-white rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 p-5"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-blue-600" />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {job.featured && (
              <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-semibold">
                Featured
              </span>
            )}
            {job.remote && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                <Wifi size={10} /> Remote
              </span>
            )}
            {job.indigenous && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                <Leaf size={10} /> Indigenous
              </span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-0.5 group-hover:text-blue-600 transition-colors duration-200">
          {job.title}
        </h3>
        <p className="text-sm text-blue-600 font-semibold mb-3">
          {job.company}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={11} className="text-blue-500" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={11} className="text-blue-500" />
            {job.employmentType}
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <DollarSign size={11} className="text-blue-500" />{job.salary}
              {job.salaryPeriod ? ` / ${job.salaryPeriod}` : ""}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-blue-100">
          {/* <span className="text-xs text-gray-400">
            Posted on{" "}
            {new Date(job.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span> */}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all duration-200">
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
    <span className="inline-flex items-center gap-1.5 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-blue-500 hover:text-blue-700 transition-colors"
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
        className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-8"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function JobsPage() {
  const [filters, setFilters] = useState<JobFilters>({
    query: "",
    location: "",
    province: "",
    category: "",
    type: "",
    remote: false,
    indigenous: false,
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("search")?.trim() ?? "";
  const locationParam = searchParams.get("location")?.trim() ?? "";

  useEffect(() => {
    const matchedProvince = ALL_PROVINCES.find(
      (province) => province.toLowerCase() === locationParam.toLowerCase(),
    );
    const province = matchedProvince || "";
    const location = matchedProvince ? "" : locationParam;

    setFilters((prev) => {
      if (
        prev.query === queryParam &&
        prev.province === province &&
        prev.location === location
      ) {
        return prev;
      }
      return { ...prev, query: queryParam, province, location };
    });
  }, [queryParam, locationParam]);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      setFetchError("");
      try {
        const response = await fetch("/api/jobs");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load jobs.");
        }
        if (!Array.isArray(data.jobs)) {
          throw new Error("Unexpected jobs response from server.");
        }
        setJobs(data.jobs);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Unable to load jobs.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const set = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearAll = () => {
    setFilters({
      query: "",
      location: "",
      province: "",
      category: "",
      type: "",
      remote: false,
      indigenous: false,
    });
    setPage(1);
  };

  const filtered = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);
  const featured = useMemo(() => jobs.filter((j) => j.featured), [jobs]);
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
      <Helmet>
        <title>Browse Jobs — Youth Employment Canada</title>
        <meta
          name="description"
          content="Browse hundreds of job opportunities for youth job seekers across Canada."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-14 lg:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Job Board
            </p>
            <h1
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Find Your Next Opportunity
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Explore jobs from employers and organizations across every
              province and territory in Canada.
            </p>

            <div className="flex gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="search"
                  value={filters.query}
                  onChange={(e) => set("query", e.target.value)}
                  placeholder="Job title, company, or keyword…"
                  className="pl-10 border-blue-200 focus-visible:ring-blue-300 bg-white h-12 text-sm"
                />
              </div>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 px-6 shadow-sm"
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
              { value: `${jobs.length}`, label: "Active Listings" },
              // {
              //   value: `${jobs.filter((j) => j.indigenous).length}`,
              //   label: "Indigenous Employers",
              // },
              {
                value: `${jobs.filter((j) => j.remote).length}`,
                label: "Remote Roles",
              },
              {
                value: `${new Set(jobs.map((j) => j.province)).size}`,
                label: "Provinces & Territories",
              },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-bold text-blue-600"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {value}
                </span>
                <span className="text-sm text-gray-500">{label}</span>
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
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-sm">
                    Filter Jobs
                  </h2>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs text-blue-600 hover:underline font-medium"
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
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-gray-600 font-medium">
                        Remote / Hybrid only
                      </span>
                    </label>
                    {/* <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.indigenous}
                        onChange={(e) => set("indigenous", e.target.checked)}
                        className="w-4 h-4 accent-emerald-600"
                      />
                      <span className="text-sm text-gray-600 font-medium">
                        Indigenous Employers only
                      </span>
                    </label> */}
                  </div>
                </div>
              </div>

              {/* Post a job CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
                <h3
                  className="font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Hiring Young Talent?
                </h3>
                <p className="text-blue-100 text-xs leading-relaxed mb-4">
                  Post your job and reach thousands of qualified Youth across
                  Canada.
                </p>
                <Link to="/post-a-job">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-700 w-full text-sm font-semibold"
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
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">
                    {filtered.length}
                  </span>{" "}
                  jobs found
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters((v) => !v)}
                  className="border-blue-200 text-gray-600 hover:bg-blue-50 gap-2"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
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
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex flex-col gap-4">
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
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-600 font-medium">
                            Remote / Hybrid only
                          </span>
                        </label>
                        {/* <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.indigenous}
                            onChange={(e) =>
                              set("indigenous", e.target.checked)
                            }
                            className="w-4 h-4 accent-emerald-600"
                          />
                          <span className="text-sm text-gray-600 font-medium">
                            Indigenous Employers only
                          </span>
                        </label> */}
                      </div>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-xs text-blue-600 hover:underline font-medium text-left"
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
                <p className="hidden lg:block text-sm text-gray-500">
                  <span className="font-bold text-gray-900">
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
                    label="Indigenous"
                    onRemove={() => set("indigenous", false)}
                  />
                )}
              </div>

              {/* Featured strip */}
              {page === 1 && !hasActiveFilters && featured.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                    Featured Listings
                  </p>
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {featured.slice(0, 3).map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </motion.div>
                  <div className="my-8 border-t border-blue-100" />
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                    All Listings
                  </p>
                </div>
              )}

              {/* Job grid with Skeleton */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : fetchError ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Search size={24} className="text-blue-400" />
                  </div>
                  <h3
                    className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Unable to load jobs
                  </h3>
                  <p className="text-gray-500 text-sm mb-5 max-w-xs">
                    {fetchError}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
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
                    <JobCard key={job.id} job={job} />
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Search size={24} className="text-blue-400" />
                  </div>
                  <h3
                    className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {jobs.length === 0 ? "No jobs posted yet" : "No jobs found"}
                  </h3>
                  <p className="text-gray-500 text-sm mb-5 max-w-xs">
                    {jobs.length === 0
                      ? "Please check back soon."
                      : "Try adjusting your search terms or removing some filters."}
                  </p>
                  {jobs.length !== 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearAll}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
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
                    className="border-blue-200 text-gray-600 hover:bg-blue-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 7) }).map(
                    (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (page <= 4) {
                        pageNum = i + 1;
                        if (i === 6) pageNum = totalPages;
                      } else if (page >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = page - 3 + i;
                      }
                      if (pageNum > totalPages) return null;
                      if (
                        i === 5 &&
                        totalPages > 7 &&
                        page < totalPages - 3 &&
                        page > 4
                      ) {
                        return (
                          <span key="dots" className="text-gray-400">
                            ...
                          </span>
                        );
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
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-600 hover:bg-blue-50"
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
                    className="border-blue-200 text-gray-600 hover:bg-blue-50 disabled:opacity-40"
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
