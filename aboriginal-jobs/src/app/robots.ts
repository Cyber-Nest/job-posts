import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/login",
          "/register",
          "/payment/",
          "/dashboard/",
          "/admin/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: "https://aboriginal-jobs.ca/sitemap.xml",
    host: "https://aboriginal-jobs.ca",
  };
}
