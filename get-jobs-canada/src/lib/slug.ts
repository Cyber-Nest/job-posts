/**
 * SEO URL Slug Utilities for GetJobsCanada
 * Enables high-ranking keywords in job detail URLs while preserving MongoDB ObjectId lookup
 * Example output: /jobs/senior-software-engineer-shopify-toronto-on-674f9810a9c1e40012ab34cd
 */

export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace accented characters (e.g., Québec -> quebec)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace non-alphanumeric with hyphen
    .replace(/[^a-z0-9]+/g, "-")
    // Remove duplicate hyphens
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}

interface JobSlugInput {
  _id?: string;
  id?: string;
  jobId?: string;
  title?: string;
  company?: string;
  city?: string;
  province?: string;
}

/**
 * Builds an SEO-optimized slug string combining Title, Company, City, and Province.
 */
export function buildJobSlug(job: JobSlugInput): string {
  const parts = [
    job.title,
    job.company,
    job.city,
    job.province,
  ].filter(Boolean);

  const rawSlug = parts.join(" ");
  return slugify(rawSlug).slice(0, 100); // cap length to 100 chars for clean URLs
}

/**
 * Builds the full frontend URL for a job.
 * Format: /jobs/[keyword-slug]-[mongoId]
 * Fallback: /jobs/[mongoId]
 */
export function buildJobUrl(job: JobSlugInput): string {
  const cleanId = job._id || job.id || job.jobId || "";
  if (!cleanId) return "/jobs";

  const slug = buildJobSlug(job);
  if (!slug) return `/jobs/${cleanId}`;

  return `/jobs/${slug}-${cleanId}`;
}

/**
 * Extracts the raw MongoDB ObjectId or Job ID from a route parameter.
 * Supports:
 * - /jobs/674f9810a9c1e40012ab34cd (direct ID)
 * - /jobs/senior-developer-toronto-674f9810a9c1e40012ab34cd (slug-ID)
 * - /jobs/GJC-000123 / /jobs/slug-GJC-000123
 */
export function extractJobId(param: string): string {
  if (!param) return "";
  const decoded = decodeURIComponent(param).trim();

  // 1. Check for 24-character hexadecimal MongoDB ObjectId at the end of the string
  const mongoMatch = decoded.match(/[a-f0-9]{24}$/i);
  if (mongoMatch) {
    return mongoMatch[0];
  }

  // 2. Check for GJC Job ID pattern (e.g. GJC-000123 or digits at end)
  const gjcMatch = decoded.match(/(?:GJC-)?\d+$/i);
  if (gjcMatch) {
    return gjcMatch[0];
  }

  // 3. Fallback: split by '-' and take the last piece if it looks like an identifier
  const parts = decoded.split("-");
  const lastPart = parts[parts.length - 1];
  if (lastPart && lastPart.length >= 6) {
    return lastPart;
  }

  return decoded;
}
