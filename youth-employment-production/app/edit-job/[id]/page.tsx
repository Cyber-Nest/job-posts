"use client";

import { useEffect, useState } from "react";
import { useParams } from "@/router";
import PostAJobPage from "@/views/post-a-job";
import { apiClient } from "@/lib/api-client";

export default function EditJobPage() {
  const { id } = useParams();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    apiClient
      .get(`/jobs/${id}`)
      .then((data) => {
        const job = data?.data || data?.job;
        if (job) {
          setJobData(job);
        } else {
          setError("Job not found.");
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err?.message || "Failed to load job data");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-4 text-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <PostAJobPage editMode={true} initialData={jobData} />;
}
