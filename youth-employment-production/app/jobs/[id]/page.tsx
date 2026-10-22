import type { Metadata } from 'next';
import JobDetailPage from '@/views/job-detail';

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://job-posts-server.vercel.app/api/v1';

async function fetchJobData(id: string) {
  try {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      headers: {
        'X-Site-ID': 'youthemployment',
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json.job || null;
  } catch {
    return null;
  }
}

function mapEmploymentType(type?: string): string {
  if (!type) return 'FULL_TIME';
  const lower = type.toLowerCase();
  if (lower.includes('part')) return 'PART_TIME';
  if (lower.includes('contract')) return 'CONTRACT';
  if (lower.includes('casual') || lower.includes('seasonal') || lower.includes('temp')) return 'TEMPORARY';
  if (lower.includes('intern')) return 'INTERN';
  if (lower.includes('volunteer')) return 'VOLUNTEER';
  return 'FULL_TIME';
}

function parseSalaryAmount(salary?: string): number | null {
  if (!salary) return null;
  const match = salary.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

function generateJobPostingSchema(job: any, id: string) {
  if (!job) return null;

  const numericSalary = parseSalaryAmount(job.salary);

  return {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description:
      job.descriptionHtml ||
      job.description ||
      `<p>${job.title} at ${job.company} in ${job.location || 'Canada'}. Apply directly on Youth Employment Canada.</p>`,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Youth Employment Canada',
      value: String(job.jobUniqueId || job.id || job._id || id),
    },
    datePosted: job.jobPostingDate || job.createdAt || new Date().toISOString(),
    validThrough: job.closingDate
      ? new Date(job.closingDate).toISOString()
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: mapEmploymentType(job.employmentType),
    directApply: true,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company || 'Youth Employment Canada',
      ...(job.companyWebsite ? { sameAs: job.companyWebsite } : {}),
      ...(job.companyLogo ? { logo: job.companyLogo } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city || job.location || 'Toronto',
        addressRegion: job.province || 'ON',
        addressCountry: 'CA',
      },
    },
    ...(job.remote
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: {
            '@type': 'Country',
            name: 'Canada',
          },
        }
      : {}),
    ...(numericSalary
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'CAD',
            value: {
              '@type': 'QuantitativeValue',
              value: numericSalary,
              unitText: (job.salaryPeriod || 'YEAR').toUpperCase(),
            },
          },
        }
      : {}),
  };
}

import { extractJobId, getJobSlug } from '@/lib/utils';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const rawId = extractJobId(id);
  if (!rawId) {
    return {
      title: 'Job Posting — Youth Employment Canada',
      description: 'Find jobs and career opportunities across Canada.',
    };
  }

  const job = await fetchJobData(rawId);

  if (!job) {
    return {
      title: 'Job Opportunity | Youth Employment Canada',
      description:
        'Explore student, youth, and entry-level jobs across Canada on Youth Employment Canada.',
    };
  }

  const plainDesc = (job.description || '')
    .replace(/<[^>]*>?/gm, '')
    .slice(0, 160)
    .trim();

  const title = `${job.title} at ${job.company} (${job.location || 'Canada'})`;
  const description =
    plainDesc ||
    `Apply for ${job.title} at ${job.company} in ${job.location || 'Canada'}. ${job.employmentType || ''} position. Search youth & student jobs on Youth Employment Canada.`;

  const canonicalSlug = getJobSlug(job) || rawId;
  const canonicalUrl = `https://www.youthemployment.ca/jobs/${canonicalSlug}`;

  return {
    title,
    description,
    keywords: [
      `${job.title}`,
      `${job.title} jobs`,
      `${job.title} in ${job.location || 'Canada'}`,
      `${job.company} careers`,
      `jobs in ${job.location || 'Canada'}`,
      'Jobs in Canada',
      'Youth Employment Canada',
      'Student jobs Canada',
      'Entry level jobs Canada',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Youth Employment Canada`,
      description,
      url: canonicalUrl,
      siteName: 'Youth Employment Canada',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Youth Employment Canada`,
      description,
    },
  };
}

export default async function Page({
  params,
}: PageProps) {
  const { id } = await params;
  const rawId = extractJobId(id);
  const job = rawId ? await fetchJobData(rawId) : null;
  const schema = generateJobPostingSchema(job, rawId || id);

  const canonicalSlug = getJobSlug(job) || rawId || id;
  const canonicalUrl = `https://www.youthemployment.ca/jobs/${canonicalSlug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.youthemployment.ca',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Jobs',
        item: 'https://www.youthemployment.ca/jobs',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: job ? job.title : 'Job Opportunity',
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <JobDetailPage initialJob={job} />
    </>
  );
}
