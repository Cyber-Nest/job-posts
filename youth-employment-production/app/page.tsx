import type { Metadata } from 'next';
import HomePage from '@/views/index';

export const metadata: Metadata = {
  title:
    'Youth Employment Canada — Find Jobs for Youth, Students & Graduates in Canada',
  description:
    'Canada’s premier youth employment network. Connect with inclusive Canadian employers, explore verified job opportunities, post jobs, and build the future workforce across Canada.',
  keywords: [
    'Jobs in Canada',
    'Youth Employment Canada',
    'Jobs for youth Canada',
    'Student jobs in Canada',
    'Entry level jobs Canada',
    'Canadian youth jobs',
    'Hire youth talent Canada',
    'Summer jobs Canada',
    'Part-time jobs for students Canada',
    'Canada job board',
  ],
  alternates: {
    canonical: 'https://youthemployment.ca',
  },
  openGraph: {
    title:
      'Youth Employment Canada — Find Jobs for Youth, Students & Graduates in Canada',
    description:
      'Explore verified youth and student job opportunities across Canada. Connect with top hiring employers today.',
    url: 'https://youthemployment.ca',
    siteName: 'Youth Employment Canada',
    locale: 'en_CA',
    type: 'website',
  },
};

export default function Page() {
  return <HomePage />;
}
