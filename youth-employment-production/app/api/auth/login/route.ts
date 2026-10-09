import { NextResponse, type NextRequest } from 'next/server';
import {
  createLocalSession,
  fetchEmployerProfile,
  findAccountByUserId,
  findUserByIdentifier,
  publicUser,
  verifyPassword,
} from '@/server/auth/local-auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const identifier = String(body.identifier ?? body.email ?? '').trim();
  const password = String(body.password ?? '');
  const isDev = process.env.NODE_ENV !== 'production';

  if (!identifier || !password) {
    return NextResponse.json({ error: 'Identifier and password are required.' }, { status: 400 });
  }

  const user = await findUserByIdentifier(identifier);
  if (!user) {
    return NextResponse.json(
      { error: isDev ? 'User not found.' : 'Invalid email, username, or password.' },
      { status: 401 },
    );
  }

  const account = await findAccountByUserId(user.id);
  if (!account?.password || !verifyPassword(password, account.password)) {
    return NextResponse.json(
      { error: isDev ? 'Invalid password.' : 'Invalid email, username, or password.' },
      { status: 401 },
    );
  }

  const session = await createLocalSession(user.id);
  const employer = await fetchEmployerProfile(user.id);
  const res = NextResponse.json({
    success: true,
    user: publicUser(user),
    employerProfile: employer.employerProfile,
    package: employer.package,
  });

  res.cookies.set('local_session', session.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 1 * 24 * 60 * 60, // 1 day
    secure: req.nextUrl.protocol === 'https:',
  });

  return res;
}
