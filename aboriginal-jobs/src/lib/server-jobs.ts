import { JOBS, Job, getJobById } from "./jobs-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-posts-server.vercel.app/api/v1";

export interface NormalizedJob {
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
  salaryType?: "hour" | "week" | "month" | "year" | string;
  employmentType: string;
  vacancies?: number;
  category: string;
  nocCode?: string;
  runDays?: string;
  experience?: string;
  startDate?: string;
  descriptionHtml?: string;
  description?: string;
  requirementsHtml?: string;
  contactEmail?: string;
  website?: string;
  companyLogo?: string;
  indigenousOwned: boolean;
  remote: boolean;
  status?: string;
  featured?: boolean;
  postedAt: string | Date;
  expiresAt?: string | Date;
  indigenousPreference?: boolean;
  applyMethods?: any[];
}

export async function fetchServerJobById(id: string): Promise<NormalizedJob | null> {
  if (!id) return null;

  // 1. Try to fetch from Express Central Backend with a safe 3s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      headers: {
        "X-Site-ID": "aboriginal",
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache on server for 60 seconds
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const jobData = json?.data || json?.job || json;
      if (jobData && jobData.title) {
        return {
          ...jobData,
          _id: jobData._id || id,
          location: jobData.location || [jobData.city, jobData.province].filter(Boolean).join(", "),
        };
      }
    }
  } catch (err) {
    // Backend unreachable or timeout - fallback to local data
  }

  // 2. Fallback to sample data from jobs-data.ts
  const localJob = getJobById(id);
  if (localJob) {
    return transformLocalJob(localJob);
  }

  // Check if ID matches without prefixes
  const foundInList = JOBS.find(
    (j) => j.id.toLowerCase() === id.toLowerCase() || j.title.toLowerCase().includes(id.toLowerCase())
  );
  if (foundInList) {
    return transformLocalJob(foundInList);
  }

  return null;
}

export async function fetchServerActiveJobs(limit = 100): Promise<NormalizedJob[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/jobs?limit=${limit}&status=active`, {
      headers: {
        "X-Site-ID": "aboriginal",
      },
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.jobs || json?.jobs || json?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((j: any) => ({
          ...j,
          _id: j._id || j.id,
          location: j.location || [j.city, j.province].filter(Boolean).join(", "),
        }));
      }
    }
  } catch (err) {
    // Fallback to local list
  }

  return JOBS.map(transformLocalJob);
}

function transformLocalJob(j: Job): NormalizedJob {
  return {
    _id: j.id,
    id: j.id,
    title: j.title,
    company: j.company,
    city: j.location,
    province: j.province,
    location: `${j.location}, ${j.province}`,
    salary: j.salary,
    employmentType: j.employmentType,
    category: j.category,
    description: j.description,
    descriptionHtml: `<p>${j.description}</p>`,
    contactEmail: j.applyEmail,
    website: j.website,
    indigenousOwned: j.indigenous,
    remote: j.remote,
    featured: j.featured,
    postedAt: new Date(Date.now() - (j.postedDaysAgo || 1) * 86400000).toISOString(),
    expiresAt: j.closingDate,
  };
}
