import { randomUUID } from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { collection } from '@/server/db/mongo';
import type { ApplicationDoc, EmployerDoc, JobDoc, UserDoc } from '@/server/db/models';
import { getCurrentUser } from '@/server/auth/local-auth';

export async function GET(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const role = req.nextUrl.searchParams.get('role');
  const applications = await collection<ApplicationDoc>('applications');
  const jobsCollection = await collection<JobDoc>('jobs');

  if (role === 'employer') {
    const employer = await (await collection<EmployerDoc>('employers')).findOne({ userId: currentUser.id });
    if (!employer) return NextResponse.json({ applications: [], jobs: [] });

    const jobs = await jobsCollection.find({ employerId: employer.id }).toArray();
    if (jobs.length === 0) return NextResponse.json({ applications: [], jobs: [] });

    const jobById = new Map(jobs.map((job) => [job.id, job]));
    const users = await collection<UserDoc>('users');
    const apps = await applications.find({ jobId: { $in: jobs.map((job) => job.id) } }).sort({ appliedAt: 1 }).toArray();
    const applicantIds = [...new Set(apps.map((app) => app.userId))];
    const applicants = await users.find({ id: { $in: applicantIds } }).toArray();
    const applicantById = new Map(applicants.map((user) => [user.id, user]));

    return NextResponse.json({
      applications: apps.map((app) => {
        const job = jobById.get(app.jobId);
        const applicant = applicantById.get(app.userId);
        return {
          id: app.id,
          jobId: app.jobId,
          userId: app.userId,
          coverLetter: app.coverLetter,
          resumeUrl: app.resumeUrl,
          status: app.status,
          appliedAt: app.appliedAt,
          applicantName: applicant?.name ?? '',
          applicantEmail: applicant?.email ?? '',
          jobTitle: job?.title ?? '',
          jobCompany: job?.company ?? '',
        };
      }),
      jobs,
    });
  }

  const apps = await applications.find({ userId: currentUser.id }).sort({ appliedAt: 1 }).toArray();
  const jobs = await jobsCollection.find({ id: { $in: apps.map((app) => app.jobId) } }).toArray();
  const jobById = new Map(jobs.map((job) => [job.id, job]));

  return NextResponse.json({
    applications: apps.map((app) => {
      const job = jobById.get(app.jobId);
      return {
        id: app.id,
        jobId: app.jobId,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumeUrl,
        status: app.status,
        appliedAt: app.appliedAt,
        jobTitle: job?.title ?? '',
        jobCompany: job?.company ?? '',
        jobLocation: job?.location ?? '',
        jobEmploymentType: job?.employmentType ?? '',
        jobStatus: job?.status ?? '',
      };
    }),
  });
}

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const jobId = String(body.jobId ?? '').trim();
  const coverLetter = String(body.coverLetter ?? '').trim() || null;
  const resumeUrl = String(body.resumeUrl ?? '').trim() || null;

  if (!jobId) return NextResponse.json({ error: 'jobId is required.' }, { status: 400 });

  const job = await (await collection<JobDoc>('jobs')).findOne({ id: jobId });
  if (!job) return NextResponse.json({ error: 'Job not found.' }, { status: 404 });

  const applications = await collection<ApplicationDoc>('applications');
  const existing = await applications.findOne({ jobId, userId: currentUser.id });
  if (existing) return NextResponse.json({ error: 'You have already applied for this job.' }, { status: 409 });

  const now = new Date();
  const id = randomUUID();
  await applications.insertOne({
    id,
    jobId,
    userId: currentUser.id,
    coverLetter,
    resumeUrl,
    status: 'pending',
    appliedAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ success: true, applicationId: id }, { status: 201 });
}
