'use client';

import { ProtectedRoute } from '@/lib/auth/auth-client';
import DashboardPage from '@/views/dashboard';

export default function Page() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
