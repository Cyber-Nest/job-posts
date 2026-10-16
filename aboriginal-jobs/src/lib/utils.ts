import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Keeps the numeric sequence intact and ensures the prefix is 'ABJ'.
 */
export function formatJobId(rawId?: string | null): string {
  if (!rawId) return "";
  const str = String(rawId).trim().replace(/^#/, "");
  const match = str.match(/^(?:[A-Z]{2,4}-)?(\d+)$/i);
  if (!match) return str;
  const digits = match[1];
  const padded = digits.length < 6 ? digits.padStart(6, "0") : digits;
  return `ABJ-${padded}`;
}
