'use client';

import { Suspense } from 'react';
import RegisterPage from '@/views/register';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterPage />
    </Suspense>
  );
}
