import type { Metadata } from 'next';
import PricingPage from '@/views/pricing';

export const metadata: Metadata = {
  title: 'Job Posting Pricing & Packages | Youth Employment Canada',
  description:
    'Affordable and transparent job posting packages for Canadian employers. Reach verified youth, student, and graduate applicants nationwide.',
  keywords: [
    'Job posting pricing Canada',
    'Post a job Canada cost',
    'Youth recruitment packages Canada',
    'Employer pricing Youth Employment Canada',
  ],
  alternates: {
    canonical: 'https://www.youthemployment.ca/pricing',
  },
};

export default function Page() {
  return <PricingPage />;
}
