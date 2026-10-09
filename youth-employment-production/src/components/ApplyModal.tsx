import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth/auth-client';

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  company: string;
  onClose: () => void;
}

export default function ApplyModal({ jobId, jobTitle, company, onClose }: ApplyModalProps) {
  const { isAuthenticated } = useSession();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setServerError('Please upload a PDF or Word document (.pdf, .doc, .docx).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setServerError('File must be under 5 MB.');
      return;
    }
    setServerError('');
    setResumeFile(file);
  };

  const uploadResume = async (): Promise<string | null> => {
    if (!resumeFile) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      const res = await fetch('/api/upload/resume', { method: 'POST', body: formData });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Upload failed.');
      return data.url ?? null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);
    try {
      let resumeUrl: string | null = null;
      if (resumeFile) {
        resumeUrl = await uploadResume();
      }
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, coverLetter: coverLetter.trim() || null, resumeUrl }),
      });
      const data = await res.json() as { error?: string; success?: boolean };
      if (!res.ok) {
        setServerError(data.error || 'Failed to submit application. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl w-full max-w-lg border border-[#2563EB]/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {submitted ? (
          /* ── Success ─────────────────────────────────────────────── */
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#7A9E7E]/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-[#7A9E7E]" />
            </div>
            <h3
              className="text-xl font-bold text-[#1C1C1C] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Application Submitted!
            </h3>
            <p className="text-[#0F172A]/70 text-sm mb-2">
              Your application for <strong>{jobTitle}</strong> at <strong>{company}</strong> has been received.
            </p>
              <p className="text-[#475569]/50 text-xs mb-6">
              You can track your application status in your employer dashboard.
            </p>
            <Button
              onClick={onClose}
              className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-semibold w-full"
            >
              Back to Job Listing
            </Button>
          </div>
        ) : !isAuthenticated ? (
          /* ── Not logged in ───────────────────────────────────────── */
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-[#2563EB]" />
            </div>
            <h3
              className="text-xl font-bold text-[#1C1C1C] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Sign In to Apply
            </h3>
            <p className="text-[#6B3A2A]/70 text-sm mb-6">
              Applications are handled directly by employers. Please follow the application instructions on the job listing.
            </p>
          </div>
        ) : (
          /* ── Form ────────────────────────────────────────────────── */
          <>
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#2563EB]/10 bg-[#F8FAFC] flex-shrink-0">
              <div>
                <h3
                  className="font-bold text-[#1C1C1C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Apply for this Role
                </h3>
                <p className="text-xs text-[#475569]/60 mt-0.5">{jobTitle} · {company}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[#475569]/40 hover:text-[#2563EB] transition-colors p-1 rounded-lg hover:bg-[#2563EB]/10"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-5 overflow-y-auto">
              {serverError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {serverError}
                </div>
              )}

              {/* Cover Letter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0F172A]">
                  Cover Letter <span className="text-[#6B3A2A]/40 font-normal">(optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly introduce yourself and why you're a great fit for this role…"
                  rows={5}
                  className="w-full rounded-xl border border-[#2563EB]/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 resize-none text-[#1C1C1C] placeholder:text-[#475569]/30"
                />
              </div>

              {/* Resume Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0F172A]">
                  Resume <span className="text-[#475569]/40 font-normal">(optional · PDF or Word, max 5 MB)</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {resumeFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-[#7A9E7E]/30 bg-[#7A9E7E]/5">
                    <FileText size={18} className="text-[#7A9E7E] flex-shrink-0" />
                    <span className="text-sm text-[#1C1C1C] truncate flex-1">{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={() => { setResumeFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="text-[#475569]/40 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2.5 p-3 rounded-xl border-2 border-dashed border-[#2563EB]/20 hover:border-[#2563EB]/40 hover:bg-[#F8FAFC] transition-all text-sm text-[#475569]/60 hover:text-[#2563EB]"
                  >
                    <Upload size={16} />
                    Click to upload your resume
                  </button>
                )}
              </div>

              <p className="text-xs text-[#475569]/50 leading-relaxed">
                By applying you agree to Youth Employment Canada's privacy policy. Your information is shared only with the hiring employer.
              </p>

              <Button
                type="submit"
                disabled={loading || uploading}
                className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-semibold w-full mt-1 disabled:opacity-60"
              >
                {loading || uploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {uploading ? 'Uploading resume…' : 'Submitting…'}
                  </span>
                ) : 'Submit Application'}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
