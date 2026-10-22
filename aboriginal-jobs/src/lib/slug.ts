/**
 * Slug and URL utilities for SEO-optimized Job routes
 * Site: Aboriginal Jobs Canada
 */

export interface JobSlugInput {
  _id?: string;
  id?: string;
  title?: string;
  city?: string;
  province?: string;
  company?: string;
}

/**
 * Creates an SEO-optimized slug including Title, Location, and unique ID.
 * Example:
 * Title: "User Support Technician"
 * City: "Winnipeg"
 * Province: "Manitoba"
 * ID: "6ad0bb023144656508a887c2"
 * Result: "user-support-technician-winnipeg-manitoba-6ad0bb023144656508a887c2"
 */
export function createJobSlug(job: JobSlugInput): string {
  if (!job) return "";
  const rawId = job._id || job.id || "";

  const parts: string[] = [];
  if (job.title) parts.push(job.title);
  if (job.city) parts.push(job.city);
  if (job.province && job.province.toLowerCase() !== (job.city || "").toLowerCase()) {
    parts.push(job.province);
  }

  const cleanText = parts
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, ""); // trim hyphens

  if (!cleanText) return rawId;
  if (!rawId) return cleanText;

  return `${cleanText}-${rawId}`;
}

/**
 * Extracts the real database / backend ID from any slug or raw ID.
 * Handles:
 * - Raw MongoDB ID: "6ad0bb023144656508a887c2"
 * - Full slug: "user-support-technician-winnipeg-manitoba-6ad0bb023144656508a887c2"
 * - Mock IDs: "community-health-worker-maskwacis-j001" or "j001"
 */
export function extractJobId(slugOrId: string): string {
  if (!slugOrId) return "";
  const raw = decodeURIComponent(slugOrId).trim();

  // 1. Exact 24-character hexadecimal MongoDB ObjectId
  if (/^[a-f\d]{24}$/i.test(raw)) {
    return raw;
  }

  // 2. Slug ending with a 24-character hexadecimal MongoDB ObjectId
  const mongoMatch = raw.match(/-([a-f\d]{24})$/i);
  if (mongoMatch) {
    return mongoMatch[1];
  }

  // 3. Slug ending with mock ID like -j001
  const mockMatch = raw.match(/-(j\d{3,})$/i);
  if (mockMatch) {
    return mockMatch[1];
  }

  // 4. Exact mock ID like "j001"
  if (/^j\d{3,}$/i.test(raw)) {
    return raw;
  }

  // 5. Fallback: Last segment separated by hyphen if alphanumeric >= 4
  const segments = raw.split("-");
  const last = segments[segments.length - 1];
  if (last && (last.length >= 4 || /^\d+$/.test(last))) {
    return last;
  }

  return raw;
}

/**
 * Returns full path to the job: /jobs/[slug]
 */
export function getJobUrl(job: JobSlugInput): string {
  const slug = createJobSlug(job);
  return `/jobs/${slug}`;
}
