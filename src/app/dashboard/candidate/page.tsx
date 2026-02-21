'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/axios';
import toast from 'react-hot-toast';
import { ApiResponse, Application } from '@/types/api';

export default function CandidateDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Application[]>>('/applications/my-applications');
      if (response.data.success && response.data.data) {
        setApplications(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Candidate Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-1">Total Applications</h3>
            <p className="text-3xl font-bold text-white">{applications.length}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">My Applications</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : applications.length === 0 ? (
              <p className="text-gray-400">No applications yet. <Link href="/jobs" className="text-blue-400 hover:text-blue-300">Browse jobs</Link></p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold">{app.job?.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">Status: {app.status}</p>
                    <p className="text-gray-400 text-sm">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
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