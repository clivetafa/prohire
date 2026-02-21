'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/axios';
import { MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ApiResponse, Job } from '@/types/api';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${params.id}`);
        if (response.data.data) {
          setJob(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to load job details');
        router.push('/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Job not found</h2>
          <Link href="/jobs" className="text-blue-400 hover:text-blue-300">
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href="/jobs" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to jobs
        </Link>

        {/* Job header */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">{job.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
              {job.type.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              {job.experience}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-300">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              {job.location}
            </div>

            <div className="flex items-center text-gray-300">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
            </div>

            <div className="flex items-center text-gray-300">
              <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
              Posted by {job.employer.firstName} {job.employer.lastName}
            </div>

            <div className="flex items-center text-gray-300">
              <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
              {job._count?.applications ?? 0} applicant(s)
            </div>
          </div>

          <button
            onClick={() => router.push(`/apply/${job.id}`)}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 font-medium"
          >
            Apply for this position
          </button>
        </div>

        {/* Job details */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-line">{job.description}</p>
          </div>

          {job.responsibilities && (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Responsibilities</h2>
              <p className="text-gray-300 whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}

          {job.requirements && (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
              <p className="text-gray-300 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {job.benefits && (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Benefits</h2>
              <p className="text-gray-300 whitespace-pre-line">{job.benefits}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}