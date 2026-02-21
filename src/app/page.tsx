import Link from 'next/link';
import { BriefcaseIcon, UserGroupIcon, DocumentTextIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Thousands of Jobs',
    description: 'Browse through thousands of job listings from top companies worldwide.',
    icon: BriefcaseIcon,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Top Employers',
    description: 'Connect with leading companies looking for talent like you.',
    icon: UserGroupIcon,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Easy Applications',
    description: 'Apply with one click using your saved profile and resume.',
    icon: DocumentTextIcon,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Track Progress',
    description: 'Monitor your application status and get real-time updates.',
    icon: ChartBarIcon,
    color: 'from-orange-500 to-red-500',
  },
];

const stats = [
  { name: 'Active Jobs', value: '10,000+', color: 'text-blue-400' },
  { name: 'Companies', value: '500+', color: 'text-purple-400' },
  { name: 'Successful Hires', value: '25,000+', color: 'text-green-400' },
  { name: 'Countries', value: '50+', color: 'text-orange-400' },
];

export default function Home() {
  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Find Your Dream Job
              </span>
              <br />
              <span className="text-white">Today</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Connect with top employers, upload your resume, and take the next step in your career. 
              Thousands of jobs waiting for you.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/jobs"
                className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Browse Jobs
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/register?role=employer"
                className="text-lg font-semibold leading-6 text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1"
              >
                Post a Job 
                <span aria-hidden="true" className="text-purple-400">→</span>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="flex flex-col items-center p-6 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700">
                  <dt className="text-sm font-semibold leading-6 text-gray-400">{stat.name}</dt>
                  <dd className={`order-first text-4xl font-bold tracking-tight ${stat.color}`}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Why Choose ProHire
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to land your dream job
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              We provide all the tools and resources you need to find the perfect position and advance your career.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col items-center text-center">
                  <dt className="text-base font-semibold leading-7 text-white">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="relative isolate overflow-hidden">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to take the next step?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Join thousands of job seekers who have found their dream jobs through ProHire.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/auth/register"
                  className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/25"
                >
                  Get Started Today
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-semibold leading-6 text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Learn more <span aria-hidden="true" className="text-purple-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}