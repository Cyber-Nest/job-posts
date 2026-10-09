import { NextResponse, type NextRequest } from 'next/server';
import { collection } from '@/server/db/mongo';
import type { ApplicationDoc, EmployerDoc, JobDoc } from '@/server/db/models';
import { getCurrentUser } from '@/server/auth/local-auth';

const allowedStatuses = new Set(['pending', 'reviewed', 'shortlisted', 'rejected']);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = String(body.status ?? '').trim();

  if (!allowedStatuses.has(status)) return NextResponse.json({ error: 'Invalid application status.' }, { status: 400 });

  const employers = await collection<EmployerDoc>('employers');
  const employer = await employers.findOne({ userId: currentUser.id });
  if (!employer) return NextResponse.json({ error: 'Employer profile not found.' }, { status: 403 });

  const applications = await collection<ApplicationDoc>('applications');
  const application = await applications.findOne({ id });
  if (!application) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });

  const job = await (await collection<JobDoc>('jobs')).findOne({ id: application.jobId, employerId: employer.id });
  if (!job) return NextResponse.json({ error: 'Not authorized for this application.' }, { status: 403 });

  await applications.updateOne({ id }, { $set: { status: status as ApplicationDoc['status'], updatedAt: new Date() } });
  return NextResponse.json({ success: true });
}
