'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/axios';
import toast from 'react-hot-toast';
import { ApiResponse, Job } from '@/types/api';

export default function EmployerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchJobs();
  }, [router]);

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Job[]>>('/jobs/employer/my-jobs');
      if (response.data.success && response.data.data) {
        setJobs(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Employer Dashboard</h1>
          <Link
            href="/jobs/post"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
          >
            Post New Job
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-1">Total Jobs Posted</h3>
            <p className="text-3xl font-bold text-white">{jobs.length}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">My Job Postings</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-400">No jobs posted yet. <Link href="/jobs/post" className="text-blue-400 hover:text-blue-300">Post your first job</Link></p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold">{job.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">Status: {job.status}</p>
                    <p className="text-gray-400 text-sm">Applications: {job._count?.applications || 0}</p>
                    <p className="text-gray-400 text-sm">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}