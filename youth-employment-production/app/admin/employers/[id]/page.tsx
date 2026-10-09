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
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Employers
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {employerName ? `${employerName}'s Job Posts` : "Employer Jobs"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage job post dates and view detailed information.
            </p>
          </div>
          <button
            onClick={fetchJobs}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-blue-200 text-slate-600 hover:bg-blue-50 transition-all bg-white"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 border-b border-blue-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Location & Type
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Post Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading jobs...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Briefcase className="w-8 h-8 mx-auto mb-3 text-blue-200" />
                    No jobs found for this employer.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{job.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500">ID: {job.jobId}</span>
                          {job.category && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-blue-600 font-medium">{job.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <MapPin size={14} className="text-blue-500" />
                          {job.city}
                        </div>
                        {job.employmentType && (
                          <div className="text-xs font-medium text-slate-500 pl-5">
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
                          <Calendar className="absolute left-2.5 w-4 h-4 text-blue-400" />
                          <input
                            type="date"
                            value={dates[job._id] || ""}
                            onChange={(e) => handleDateChange(job._id, e.target.value)}
                            disabled={editingId !== job._id}
                            className={`pl-9 pr-3 py-1.5 rounded-lg border text-sm outline-none transition-colors
                              ${editingId === job._id 
                                ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-100 text-slate-900" 
                                : "border-transparent bg-transparent text-slate-500 cursor-not-allowed"
                              }
                            `}
                          />
                        </div>
                        {editingId === job._id ? (
                          <button
                            onClick={() => handleUpdateDate(job._id)}
                            disabled={updatingId === job._id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 text-xs font-bold uppercase tracking-wider shadow-sm"
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
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors text-xs font-bold uppercase tracking-wider bg-white"
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
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all shadow-sm"
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
