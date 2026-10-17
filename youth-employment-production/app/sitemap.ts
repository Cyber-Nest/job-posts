import type { MetadataRoute } from 'next';

const BASE_URL = 'https://youthemployment.ca';
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://job-posts-server.vercel.app/api/v1';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/employers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/job-seekers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    const res = await fetch(`${BACKEND_URL}/jobs`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const jobsList = data.data || data.jobs || [];

      const dynamicJobRoutes: MetadataRoute.Sitemap = jobsList
        .filter((job: any) => job && job.id)
        .map((job: any) => ({
          url: `${BASE_URL}/jobs/${job.id}`,
          lastModified: job.updatedAt
            ? new Date(job.updatedAt)
            : job.createdAt
            ? new Date(job.createdAt)
            : new Date(),
          changeFrequency: 'daily',
          priority: 0.85,
        }));

      return [...staticRoutes, ...dynamicJobRoutes];
    }
  } catch {
    // If backend fails during static build, return static routes
  }

  return staticRoutes;
}
