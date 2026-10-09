import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/server/auth/local-auth';

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File exceeds 5 MB limit.' }, { status: 413 });

  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only PDF and Word documents are accepted.' }, { status: 400 });
  }

  const ext = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.docx');
  const filename = `resumes/${randomUUID()}${ext}`;
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'assets', 'uploads');
  const uploadPath = path.join(uploadDir, filename);

  await mkdir(path.dirname(uploadPath), { recursive: true });
  await writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/assets/uploads/${filename}` });
}
