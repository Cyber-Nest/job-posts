"use client";

import { useCallback, useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import {
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronLeft,
  Save,
  RefreshCw,
  Edit2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobData {
  _id: string;
  jobId: string;
  title: string;
  city: string;
  province: string;
  status: string;
  postDate: string;
  postedAt: string;
  category?: string;
  employmentType?: string;
}

export default function AdminEmployerJobsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: employerId } = use(params);

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [employerName, setEmployerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Local state for dates
  const [dates, setDates] = useState<Record<string, string>>({});

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get(`/admin/employers/${employerId}/jobs`);
      if (data.success) {
        setJobs(data.jobs || []);
        setEmployerName(data.employerName || data.employer?.orgName || "Employer");
        
        const initialDates: Record<string, string> = {};
        data.jobs.forEach((job: JobData) => {
          const d = job.postDate || job.postedAt;
          if (d) {
            initialDates[job._id] = new Date(d).toISOString().split('T')[0];
          }
        });
        setDates(initialDates);
      } else {
        toast.error(data.error || "Failed to load jobs.");
      }
    } catch {
      toast.error("Network error loading jobs.");
    } finally {
      setLoading(false);
    }
  }, [employerId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDateChange = (id: string, value: string) => {
    setDates((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateDate = async (jobId: string) => {
    const newDate = dates[jobId];
    if (!newDate) return;

    setUpdatingId(jobId);
    try {
      const data = await apiClient.put(`/admin/jobs/${jobId}`, { postDate: newDate });
      if (data.success) {
        toast.success("Job post date updated!");
        setEditingId(null);
      } else {
        toast.error(data.error || "Failed to update date.");
      }
    } catch {
      toast.error("Network error updating date.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/employers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Employers
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {employerName ? `${employerName}'s Job Posts` : "Employer Jobs"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage job post dates and view detailed information.
            </p>
          </div>
          <button
            onClick={fetchJobs}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Location & Type
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Post Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading jobs...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    <Briefcase className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                    No jobs found for this employer.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm">{job.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">ID: {job.jobId}</span>
                          {job.category && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-emerald-600 font-medium">{job.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700">
                          <MapPin size={13} className="text-slate-400" />
                          {job.city}, {job.province}
                        </div>
                        {job.employmentType && (
                          <div className="text-xs font-medium text-slate-500 pl-5">
                            {job.employmentType}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide
                        ${job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                          job.status === 'expired' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                          'bg-slate-100 text-slate-700 border border-slate-200'}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative flex items-center">
                          <Calendar className="absolute left-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="date"
                            value={dates[job._id] || ""}
                            onChange={(e) => handleDateChange(job._id, e.target.value)}
                            disabled={editingId !== job._id}
                            className={`pl-9 pr-3 py-1.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors
                              ${editingId === job._id 
                                ? "border-emerald-500 bg-white focus:ring-1 focus:ring-emerald-500 text-slate-900 shadow-sm" 
                                : "border-transparent bg-transparent text-slate-600 cursor-not-allowed"
                              }
                            `}
                          />
                        </div>
                        {editingId === job._id ? (
                          <button
                            onClick={() => handleUpdateDate(job._id)}
                            disabled={updatingId === job._id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 text-xs font-bold shadow-sm"
                          >
                            {updatingId === job._id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(job._id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-semibold bg-white shadow-sm"
                          >
                            <Edit2 size={13} />
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/jobs/${job._id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                        View Post
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
