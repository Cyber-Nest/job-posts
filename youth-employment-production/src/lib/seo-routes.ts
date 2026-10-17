/**
 * Agent-editable registry of publicly-crawlable routes. Consumed by the
 * /sitemap.xml handler in src/server/entry.ts.
 *
 * Guidelines for maintaining this file:
 * - Add a new entry whenever you add a new publicly-crawlable page.
 * - Do not include dynamic-param routes like "/products/:id" directly.
 *   Instead, enumerate real values (e.g. "/products/desk-pro") or skip.
 * - `path` MUST start with "/".
 * - Priorities are between 0.0 and 1.0. Home = 1.0, main sections = 0.8,
 *   deep pages = 0.5.
 * - Dev-only or auth-required routes MUST NOT be listed.
 */

export interface SeoRoute {
	path: string;
	changefreq?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	priority?: number;
	lastmod?: string;
}

export const seoRoutes: SeoRoute[] = [
	{ path: "/", changefreq: "daily", priority: 1.0 },
	{ path: "/jobs", changefreq: "hourly", priority: 0.95 },
	{ path: "/employers", changefreq: "weekly", priority: 0.8 },
	{ path: "/job-seekers", changefreq: "weekly", priority: 0.8 },
	{ path: "/about", changefreq: "monthly", priority: 0.7 },
	{ path: "/pricing", changefreq: "monthly", priority: 0.7 },
	{ path: "/contact", changefreq: "monthly", priority: 0.6 },
	{ path: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
	{ path: "/terms-of-use", changefreq: "yearly", priority: 0.3 },
];
