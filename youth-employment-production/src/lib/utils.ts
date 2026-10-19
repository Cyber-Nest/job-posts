import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Keeps the numeric sequence intact and ensures the prefix is 'YEC'.
 */
export function formatJobId(rawId?: string | null): string {
  if (!rawId) return "";
  const str = String(rawId).trim().replace(/^#/, "");
  const match = str.match(/^(?:[A-Z]{2,4}-)?(\d+)$/i);
  if (!match) return str;
  const digits = match[1];
  const padded = digits.length < 6 ? digits.padStart(6, "0") : digits;
  return `YEC-${padded}`;
}

/**
 * Generates a clean, keyword-rich SEO slug for a job URL.
 * Pattern: `title-company-province-mongodbId`
 * Example: `barista-starbucks-toronto-on-66348271a9b1c2d3e4f5a6b7`
 */
export function getJobSlug(job?: {
  title?: string;
  company?: string;
  location?: string;
  province?: string;
  id?: string;
  _id?: string;
} | null): string {
  if (!job) return "";
  const rawId = String(job.id || job._id || "").trim();
  if (!rawId) return "";

  const slugText = [job.title, job.company, job.province || job.location]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 65)
    .replace(/-+$/, "");

  return slugText ? `${slugText}-${rawId}` : rawId;
}

/**
 * Extracts the real backend ID from an SEO slug or raw MongoDB ID.
 * Works seamlessly with:
 * - Direct ID: "66348271a9b1c2d3e4f5a6b7" -> "66348271a9b1c2d3e4f5a6b7"
 * - SEO Slug:  "barista-starbucks-toronto-on-66348271a9b1c2d3e4f5a6b7" -> "66348271a9b1c2d3e4f5a6b7"
 */
export function extractJobId(slugOrId?: string | null): string {
  if (!slugOrId) return "";
  const str = String(slugOrId).trim();

  // If directly a 24-character hexadecimal MongoDB ObjectId
  if (/^[a-fA-F0-9]{24}$/.test(str)) {
    return str;
  }

  // If slug ends with a 24-character MongoDB ObjectId
  const hexMatch = str.match(/[a-fA-F0-9]{24}$/);
  if (hexMatch) {
    return hexMatch[0];
  }

  // Fallback: extract the part after the last hyphen if it looks like an ID
  const parts = str.split("-");
  const lastPart = parts[parts.length - 1];
  if (lastPart && (lastPart.length >= 8 || /^\d+$/.test(lastPart))) {
    return lastPart;
  }

  return str;
}

