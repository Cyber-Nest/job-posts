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
    canonical: 'https://www.youthemployment.ca',
  },
  openGraph: {
    title:
      'Youth Employment Canada — Find Jobs for Youth, Students & Graduates in Canada',
    description:
      'Explore verified youth and student job opportunities across Canada. Connect with top hiring employers today.',
    url: 'https://www.youthemployment.ca',
    siteName: 'Youth Employment Canada',
    locale: 'en_CA',
    type: 'website',
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can students and young Canadians find jobs on Youth Employment Canada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Job seekers can freely browse verified student, summer, part-time, and entry-level positions across Canada without mandatory registration. Filter by province, remote preference, or category, and apply directly to verified employers.",
      },
    },
    {
      "@type": "Question",
      name: "What is the minimum legal working age in Canada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The legal working age varies by province: youth aged 14–15 can work in Ontario and British Columbia with hourly restrictions during school periods; Alberta permits approved light employment starting at age 13 with parental consent; and youth aged 16+ can work standard roles nationwide adhering to provincial labor standards.",
      },
    },
    {
      "@type": "Question",
      name: "Are all employers and job postings verified?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, every employer and job posting on Youth Employment Canada is reviewed to ensure compliance with provincial Employment Standards Acts, minimum wage regulations, and safe workplace practices.",
      },
    },
    {
      "@type": "Question",
      name: "Does Youth Employment Canada charge job seekers any fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, Youth Employment Canada is 100% free for all students, youth, and early-career job seekers. You can search, view compensation, and apply directly without any costs.",
      },
    },
    {
      "@type": "Question",
      name: "Can international students in Canada apply for jobs on this platform?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, international students with valid Canadian study permits allowing off-campus work, as well as recent graduates with Post-Graduation Work Permits (PGWP), are eligible to apply for positions matching their work authorization.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePage />
    </>
  );
}
