'use client';

import { Suspense } from 'react';
import JobsPage from '@/views/jobs';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <JobsPage />
    </Suspense>
  );
}
