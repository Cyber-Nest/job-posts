import { NextResponse } from 'next/server';
import { getDb } from '@/server/db/mongo';

export async function GET() {
  await getDb();
  return NextResponse.json({ ok: true, status: 'healthy' });
}
