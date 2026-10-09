"use client";

import { createAuthClient } from "better-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export { authClient };

export const { signIn, signUp, signOut } = authClient;

/**
 * Session Hook
 */
export function useSession() {
  const { data: session, isPending, error } = authClient.useSession();

  return {
    session,
    user: session?.user ?? null,
    isPending,
    error,
    isAuthenticated: !isPending && !!session?.user,
  };
}

export const useAuth = useSession;

/**
 * Optional Provider
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const AuthProvider = SessionProvider;

/**
 * Protected Route
 */
const SESSION_TIMEOUT_MS = 30000;

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPending } = useSession();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isPending) return;

    const timeout = setTimeout(() => {
      setTimedOut(true);
    }, SESSION_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [isPending]);

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.push("/login");
    }
  }, [isPending, isAuthenticated, router]);

  if (timedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Session check timed out.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Logout Button
 */
export function LogoutButton({
  className = "",
  children = "Logout",
}: {
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={
        className ||
        "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
      }
    >
      {isLoading ? "Logging out..." : children}
    </button>
  );
}
