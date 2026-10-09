import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from '@/router';

export const authClient = {};
export const signIn = {
  email: ({ email, password }: { email: string; password: string }) => loginWithIdentifier(email, password),
  social: async (_data?: { provider?: string; callbackURL?: string }) => {
    throw new Error('Social sign-in is not configured for the MongoDB auth flow.');
  },
};
export const signUp = {
  email: async (data: { email: string; password: string; name?: string }) => {
    const response = await fetch(authApiUrl('/api/auth/register/jobseeker'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return { error: { message: result?.error || 'Registration failed.' } };
    }
    updateAuthState({ user: result.user ?? null, error: null });
    return { data: result };
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const authApiUrl = (pathname: string) =>
  `${API_BASE_URL}${pathname}`;

export type RegisterEmployerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  businessName: string;
  phoneNumber: string;
  province: string;
};

export async function registerEmployer(data: RegisterEmployerPayload) {
  try {
    const url = authApiUrl('/api/auth/register/employer');
    console.log('[registerEmployer] Calling endpoint:', url);
    console.log('[registerEmployer] Payload:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    console.log('[registerEmployer] Response status:', response.status, response.statusText);

    const result = await response.json().catch(() => null);
    
    if (!response.ok) {
      const errorMsg = result?.error || result?.details || 'Registration failed.';
      console.error('[registerEmployer] Error:', errorMsg);
      return { error: { message: errorMsg } };
    }

    console.log('[registerEmployer] Success:', result);
    return { data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to connect to the registration service.';
    console.error('[registerEmployer] Network error:', message);
    return { error: { message } };
  }
}

type AuthState = {
  user: any | null;
  error: any | null;
  loaded: boolean;
  isPending: boolean;
  listeners: Set<() => void>;
};

const authState: AuthState = {
  user: null,
  error: null,
  loaded: false,
  isPending: true,
  listeners: new Set(),
};

function notifyAuthListeners() {
  for (const listener of authState.listeners) {
    listener();
  }
}

function updateAuthState(state: Partial<AuthState>) {
  Object.assign(authState, state);
  authState.loaded = true;
  authState.isPending = false;
  notifyAuthListeners();
}

async function ensureAuthStateLoaded() {
  if (authState.loaded) return;
  authState.isPending = true;
  notifyAuthListeners();

  const result = await fetchAuthMe();
  if (result.error) {
    updateAuthState({ user: null, error: result.error });
  } else {
    updateAuthState({ user: result.data?.user ?? null, error: null });
  }
}

export async function loginWithIdentifier(identifier: string, password: string) {
  const response = await fetch(authApiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ identifier, password }),
  });

  const result = await response.json();
  if (!response.ok) {
    return { error: { message: result?.error || 'Invalid email, username, or password.' } };
  }

  updateAuthState({ user: result.user ?? null, error: null });
  return { data: result };
}

export async function fetchAuthMe() {
  const response = await fetch(authApiUrl('/api/auth/me'), {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    return { error: { message: result?.error || 'Unable to fetch session.' } };
  }

  return { data: await response.json() };
}

export async function logout() {
  const response = await fetch(authApiUrl('/api/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    return { error: { message: result?.error || 'Unable to log out.' } };
  }

  updateAuthState({ user: null, error: null });
  return { data: await response.json().catch(() => null) };
}

export async function signOut() {
  const result = await logout();
  if (result.error) {
    throw new Error(result.error.message || 'Unable to log out.');
  }
  return result.data;
}

/**
 * useSession — null-safe session hook.
 *
 * Returns `user` as a top-level nullable field and `isAuthenticated` as a
 * boolean so components naturally handle the unauthenticated state.
 */
export function useSession() {
  const [state, setState] = useState({
    user: authState.user,
    isPending: authState.isPending,
    error: authState.error,
  });

  useEffect(() => {
    const listener = () => {
      setState({
        user: authState.user,
        isPending: authState.isPending,
        error: authState.error,
      });
    };

    authState.listeners.add(listener);
    if (!authState.loaded) {
      ensureAuthStateLoaded();
    }

    return () => {
      authState.listeners.delete(listener);
    };
  }, []);

  return {
    session: { user: state.user },
    user: state.user,
    isPending: state.isPending,
    error: state.error,
    isAuthenticated: !state.isPending && !!state.user,
  };
}

// Alias for useSession (common naming convention)
export const useAuth = useSession;

/**
 * SessionProvider - Wrapper for compatibility with common auth patterns.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Alias for SessionProvider (common naming convention in auth libraries)
export const AuthProvider = SessionProvider;

// Session timeout for loading state (30 seconds)
const SESSION_TIMEOUT_MS = 30000;

// ProtectedRoute component with timeout handling
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPending } = useSession();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isPending) return;

    const timeout = setTimeout(() => setTimedOut(true), SESSION_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [isPending]);

  if (timedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Session check timed out. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * LogoutButton - Button to sign out the user
 */
export function LogoutButton({
  className = '',
  children = 'Logout',
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className || 'px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50'}
    >
      {isLoading ? 'Logging out...' : children}
    </button>
  );
}
