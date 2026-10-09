'use client';

import NextLink from 'next/link';
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation';
import type { ComponentProps, ReactNode } from 'react';
import { createElement, Fragment, useEffect } from 'react';

export type Path =
  | '/'
  | '/employers'
  | '/job-seekers'
  | '/pricing'
  | '/about'
  | '/contact'
  | '/privacy-policy'
  | '/terms-of-use'
  | '/post-a-job'
  | '/login'
  | '/register'
  | '/dashboard'
  | '/jobs';

export type Params = Record<string, string | undefined>;

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  to: string;
  href?: string;
};

export function Link({ to, children, ...props }: LinkProps) {
  return createElement(NextLink, { href: to, ...props }, children);
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [replace, router, to]);

  return null;
}

export function useNavigate() {
  const router = useRouter();
  return (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) router.replace(to);
    else router.push(to);
  };
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname, state: null as unknown };
}

export function useParams<T extends Params = Params>(): T {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  return { id: parts[1] } as unknown as T;
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams) => void] {
  const params = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return [
    new URLSearchParams(params.toString()),
    (next) => {
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
  ];
}

export function ScrollRestoration() {
  return null;
}

export function Outlet({ children }: { children?: ReactNode }) {
  return createElement(Fragment, null, children);
}

export { useRouter };
