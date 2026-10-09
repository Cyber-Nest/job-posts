import { useState, useEffect } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Link, useParams } from "@/router";
import { motion } from "motion/react";
import {
  MapPin,
  DollarSign,
  Building2,
  ChevronRight,
  Wifi,
  Leaf,
  CheckCircle,
  ArrowLeft,
  Share2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/jobs-data";

/* ── Animations ─────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

function normalizeListField(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item));
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

/* ── Related job card ───────────────────────────────────────────────── */
function RelatedCard({ job }: { job: Job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex gap-3 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
    >
      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
        <Building2 size={14} className="text-blue-600" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-snug truncate">
          {job.title}
        </p>
        <p className="text-xs text-blue-600 font-medium truncate">
          {job.company}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{job.location}</p>
      </div>
      <ChevronRight
        size={14}
        className="text-blue-400 flex-shrink-0 self-center ml-auto group-hover:translate-x-0.5 transition-transform"
      />
    </Link>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const jobId = id;
    if (!jobId) {
      setLoading(false);
      setJob(null);
      return;
    }

    async function loadJob() {
      setLoading(true);
      setFetchError("");
      try {
        const response = await fetch(
          `/api/jobs?id=${encodeURIComponent(jobId!)}`,
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Job not found.");
        }
        setJob(data.job);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Unable to load job.",
        );
        setJob(null);
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const related: Job[] = [];
  const responsibilities = normalizeListField(job?.responsibilities);
  const qualifications = normalizeListField(job?.qualifications);
  const preferred = normalizeListField(job?.preferred);
  const benefits = normalizeListField(job?.benefits);

  const howToApply = job?.howToApply ?? null;
  const hasHowToApply = Boolean(
    howToApply &&
    (howToApply.byEmail ||
      howToApply.byMail ||
      howToApply.byPhone ||
      howToApply.inPerson),
  );

  function formatJobDate(dateValue?: string | Date, locale: string = "en-CA") {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    let isUtcDateOnly = false;
    if (typeof dateValue === "string") {
      isUtcDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateValue) ||
        dateValue.endsWith("T00:00:00.000Z") ||
        dateValue.endsWith("T00:00:00Z");
    } else if (dateValue instanceof Date) {
      isUtcDateOnly = dateValue.getUTCHours() === 0 &&
        dateValue.getUTCMinutes() === 0 &&
        dateValue.getUTCSeconds() === 0 &&
        dateValue.getUTCMilliseconds() === 0;
    }

    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: isUtcDateOnly ? "UTC" : "America/Edmonton",
    });
  }

  // Add this Skeleton component
  const JobDetailSkeleton = () => (
    <div className="bg-blue-50 min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-3 w-12 bg-gray-200 rounded" />
            <div className="h-3 w-3 bg-gray-200 rounded" />
            <div className="h-3 w-10 bg-gray-200 rounded" />
            <div className="h-3 w-3 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Back link */}
            <div className="h-4 w-28 bg-gray-200 rounded mb-6" />

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>

            {/* Title */}
            <div className="h-12 w-3/4 bg-gray-200 rounded mb-3" />

            {/* Company */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-5" />

            {/* Meta chips */}
            <div className="flex flex-wrap gap-3">
              <div className="h-8 w-36 bg-gray-200 rounded-full" />
              <div className="h-8 w-28 bg-gray-200 rounded-full" />
              <div className="h-8 w-32 bg-gray-200 rounded-full" />
              <div className="h-8 w-24 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="bg-white py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            <div className="animate-pulse space-y-6">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-11/12 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-10/12 bg-gray-200 rounded" />
              <div className="h-32 w-full bg-gray-200 rounded-xl" />
              <div className="h-40 w-full bg-gray-200 rounded-xl" />
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-48 w-full bg-gray-200 rounded-2xl" />
              <div className="h-64 w-full bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Job — Youth Employment Canada</title>
        </Helmet>
        <JobDetailSkeleton />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Helmet>
          <title>Job Not Found — Youth Employment Canada</title>
        </Helmet>
        <section className="bg-blue-50 min-h-[60vh] flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={28} className="text-blue-600" />
            </div>
            <h1
              className="text-3xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Job Not Found
            </h1>
            <p className="text-gray-500 mb-7">
              {fetchError ||
                "This listing may have expired or been removed. Browse our current openings below."}
            </p>
            <Link to="/jobs">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
                Browse All Jobs
              </Button>
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {job.title} at {job.company} — Youth Employment Canada
        </title>
        <meta
          name="description"
          content={`${job.title} at ${job.company} in ${job.location}. ${job.employmentType} · ${job.salary}. Apply on Youth Employment Canada.`}
        />
      </Helmet>

      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/jobs" className="hover:text-blue-600 transition-colors">
              Jobs
            </Link>
            <ChevronRight size={12} />
            <span className="text-blue-600 font-medium truncate max-w-[200px]">
              {job.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Hero banner ─────────────────────────────────────────── */}
      <section className="bg-blue-50 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Back link */}
            <motion.div variants={fadeUp}>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
                Back to all jobs
              </Link>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                {/* Badges */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {job.featured && (
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                      Featured
                    </span>
                  )}
                  {job.remote && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      <Wifi size={11} /> Remote / Hybrid
                    </span>
                  )}
                  {job.indigenous && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                      <Leaf size={11} /> Indigenous Employer
                    </span>
                  )}
                  <span className="text-xs bg-white border border-blue-200 text-gray-500 px-3 py-1 rounded-full">
                    {job.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={fadeUp}
                  className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {job.title}
                </motion.h1>

                {/* Company */}
                <motion.p
                  variants={fadeUp}
                  className="text-blue-600 font-bold text-lg mb-5"
                >
                  {job.company}
                </motion.p>

                {/* Meta chips */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white border border-blue-200 rounded-full px-4 py-1.5">
                    <MapPin size={13} className="text-blue-500" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white border border-blue-200 rounded-full px-4 py-1.5">
                    <Clock size={13} className="text-blue-500" />
                    {`Posted on ${formatJobDate(job.jobPostingDate)}`}
                  </span>
                  {job.jobUniqueId && (
                    <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white border border-blue-200 rounded-full px-4 py-1.5">
                      <CheckCircle size={13} className="text-blue-500" />
                      Job ID: {job.jobUniqueId}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white border border-blue-200 rounded-full px-4 py-1.5">
                    <DollarSign size={13} className="text-blue-500" />
                    {job.salary}/{job.salaryPeriod as any}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white border border-blue-200 rounded-full px-4 py-1.5">
                    <Clock size={13} className="text-blue-500" />
                    Closes on {formatJobDate(job.expiresAt)}
                  </span>
                </motion.div>
              </div>

              {/* Desktop CTA */}
              <motion.div
                variants={fadeUp}
                className="hidden lg:flex flex-col gap-3 flex-shrink-0 w-52"
              >
                <div className="flex gap-2">
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSaved((v) => !v)}
                    className={`flex-1 border-blue-300 transition-all duration-200 ${saved ? "bg-blue-100 text-blue-600 border-blue-400" : "text-gray-600 hover:bg-blue-50"}`}
                  >
                    {saved ? (
                      <BookmarkCheck size={14} className="mr-1.5" />
                    ) : (
                      <Bookmark size={14} className="mr-1.5" />
                    )}
                    {saved ? "Saved" : "Save"}
                  </Button> */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex-1 border-blue-300 text-gray-600 hover:bg-blue-100"
                  >
                    <Share2 size={14} className="mr-1.5" />
                    {copied ? "Copied!" : "Share"}
                  </Button>
                </div>
                {/* <p className="text-xs text-gray-400 text-center">
                  Posted {postedLabel(job.postedDaysAgo)}
                </p> */}
                {/* <p className="text-xs text-gray-400 text-center">
                  Posted{" "}
                  {job.postedDaysAgo === 0
                    ? "Today"
                    : job.postedDaysAgo === 1
                      ? "Yesterday"
                      : `${job.postedDaysAgo} days ago`}
                  (
                  {new Date(job.postedAt).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  )
                </p> */}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────────────── */}
      <section className="bg-white py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
            {/* ── Left: Job content ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              {/* About the role - FIXED: HTML rendering */}
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  About the Role
                </h2>
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-1 [&_p]:mb-3"
                  dangerouslySetInnerHTML={{
                    __html: job.description || job.descriptionHtml || "",
                  }}
                />
              </div>

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <div>
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Key Responsibilities
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {responsibilities.map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={11} className="text-blue-600" />
                        </div>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qualifications */}
              {qualifications.length > 0 && (
                <div>
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Required Qualifications
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {qualifications.map((q) => (
                      <li
                        key={q}
                        className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed"
                      >
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={11} className="text-gray-500" />
                        </div>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Job Criteria Section - FIXED: shows requirementsHtml */}
              {(job.startDate ||
                job.positionType ||
                job.experience ||
                job.education ||
                job.travel ||
                job.vacation ||
                job.jobPostingDate ||
                job.nocCode ||
                job.requirementsHtml) && (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Job Criteria
                  </h2>

                  {/* Requirements HTML - FIXED */}
                  {job.requirementsHtml &&
                    job.requirementsHtml !== "<p><br></p>" && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Qualifications & Requirements
                        </p>
                        <div
                          className="text-sm text-gray-700 leading-relaxed prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
                          dangerouslySetInnerHTML={{
                            __html: job.requirementsHtml,
                          }}
                        />
                      </div>
                    )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    {job.startDate && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Start Date
                        </p>
                        <p>{job.startDate}</p>
                      </div>
                    )}
                    {job.vacancies != null && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Vacancies
                        </p>
                        <p>{job.vacancies}</p>
                      </div>
                    )}
                    {job.positionType && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Position Type
                        </p>
                        <p>{job.positionType}</p>
                      </div>
                    )}
                    {job.experience && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Experience
                        </p>
                        <p>{job.experience}</p>
                      </div>
                    )}
                    {job.education && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Education
                        </p>
                        <p>{job.education}</p>
                      </div>
                    )}
                    {job.travel && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Travel
                        </p>
                        <p>{job.travel}</p>
                      </div>
                    )}
                    {job.vacation && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Vacation
                        </p>
                        <p>{job.vacation}</p>
                      </div>
                    )}
                    {/* {job.jobPostingDate && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Posting Date
                        </p>
                        <p>{formatJobDate(job.jobPostingDate)}</p>
                      </div>
                    )} */}
                    {job.nocCode && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          NOC Code
                        </p>
                        <p>{job.nocCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* How to Apply */}
              {hasHowToApply && (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    How to Apply
                  </h2>
                  <p className="text-gray-500 text-sm mb-4">
                    Please apply directly using the method provided by the
                    employer. Youth Employment Canada does not collect or manage
                    job applications.
                  </p>
                  <div className="flex flex-col gap-4 text-sm text-gray-700">
                    {howToApply?.byEmail && howToApply.email && (
                      <div className="rounded-2xl bg-white border border-blue-200 p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          By E-mail
                        </p>
                        <p className="text-blue-600 break-words">
                          {howToApply.email}
                        </p>
                      </div>
                    )}
                    {howToApply?.byMail && howToApply.mailingAddress && (
                      <div className="rounded-2xl bg-white border border-blue-200 p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          By Mail
                        </p>
                        <p className="text-gray-700 break-words">
                          {howToApply.mailingAddress}
                        </p>
                      </div>
                    )}
                    {howToApply?.byPhone && howToApply.phone && (
                      <div className="rounded-2xl bg-white border border-blue-200 p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          By Phone
                        </p>
                        <p className="text-gray-700 break-words">
                          {howToApply.phone}
                        </p>
                      </div>
                    )}
                    {howToApply?.inPerson && howToApply.inPersonAddress && (
                      <div className="rounded-2xl bg-white border border-blue-200 p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          In Person
                        </p>
                        <p className="text-gray-700 break-words mb-2">
                          {howToApply.inPersonAddress}
                        </p>
                        <p className="text-gray-500">
                          Time: {howToApply.inPersonFromTime} to{" "}
                          {howToApply.inPersonToTime}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(job.contactName || job.contactType || job.contactCompany) && (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                    {job.contactName && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Contact Name
                        </p>
                        <p>{job.contactName}</p>
                      </div>
                    )}
                    {job.contactType && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Contact Type
                        </p>
                        <p>{job.contactType}</p>
                      </div>
                    )}
                    {job.contactCompany && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Company
                        </p>
                        <p>{job.contactCompany}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Preferred */}
              {preferred.length > 0 && (
                <div>
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Preferred Qualifications
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {preferred.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={11} className="text-blue-600" />
                        </div>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    What We Offer
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefits.map((b) => (
                      <div
                        key={b}
                        className="flex items-center gap-2.5 text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile CTA */}
              <div className="flex flex-col gap-3 lg:hidden">
                <div className="flex gap-3">
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSaved((v) => !v)}
                    className={`flex-1 border-blue-300 ${saved ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                  >
                    {saved ? (
                      <BookmarkCheck size={15} className="mr-2" />
                    ) : (
                      <Bookmark size={15} className="mr-2" />
                    )}
                    {saved ? "Saved" : "Save Job"}
                  </Button> */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 border-blue-300 text-gray-600"
                  >
                    <Share2 size={15} className="mr-2" />
                    {copied ? "Copied!" : "Share"}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Sidebar ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="flex flex-col gap-5 lg:sticky lg:top-24"
            >
              {/* About the employer */}
              <div className="bg-white rounded-2xl p-6 border border-blue-200">
                <h3
                  className="font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  About the Employer
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <Building2 size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {job.company}
                    </p>
                    <p className="text-xs text-gray-400">{job.location}</p>
                  </div>
                </div>
                {job.indigenous && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                    <Leaf size={12} />
                    Indigenous-owned organization
                  </div>
                )}
              </div>

              {/* Related jobs */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-blue-200">
                  <h3
                    className="font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Similar Jobs
                  </h3>
                  <div className="flex flex-col gap-2">
                    {related.map((rj) => (
                      <RelatedCard key={rj.id} job={rj} />
                    ))}
                  </div>
                  <Link
                    to={`/jobs?category=${encodeURIComponent(job.category)}`}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-4 hover:gap-2.5 transition-all duration-200"
                  >
                    More {job.category} jobs <ChevronRight size={12} />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
