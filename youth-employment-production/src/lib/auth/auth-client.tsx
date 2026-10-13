import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from '@/router';
import { apiClient } from '@/lib/api-client';

export const authClient = {};

export const signIn = {
  email: ({ email, password }: { email: string; password: string }) => loginWithIdentifier(email, password),
  social: async (_data?: { provider?: string; callbackURL?: string }) => {
    throw new Error('Social sign-in is not configured for the MongoDB auth flow.');
  },
};

export const signUp = {
  email: async (data: { email: string; password: string; name?: string }) => {
    try {
      const result = await apiClient.post('/auth/register-employer', data);
      updateAuthState({ user: result.user ?? null, error: null });
      return { data: result };
    } catch (err: any) {
      return { error: { message: err.message || 'Registration failed.' } };
    }
  },
};

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
    const result = await apiClient.post('/auth/register-employer', data);
    return { data: result };
  } catch (error: any) {
    const message = error.message || 'Unable to connect to registration service.';
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
  try {
    const result = await apiClient.post('/auth/login', { email: identifier, password });
    updateAuthState({ user: result.user ?? null, error: null });
    return { data: result };
  } catch (err: any) {
    return { error: { message: err.message || 'Invalid email or password.' } };
  }
}

export async function fetchAuthMe() {
  try {
    const data = await apiClient.get('/auth/session');
    return { data };
  } catch (err: any) {
    return { error: { message: err.message || 'Unable to fetch session.' } };
  }
}

export async function logout() {
  try {
    const data = await apiClient.post('/auth/logout');
    updateAuthState({ user: null, error: null });
    return { data };
  } catch (err: any) {
    return { error: { message: err.message || 'Unable to log out.' } };
  }
}

export async function signOut() {
  const result = await logout();
  if (result.error) {
    throw new Error(result.error.message || 'Unable to log out.');
  }
  return result.data;
}

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

export const useAuth = useSession;

export function SessionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const AuthProvider = SessionProvider;

const SESSION_TIMEOUT_MS = 30000;

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
