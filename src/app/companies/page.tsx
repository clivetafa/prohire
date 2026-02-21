'use client';

import { BuildingOfficeIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

const companies = [
  {
    id: '1',
    name: 'Tech Corp',
    industry: 'Technology',
    location: 'San Francisco, CA',
    employees: '500-1000',
    openJobs: 12,
    logo: 'TC',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    name: 'Startup Inc',
    industry: 'SaaS',
    location: 'New York, NY',
    employees: '50-200',
    openJobs: 5,
    logo: 'SI',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: '3',
    name: 'Enterprise Co',
    industry: 'Finance',
    location: 'Chicago, IL',
    employees: '1000+',
    openJobs: 8,
    logo: 'EC',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: '4',
    name: 'Creative Studio',
    industry: 'Design',
    location: 'Remote',
    employees: '10-50',
    openJobs: 3,
    logo: 'CS',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: '5',
    name: 'HealthTech Solutions',
    industry: 'Healthcare',
    location: 'Boston, MA',
    employees: '200-500',
    openJobs: 7,
    logo: 'HS',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: '6',
    name: 'Green Energy Inc',
    industry: 'Renewable Energy',
    location: 'Denver, CO',
    employees: '100-300',
    openJobs: 4,
    logo: 'GE',
    color: 'from-teal-500 to-green-500',
  },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(search.toLowerCase()) ||
    company.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-2">Top Companies</h1>
          <p className="text-gray-300 text-lg">Discover amazing companies hiring right now</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search companies by name or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="group bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-purple-500/50"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${company.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {company.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition truncate">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{company.industry}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-400">
                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                  {company.location}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-gray-500" />
                  {company.employees} employees
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Open positions</span>
                  <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {company.openJobs}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}