import type { Metadata } from 'next';
import EmployersPage from '@/views/employers';

export const metadata: Metadata = {
  title: 'Hire Youth & Student Talent in Canada | Youth Employment Canada',
  description:
    'Connect with motivated young Canadian workers, students, and recent graduates. Post jobs, access top emerging talent, and grow your Canadian organization.',
  keywords: [
    'Hire youth Canada',
    'Post jobs Canada',
    'Hire students Canada',
    'Canadian employers hiring youth',
    'Youth employment network Canada',
    'Student recruitment Canada',
  ],
  alternates: {
    canonical: 'https://www.youthemployment.ca/employers',
  },
};

export default function Page() {
  return <EmployersPage />;
}
