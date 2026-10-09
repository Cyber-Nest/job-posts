"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export interface SignInFn {
  (credentials: any): Promise<any>;
  email: (credentials: { email: string; password: string }) => Promise<any>;
  social: (options: { provider: string; callbackURL?: string }) => Promise<any>;
}

export interface SignUpFn {
  (data: any): Promise<any>;
  email: (data: any) => Promise<any>;
}

const baseSignIn = async function ({ email, password }: any) {
  try {
    const data = await apiClient.post("/auth/login", { email, password });
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || "Login failed" } };
  }
};

const signInEmail = async ({ email, password }: { email: string; password: string }) => {
  return baseSignIn({ email, password });
};

const signInSocial = async ({ provider, callbackURL }: { provider: string; callbackURL?: string }) => {
  try {
    window.location.href = `/api/auth/social/${provider}?callbackUrl=${encodeURIComponent(callbackURL || '/')}`;
    return { data: true, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || "Social sign in failed" } };
  }
};

export const signIn: SignInFn = Object.assign(baseSignIn, {
  email: signInEmail,
  social: signInSocial,
});

const baseSignUp = async function (data: any) {
  try {
    const responseData = await apiClient.post("/auth/register-employer", data);
    return { data: responseData, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || "Registration failed" } };
  }
};

const signUpEmail = async (data: any) => {
  return baseSignUp(data);
};

export const signUp: SignUpFn = Object.assign(baseSignUp, {
  email: signUpEmail,
});

export async function signOut() {
  return apiClient.post("/auth/logout");
}

/**
 * Custom Session Hook connected to Express Backend (/auth/session)
 */
export function useSession() {
  const [sessionData, setSessionData] = useState<any>({
    session: null,
    user: null,
    isPending: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get("/auth/session")
      .then((res) => {
        if (isMounted) {
          setSessionData({
            session: res?.session || null,
            user: res?.user || null,
            isPending: false,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setSessionData({
            session: null,
            user: null,
            isPending: false,
            error: err,
          });
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    session: sessionData.session,
    user: sessionData.user,
    isPending: sessionData.isPending,
    error: sessionData.error,
    isAuthenticated: !sessionData.isPending && !!sessionData.user,
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
 * Protected Route Component
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
          className="px-4 py-2 bg-[#059669] text-white font-bold rounded-xl text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]" />
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
      window.location.href = "/login";
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
        "px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md disabled:opacity-50"
      }
    >
      {isLoading ? "Logging out..." : children}
    </button>
  );
}
