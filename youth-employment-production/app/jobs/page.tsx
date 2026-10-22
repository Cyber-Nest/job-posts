import type { Metadata } from 'next';
import { Suspense } from 'react';
import JobsPage from '@/views/jobs';
import { getJobSlug } from '@/lib/utils';

export const metadata: Metadata = {
  title:
    'Jobs in Canada (2026) — Search 1,000+ Youth, Student & Entry-Level Jobs | Youth Employment Canada',
  description:
    'Search the latest jobs in Canada for youth, students, and new graduates. Browse verified openings across Ontario, British Columbia, Alberta, and nationwide. Filter by full-time, part-time, and remote.',
  keywords: [
    'Jobs in Canada',
    'Canada jobs',
    'Jobs for youth in Canada',
    'Student jobs Canada',
    'Entry level jobs Canada',
    'Youth Employment Canada',
    'Part time jobs Canada',
    'Summer jobs Canada',
    'Remote jobs Canada',
    'Canadian employer job board',
    'Ontario jobs',
    'Toronto jobs',
    'Vancouver jobs',
    'Calgary jobs',
  ],
  alternates: {
    canonical: 'https://www.youthemployment.ca/jobs',
  },
  openGraph: {
    title:
      'Jobs in Canada (2026) — Search Youth, Student & Entry-Level Jobs',
    description:
      'Explore verified job postings across Canada for young workers and students. Apply directly to hiring employers.',
    url: 'https://www.youthemployment.ca/jobs',
    siteName: 'Youth Employment Canada',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Jobs in Canada — Youth & Student Opportunities',
    description:
      'Explore verified job postings across Canada. Apply directly to top employers.',
  },
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://job-posts-server.vercel.app/api/v1';

async function getInitialJobs() {
  try {
    const res = await fetch(`${BACKEND_URL}/jobs?limit=20`, {
      headers: {
        'X-Site-ID': 'youthemployment',
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data.jobs || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const jobs = await getInitialJobs();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Latest Youth & Student Jobs in Canada',
    description:
      'Verified entry-level, student, and youth job postings across Canada.',
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 15).map((job: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${job.title || 'Job Opening'} at ${job.company || 'Canadian Employer'}`,
      url: `https://www.youthemployment.ca/jobs/${getJobSlug(job) || job.id || job._id}`,
    })),
  };

  return (
    <>
      {jobs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <Suspense fallback={null}>
        <JobsPage initialJobs={jobs} />
      </Suspense>
    </>
  );
}
