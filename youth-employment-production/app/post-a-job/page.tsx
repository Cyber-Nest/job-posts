'use client';

import { ProtectedRoute } from '@/lib/auth/auth-client';
import PostAJobPage from '@/views/post-a-job';

export default function Page() {
  return (
    <ProtectedRoute>
      <PostAJobPage />
    </ProtectedRoute>
  );
}
