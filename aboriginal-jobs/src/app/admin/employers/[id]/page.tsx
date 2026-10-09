"use client";

import { useCallback, useEffect, useState, use } from "react";
import toast from "react-hot-toast";
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
      const res = await fetch(`/api/admin/employers/${employerId}/jobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        setEmployerName(data.employerName);
        
        const initialDates: Record<string, string> = {};
        data.jobs.forEach((job: JobData) => {
          // Format date for date input type="date" (YYYY-MM-DD)
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
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postDate: newDate }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Job post date updated!");
        setEditingId(null); // Lock it back
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/employers"
          className="inline-flex items-center gap-1 text-sm text-[#6B3A2A]/70 hover:text-[#C8782A] font-medium transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Employers
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {employerName ? `${employerName}'s Job Posts` : "Employer Jobs"}
            </h1>
            <p className="text-sm text-[#6B3A2A]/60 mt-1">
              Manage job post dates and view detailed information.
            </p>
          </div>
          <button
            onClick={fetchJobs}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-[#C8782A]/20 text-[#6B3A2A] hover:bg-[#FAF5EE] transition-all bg-white"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#C8782A]/20 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF5EE]/50 border-b border-[#C8782A]/20">
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider">
                  Location & Type
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider">
                  Post Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B3A2A]/70 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8782A]/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B3A2A]/60">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C8782A]" />
                    Loading jobs...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B3A2A]/60">
                    <Briefcase className="w-8 h-8 mx-auto mb-3 text-[#C8782A]/40" />
                    No jobs found for this employer.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-[#FAF5EE]/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#1C1C1C]">{job.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#6B3A2A]/60">ID: {job.jobId}</span>
                          {job.category && (
                            <>
                              <span className="text-[#6B3A2A]/30">•</span>
                              <span className="text-xs text-[#C8782A] font-medium">{job.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-[#1C1C1C]/80">
                          <MapPin size={14} className="text-[#C8782A]/70" />
                          {job.city}, {job.province}
                        </div>
                        {job.employmentType && (
                          <div className="text-xs font-medium text-[#6B3A2A]/70 pl-5">
                            {job.employmentType}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                        ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                          job.status === 'expired' ? 'bg-rose-100 text-rose-700' : 
                          'bg-slate-100 text-slate-700'}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative flex items-center">
                          <Calendar className="absolute left-2.5 w-4 h-4 text-[#C8782A]/60" />
                          <input
                            type="date"
                            value={dates[job._id] || ""}
                            onChange={(e) => handleDateChange(job._id, e.target.value)}
                            disabled={editingId !== job._id}
                            className={`pl-9 pr-3 py-1.5 rounded-lg border text-sm outline-none transition-colors
                              ${editingId === job._id 
                                ? "border-[#C8782A]/50 bg-white focus:ring-2 focus:ring-[#C8782A]/40 text-[#1C1C1C]" 
                                : "border-transparent bg-transparent text-[#6B3A2A]/70 cursor-not-allowed"
                              }
                            `}
                          />
                        </div>
                        {editingId === job._id ? (
                          <button
                            onClick={() => handleUpdateDate(job._id)}
                            disabled={updatingId === job._id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C8782A] text-white hover:bg-[#B06820] transition-colors disabled:opacity-50 text-xs font-bold uppercase tracking-wider shadow-sm"
                          >
                            {updatingId === job._id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            Update
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(job._id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#C8782A]/30 text-[#C8782A] hover:bg-[#FAF5EE] transition-colors text-xs font-bold uppercase tracking-wider bg-white"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/jobs/${job._id}`}
                        target="blank"
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-[#FAF5EE] text-[#C8782A] hover:bg-[#C8782A] hover:text-white border border-[#C8782A]/20 transition-all shadow-sm"
                      >
                        View Post
                        <ExternalLink size={14} />
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
