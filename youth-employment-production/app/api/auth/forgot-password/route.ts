import { NextResponse, type NextRequest } from 'next/server';
import { collection } from '@/server/db/mongo';
import type { UserDoc } from '@/server/db/models';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const users = await collection<UserDoc>('users');
    const user = await users.findOne({ email });

    if (!user) {
      // Don't reveal that email doesn't exist for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a reset code.',
      });
    }

    // Forward to send-otp API with purpose='password_reset'
    const sendOtpResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose: 'password_reset' }),
    });

    const data = await sendOtpResponse.json();

    if (!sendOtpResponse.ok) {
      return NextResponse.json({ error: data.error }, { status: sendOtpResponse.status });
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a reset code.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}