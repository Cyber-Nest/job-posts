import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobDetailClient, { JobDetail } from "./JobDetailClient";
import { extractJobId, buildJobUrl } from "@/lib/slug";

interface PageProps {
  params: Promise<{ id: string }>;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-posts-server.vercel.app/api/v1";

/**
 * Server-side job fetcher with 60-second ISR caching.
 */
async function getJob(cleanId: string): Promise<JobDetail | null> {
  if (!cleanId) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/jobs/${cleanId}`, {
      headers: {
        "X-Site-ID": "getjobscanada",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Error fetching job on server:", err);
    return null;
  }
}

/**
 * Strips HTML tags and clean up text for meta description.
 */
function cleanText(html: string = ""): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Map Canadian employment type string to Google Schema EmploymentType enum.
 */
function getGoogleEmploymentType(type?: string): string {
  const lower = (type || "").toLowerCase();
  if (lower.includes("full")) return "FULL_TIME";
  if (lower.includes("part")) return "PART_TIME";
  if (lower.includes("contract")) return "CONTRACTOR";
  if (lower.includes("seasonal") || lower.includes("casual")) return "TEMPORARY";
  if (lower.includes("volunteer")) return "VOLUNTEER";
  return "FULL_TIME";
}

/**
 * Dynamic Metadata Generation for Google Search & AI Overviews
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cleanId = extractJobId(id);
  const job = await getJob(cleanId);

  if (!job) {
    return {
      title: "Job Not Found | GetJobsCanada",
      description: "Explore thousands of verified job opportunities across Canada.",
    };
  }

  const jobLocation = [job.city, job.province].filter(Boolean).join(", ") || job.location || "Canada";
  const title = `${job.title} at ${job.company} in ${jobLocation} | GetJobsCanada`;

  const descriptionSnippet = cleanText(job.descriptionHtml || job.requirementsHtml || "").slice(0, 140);
  const salaryText = job.salary ? ` Offering ${job.salary} CAD.` : "";
  const description = `${job.title} job at ${job.company} in ${jobLocation}.${salaryText} ${descriptionSnippet}... Apply now on GetJobsCanada.`;

  const canonicalPath = buildJobUrl(job);
  const canonicalUrl = `https://getjobscanada.ca${canonicalPath}`;

  return {
    title,
    description,
    keywords: [
      `${job.title} Canada`,
      `${job.company} careers`,
      `jobs in ${jobLocation}`,
      `${job.province} jobs`,
      `${job.category} jobs Canada`,
      "Canada job board",
      "GetJobsCanada",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "GetJobsCanada",
      locale: "en_CA",
      images: [
        {
          url: "https://getjobscanada.ca/logo.svg",
          width: 800,
          height: 600,
          alt: `${job.title} at ${job.company}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://getjobscanada.ca/logo.svg"],
    },
  };
}

/**
 * Server Component: Renders complete HTML, Schema.org JSON-LD, and passes data to client shell.
 */
export default async function JobPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = extractJobId(id);
  const job = await getJob(cleanId);

  if (!job) {
    notFound();
  }

  const jobLocation = [job.city, job.province].filter(Boolean).join(", ") || job.location || "Canada";
  const canonicalPath = buildJobUrl(job);
  const canonicalUrl = `https://getjobscanada.ca${canonicalPath}`;

  // Calculate Expiry Date for JobPosting schema
  const postDateObj = new Date(job.postDate || job.postedAt || Date.now());
  const expiryDateObj = job.expiresAt
    ? new Date(job.expiresAt)
    : new Date(postDateObj.getTime() + (parseInt(job.runDays || "30", 10) || 30) * 86400000);

  // Parse salary if numeric
  const numericSalary = parseFloat((job.salary || "").replace(/[^0-9.]/g, ""));
  const unitText = (job.salaryType || "hour").toUpperCase();

  // 1. Google for Jobs & AI Overview Structured Data (JobPosting)
  const jobPostingSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.descriptionHtml || `<p>${job.title} at ${job.company}</p>`,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.jobId || job.jobUniqueId || job._id,
    },
    datePosted: postDateObj.toISOString(),
    validThrough: expiryDateObj.toISOString(),
    employmentType: getGoogleEmploymentType(job.employmentType),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: job.website || "https://getjobscanada.ca",
      logo: "https://getjobscanada.ca/logo.svg",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.city || "Canada",
        addressLocality: job.city || "Canada",
        addressRegion: job.province || "Canada",
        addressCountry: "CA",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Canada",
    },
    directApply: true,
  };

  if (job.remote) {
    jobPostingSchema.jobLocationType = "TELECOMMUTE";
  }

  if (numericSalary && !isNaN(numericSalary)) {
    jobPostingSchema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "CAD",
      value: {
        "@type": "QuantitativeValue",
        value: numericSalary,
        unitText: unitText === "HOUR" ? "HOUR" : unitText === "YEAR" ? "YEAR" : "MONTH",
      },
    };
  }

  // 2. Breadcrumbs Schema for Google Search results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://getjobscanada.ca",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jobs in Canada",
        item: "https://getjobscanada.ca/jobs",
      },
      ...(job.province
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: `${job.province} Jobs`,
              item: `https://getjobscanada.ca/jobs?province=${encodeURIComponent(job.province)}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: job.title,
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: job.title,
              item: canonicalUrl,
            },
          ]),
    ],
  };

  return (
    <>
      {/* Official Google for Jobs Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      {/* Breadcrumb Hierarchy Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Interactive Hydrated Client Component */}
      <JobDetailClient initialJob={job} jobId={cleanId} />
    </>
  );
}
