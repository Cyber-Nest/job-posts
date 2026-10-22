import { MetadataRoute } from "next";
import { fetchServerActiveJobs } from "@/lib/server-jobs";
import { createJobSlug } from "@/lib/slug";

export const revalidate = 3600; // revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aboriginal-jobs.ca";
  const now = new Date();

  // 1. Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/post-a-job`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/employers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/job-seekers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Programmatic Province / Territory landing pages
  const provinces = [
    "british-columbia",
    "ontario",
    "alberta",
    "saskatchewan",
    "manitoba",
    "quebec",
    "nova-scotia",
    "new-brunswick",
    "newfoundland-and-labrador",
    "northwest-territories",
    "yukon",
    "nunavut",
  ];

  const provinceRoutes: MetadataRoute.Sitemap = provinces.map((slug) => ({
    url: `${baseUrl}/jobs/in/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 3. Community & Work Type landing pages
  const communityRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/jobs/remote`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ];

  // 4. Dynamic Job Postings
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const jobs = await fetchServerActiveJobs(500);
    jobRoutes = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${createJobSlug(job) || job._id}`,
      lastModified: job.postedAt ? new Date(job.postedAt) : now,
      changeFrequency: "daily",
      priority: job.featured ? 0.9 : 0.75,
    }));
  } catch (err) {
    console.error("Error generating sitemap dynamic jobs:", err);
  }

  return [...staticRoutes, ...provinceRoutes, ...communityRoutes, ...jobRoutes];
}
