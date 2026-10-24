import type { MetadataRoute } from "next";
import { buildJobUrl } from "@/lib/slug";

const BASE_URL = "https://getjobscanada.ca";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-posts-server.vercel.app/api/v1";

interface ApiJob {
  _id: string;
  id?: string;
  title: string;
  company: string;
  city?: string;
  province?: string;
  postDate?: string | Date;
  postedAt?: string | Date;
  updatedAt?: string | Date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Static Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/employers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/job-seekers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/post-a-job`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. High-Intent Canada Province Pages for SEO Siloing
  const provinces = [
    "Ontario",
    "British Columbia",
    "Alberta",
    "Québec",
    "Nova Scotia",
    "Manitoba",
    "Saskatchewan",
    "New Brunswick",
    "Newfoundland & Labrador",
    "Prince Edward Island",
    "Yukon",
    "Northwest Territories",
    "Nunavut",
  ];

  const provinceRoutes: MetadataRoute.Sitemap = provinces.map((province) => ({
    url: `${BASE_URL}/jobs?province=${encodeURIComponent(province)}`,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 3. Dynamic Job Posting URLs with Keyword Slugs
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BACKEND_URL}/jobs?limit=500`, {
      headers: { "X-Site-ID": "getjobscanada" },
      next: { revalidate: 3600 }, // cached for 1 hour
    });

    if (res.ok) {
      const json = await res.json();
      const jobs: ApiJob[] = json?.data || [];

      jobRoutes = jobs.map((job) => {
        const slugPath = buildJobUrl(job);
        const lastMod = job.updatedAt || job.postDate || job.postedAt;
        const lastModDate = lastMod ? new Date(lastMod) : currentDate;

        return {
          url: `${BASE_URL}${slugPath}`,
          lastModified: isNaN(lastModDate.getTime()) ? currentDate : lastModDate,
          changeFrequency: "daily",
          priority: 0.9,
        };
      });
    }
  } catch (error) {
    console.error("Failed to fetch jobs for sitemap generation:", error);
  }

  return [...staticRoutes, ...provinceRoutes, ...jobRoutes];
}
