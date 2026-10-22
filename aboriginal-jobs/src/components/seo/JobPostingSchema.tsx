import React from "react";

interface JobPostingSchemaProps {
  job: {
    _id?: string;
    id?: string;
    title: string;
    company: string;
    contactName?: string;
    city?: string;
    province?: string;
    location?: string;
    salary?: string;
    salaryType?: "hour" | "week" | "month" | "year" | string;
    employmentType?: string;
    vacancies?: number;
    category?: string;
    nocCode?: string;
    experience?: string;
    descriptionHtml?: string;
    description?: string;
    requirementsHtml?: string;
    contactEmail?: string;
    website?: string;
    companyLogo?: string;
    indigenousOwned?: boolean;
    remote?: boolean;
    postedAt?: string | Date;
    expiresAt?: string | Date;
    streetAddress?: string;
  };
}

export default function JobPostingSchema({ job }: JobPostingSchemaProps) {
  if (!job || !job.title) return null;

  const isRemote = Boolean(job.remote);
  const postDate = job.postedAt
    ? new Date(job.postedAt).toISOString()
    : new Date().toISOString();

  // Valid through default 60 days if expiresAt not provided
  const validThrough = job.expiresAt
    ? new Date(job.expiresAt).toISOString()
    : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

  // Clean description string (Google requires plain text or basic HTML tags: p, br, ul, li, b, i)
  const rawDesc = job.descriptionHtml || job.description || `${job.title} at ${job.company}`;
  const cleanDescription = rawDesc.trim();

  const schemaData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: cleanDescription,
    datePosted: postDate,
    validThrough: validThrough,
    employmentType: mapEmploymentType(job.employmentType || "Full-time"),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company || "Aboriginal Jobs Canada",
      sameAs: job.website || undefined,
      logo: job.companyLogo || "https://aboriginal-jobs.ca/logo.svg",
    },
    directApply: true,
  };

  // Remote vs In-person location schema
  if (isRemote) {
    schemaData.jobLocationType = "TELECOMMUTE";
    schemaData.applicantLocationRequirements = {
      "@type": "Country",
      name: "Canada",
    };
  } else {
    schemaData.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.streetAddress || undefined,
        addressLocality: job.city || "Canada",
        addressRegion: job.province || undefined,
        addressCountry: "CA",
      },
    };
  }

  // Salary Schema (QuantitativeValue CAD)
  if (job.salary) {
    const salaryParsed = parseSalary(job.salary, job.salaryType);
    if (salaryParsed) {
      schemaData.baseSalary = salaryParsed;
    }
  }

  // NOC Code / Category
  if (job.nocCode) {
    schemaData.occupationalCategory = `NOC ${job.nocCode}`;
  } else if (job.category) {
    schemaData.occupationalCategory = job.category;
  }

  // Experience requirements
  if (job.experience) {
    schemaData.experienceRequirements = {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: parseExperienceMonths(job.experience),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

function mapEmploymentType(type: string): string {
  const lower = (type || "").toLowerCase();
  if (lower.includes("full")) return "FULL_TIME";
  if (lower.includes("part")) return "PART_TIME";
  if (lower.includes("contract")) return "CONTRACTOR";
  if (lower.includes("casual") || lower.includes("seasonal")) return "TEMPORARY";
  if (lower.includes("volunteer")) return "VOLUNTEER";
  if (lower.includes("intern")) return "INTERN";
  return "FULL_TIME";
}

function parseSalary(salaryStr: string, salaryType?: string) {
  const numbers = salaryStr.match(/[\d,.]+/g);
  if (!numbers || numbers.length === 0) return undefined;

  const min = parseFloat(numbers[0].replace(/,/g, ""));
  const max = numbers.length > 1 ? parseFloat(numbers[1].replace(/,/g, "")) : min;

  if (isNaN(min) || min <= 0) return undefined;

  let unit = "YEAR";
  const str = (salaryType || salaryStr).toLowerCase();
  if (str.includes("hour")) unit = "HOUR";
  else if (str.includes("week")) unit = "WEEK";
  else if (str.includes("month")) unit = "MONTH";

  return {
    "@type": "MonetaryAmount",
    currency: "CAD",
    value: {
      "@type": "QuantitativeValue",
      minValue: min,
      maxValue: max,
      unitText: unit,
    },
  };
}

function parseExperienceMonths(expStr: string): number | undefined {
  const match = expStr.match(/\d+/);
  if (!match) return undefined;
  const num = parseInt(match[0], 10);
  if (expStr.toLowerCase().includes("year")) {
    return num * 12;
  }
  return num;
}
