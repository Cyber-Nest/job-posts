import type { Metadata } from 'next';
import ContactPage from '@/views/contact';

export const metadata: Metadata = {
  title: 'Contact Us | Youth Employment Canada',
  description:
    'Have questions or need assistance? Contact Youth Employment Canada for employer support, job seeker inquiries, and partnership opportunities.',
  keywords: [
    'Contact Youth Employment Canada',
    'Youth employment support',
    'Employer support Canada',
  ],
  alternates: {
    canonical: 'https://youthemployment.ca/contact',
  },
};

export default function Page() {
  return <ContactPage />;
}
