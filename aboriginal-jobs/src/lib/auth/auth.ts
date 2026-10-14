/**
 * Auth Types and Helpers for Aboriginal Jobs Canada
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  accountType?: string;
  image?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: string | Date;
  user: User;
}

export async function getAuth() {
  return null;
}
