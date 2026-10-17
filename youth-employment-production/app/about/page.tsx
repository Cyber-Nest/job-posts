import type { Metadata } from 'next';
import AboutPage from '@/views/about';

export const metadata: Metadata = {
  title: 'About Us | Youth Employment Canada',
  description:
    'Learn about Youth Employment Canada’s mission to connect young Canadians with inclusive employers and bridge the gap to meaningful career opportunities.',
  keywords: [
    'About Youth Employment Canada',
    'Canada youth employment mission',
    'Canadian student careers',
    'Youth employment initiative Canada',
  ],
  alternates: {
    canonical: 'https://youthemployment.ca/about',
  },
};

export default function Page() {
  return <AboutPage />;
}
