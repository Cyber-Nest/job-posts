import type { Metadata } from 'next';
import PrivacyPolicyPage from '@/views/privacy-policy';

export const metadata: Metadata = {
  title: 'Privacy Policy | Youth Employment Canada',
  description:
    'Read the Privacy Policy of Youth Employment Canada to understand how we protect and handle your personal information.',
  alternates: {
    canonical: 'https://youthemployment.ca/privacy-policy',
  },
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
