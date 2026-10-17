import type { Metadata } from 'next';
import TermsOfUsePage from '@/views/terms-of-use';

export const metadata: Metadata = {
  title: 'Terms of Use | Youth Employment Canada',
  description:
    'Review the terms of use governing the use of the Youth Employment Canada job board and services.',
  alternates: {
    canonical: 'https://youthemployment.ca/terms-of-use',
  },
};

export default function Page() {
  return <TermsOfUsePage />;
}
