import type { Metadata } from 'next';
import JobDetailPage from '@/views/job-detail';

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://job-posts-server.vercel.app/api/v1';

async function fetchJobData(id: string) {
  try {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
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
      `<p>${job.title} at ${job.company} in ${job.location || 'Canada'}. Apply on Youth Employment Canada.</p>`,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Youth Employment Canada',
      value: job.jobUniqueId || job.id || id,
    },
    datePosted: job.jobPostingDate || job.createdAt || new Date().toISOString(),
    validThrough: job.closingDate
      ? new Date(job.closingDate).toISOString()
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: mapEmploymentType(job.employmentType),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company || 'Youth Employment Canada',
      sameAs: 'https://youthemployment.ca',
      logo: 'https://youthemployment.ca/logo.svg',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Toronto',
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

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: 'Job Posting — Youth Employment Canada',
      description: 'Find jobs and career opportunities across Canada.',
    };
  }

  const job = await fetchJobData(id);

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
      canonical: `https://youthemployment.ca/jobs/${id}`,
    },
    openGraph: {
      title: `${title} | Youth Employment Canada`,
      description,
      url: `https://youthemployment.ca/jobs/${id}`,
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
  const job = id ? await fetchJobData(id) : null;
  const schema = generateJobPostingSchema(job, id);

  return (
    <>
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
