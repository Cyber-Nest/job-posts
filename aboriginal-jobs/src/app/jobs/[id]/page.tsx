import { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchServerJobById } from "@/lib/server-jobs";
import { extractJobId, createJobSlug, getJobUrl } from "@/lib/slug";
import JobDetailClient from "@/components/JobDetailClient";
import JobPostingSchema from "@/components/seo/JobPostingSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JobAiSummary from "@/components/seo/JobAiSummary";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const actualId = extractJobId(id);
  const job = await fetchServerJobById(actualId);

  if (!job) {
    return {
      title: "Job Opportunity | Aboriginal Jobs Canada",
      description:
        "Explore inclusive Indigenous and Aboriginal employment opportunities across Canada.",
    };
  }

  const locationStr =
    job.location || [job.city, job.province].filter(Boolean).join(", ") || "Canada";
  const title = `${job.title} — ${job.company} (${locationStr})`;
  const salarySnippet = job.salary ? `Salary: ${job.salary} CAD. ` : "";
  const description = `Apply for ${job.title} at ${job.company} in ${locationStr}. ${salarySnippet}Discover inclusive First Nations, Métis, and Inuit careers across Canada.`;
  const slug = createJobSlug(job);
  const canonicalUrl = `https://aboriginal-jobs.ca/jobs/${slug || id}`;
  const ogImage = job.companyLogo || "/og-image.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_CA",
      url: canonicalUrl,
      title: `${title} | Aboriginal Jobs Canada`,
      description,
      siteName: "Aboriginal Jobs Canada",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${job.title} at ${job.company}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Aboriginal Jobs Canada`,
      description,
      images: [ogImage],
    },
    keywords: [
      `${job.title} jobs`,
      `${job.company} careers`,
      `Indigenous jobs ${job.province || "Canada"}`,
      `First Nations jobs ${job.city || ""}`,
      job.category || "Indigenous careers",
      "Aboriginal Jobs Canada",
    ],
  };
}

export default async function JobPage({ params }: PageProps) {
  const { id } = await params;
  const actualId = extractJobId(id);
  const job = await fetchServerJobById(actualId);

  // If user accesses raw ID or outdated slug, permanently redirect to current SEO slug
  if (job) {
    const canonicalSlug = createJobSlug(job);
    if (canonicalSlug && id !== canonicalSlug) {
      redirect(`/jobs/${canonicalSlug}`);
    }
  }

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Jobs", url: "/jobs" },
  ];

  if (job?.province) {
    breadcrumbs.push({
      name: job.province,
      url: `/jobs?province=${encodeURIComponent(job.province)}`,
    });
  }

  if (job?.title) {
    breadcrumbs.push({
      name: job.title,
      url: job ? getJobUrl(job) : `/jobs/${id}`,
    });
  }

  return (
    <>
      {job && <JobPostingSchema job={job} />}
      <BreadcrumbSchema items={breadcrumbs} />
      {job && <JobAiSummary job={job} />}
      <JobDetailClient initialJob={job} id={actualId} />
    </>
  );
}
