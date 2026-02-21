'use client';

import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, CurrencyDollarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import apiClient from '@/lib/api/axios';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  status: string;
  viewCount: number;
  createdAt: string;
  employer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    applications: number;
  };
}

interface ApiResponse {
  success: boolean;
  data: Job[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get<ApiResponse>('/jobs');
      console.log('API Response:', response.data); // For debugging
      
      // The data is directly in response.data.data
      if (response.data.success && Array.isArray(response.data.data)) {
        setJobs(response.data.data);
      } else {
        setJobs([]);
        toast.error('No jobs found');
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast.error(error.response?.data?.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm) ||
      job.employer?.firstName?.toLowerCase().includes(searchTerm) ||
      job.employer?.lastName?.toLowerCase().includes(searchTerm) ||
      job.location?.toLowerCase().includes(searchTerm);
    
    const matchesType = selectedType ? job.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with gradient */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Next Job</h1>
          <p className="text-gray-300 text-lg">
            Browse through {jobs.length} job listing{jobs.length !== 1 ? 's' : ''} from top companies
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Job Type Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedType === ''
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              All Jobs
            </button>
            {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedType === type
                    ? `bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {jobs.length > 0 && (
          <div className="mb-4 text-gray-400">
            Found <span className="text-white font-semibold">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
              <p className="text-gray-400 text-lg">No jobs found matching your search</p>
              {(search || selectedType) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedType('');
                  }}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="group bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-blue-500/50">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
                          {job.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-gray-400">
                          <BuildingOfficeIcon className="h-4 w-4" />
                          <span>
                            {job.employer?.firstName} {job.employer?.lastName}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                        {job.type?.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex items-center gap-1 text-gray-300">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      {job.salaryMin > 0 && job.salaryMax > 0 && (
                        <div className="flex items-center gap-1 text-gray-300">
                          <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-300">
                        <span className="text-sm">{job.experience} Level</span>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-400 line-clamp-2">{job.description}</p>
                    
                    {job._count && job._count.applications > 0 && (
                      <p className="mt-2 text-sm text-gray-500">
                        {job._count.applications} applicant{job._count.applications !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end">
                    <span className="text-sm text-gray-500 mb-3">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
                    >
                      View Details
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}