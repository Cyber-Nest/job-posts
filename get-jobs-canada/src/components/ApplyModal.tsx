"use client";

import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth/auth-client';
import { apiClient } from '@/lib/api-client';

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
      const data = await apiClient.post('/upload/resume', formData);
      return data.url ?? data.data?.url ?? null;
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
      await apiClient.post('/applications', { jobId, coverLetter: coverLetter.trim() || null, resumeUrl });
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
        className="bg-white rounded-3xl w-full max-w-lg border border-slate-200/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {submitted ? (
          /* ── Success ─────────────────────────────────────────────── */
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-[#059669]">
              <CheckCircle size={28} className="text-[#059669]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-slate-600 text-sm mb-2 font-medium">
              Your application for <strong className="text-slate-900">{jobTitle}</strong> at <strong className="text-slate-900">{company}</strong> has been received.
            </p>
            <p className="text-slate-400 text-xs mb-6">
              You can track your application status in your{" "}
              <a href="/dashboard/seeker" className="text-[#059669] font-bold underline hover:no-underline">
                Job Seeker Dashboard
              </a>.
            </p>
            <Button
              onClick={onClose}
              className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold rounded-2xl w-full h-11"
            >
              Back to Job Listing
            </Button>
          </div>
        ) : !isAuthenticated ? (
          /* ── Not logged in ───────────────────────────────────────── */
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-[#059669]">
              <AlertCircle size={28} className="text-[#059669]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Sign In to Apply
            </h3>
            <p className="text-slate-600 text-sm mb-6 font-medium">
              You need an account to apply for jobs and track your applications.
            </p>
            <div className="flex flex-col gap-3">
              <a href="/login">
                <Button className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold rounded-2xl w-full h-11">
                  Sign In
                </Button>
              </a>
              <a href="/register?type=jobseeker">
                <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-[#059669] font-bold rounded-2xl h-11">
                  Create an Account
                </Button>
              </a>
            </div>
          </div>
        ) : (
          /* ── Form ────────────────────────────────────────────────── */
          <>
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50/70 flex-shrink-0">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Apply for this Role
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{jobTitle} · {company}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-xl hover:bg-slate-200/60"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-5 overflow-y-auto">
              {serverError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl px-4 py-3">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {serverError}
                </div>
              )}

              {/* Cover Letter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Cover Letter <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly introduce yourself and why you're a great fit for this role…"
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 resize-none placeholder:text-slate-400 transition-all"
                />
              </div>

              {/* Resume Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Resume <span className="text-slate-400 font-normal lowercase">(optional · PDF or Word, max 5 MB)</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {resumeFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60">
                    <FileText size={18} className="text-[#059669] flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-900 truncate flex-1">{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={() => { setResumeFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#059669]/50 hover:bg-emerald-50/40 transition-all text-xs font-bold text-slate-600 hover:text-[#059669] cursor-pointer"
                  >
                    <Upload size={16} />
                    Click to upload your resume
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                By applying you agree to GetJobsCanada's privacy policy. Your information is shared only with the hiring employer.
              </p>

              <Button
                type="submit"
                disabled={loading || uploading}
                className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold rounded-2xl h-11 w-full mt-1 disabled:opacity-60 shadow-md"
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
