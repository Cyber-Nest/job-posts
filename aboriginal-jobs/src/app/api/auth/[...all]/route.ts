/**
 * BetterAuth catch-all API route
 * Handles ALL /api/auth/* requests (sign-in, sign-up, session, etc.)
 * No Express adapter needed — Next.js uses native Web Request/Response
 */

import { getAuth } from "@/lib/auth/auth";

export async function GET(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}

export async function POST(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}
