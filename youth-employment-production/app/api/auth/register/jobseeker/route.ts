import { randomUUID } from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { collection, ensureIndexes } from '@/server/db/mongo';
import type { AccountDoc, UserDoc } from '@/server/db/models';
import { createLocalSession, hashPassword, publicUser } from '@/server/auth/local-auth';

function validatePassword(password: string) {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number.';
  return null;
}

export async function POST(req: NextRequest) {
  await ensureIndexes();
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const name = String(body.name ?? '').trim();
  const [firstName = '', ...rest] = name.split(/\s+/).filter(Boolean);
  const lastName = rest.join(' ');

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  const passwordError = validatePassword(password);
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  const users = await collection<UserDoc>('users');
  const duplicate = await users.findOne({ email });
  if (duplicate) return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });

  const now = new Date();
  const user: UserDoc = {
    id: randomUUID(),
    name,
    email,
    emailVerified: false,
    image: null,
    username: null,
    firstName,
    lastName,
    phoneNumber: null,
    accountType: 'jobseeker',
    createdAt: now,
    updatedAt: now,
  };

  await users.insertOne(user);
  await (await collection<AccountDoc>('accounts')).insertOne({
    id: randomUUID(),
    accountId: email,
    providerId: 'credential',
    userId: user.id,
    password: hashPassword(password),
    createdAt: now,
    updatedAt: now,
  });

  const session = await createLocalSession(user.id);
  const res = NextResponse.json({ success: true, user: publicUser(user) }, { status: 201 });
  res.cookies.set('local_session', session.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    secure: req.nextUrl.protocol === 'https:',
  });
  return res;
}
