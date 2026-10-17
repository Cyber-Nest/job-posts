import type { Metadata } from 'next';
import { Suspense } from 'react';
import JobsPage from '@/views/jobs';

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
    canonical: 'https://youthemployment.ca/jobs',
  },
  openGraph: {
    title:
      'Jobs in Canada (2026) — Search Youth, Student & Entry-Level Jobs',
    description:
      'Explore verified job postings across Canada for young workers and students. Apply directly to hiring employers.',
    url: 'https://youthemployment.ca/jobs',
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

export default function Page() {
  return (
    <Suspense fallback={null}>
      <JobsPage />
    </Suspense>
  );
}
