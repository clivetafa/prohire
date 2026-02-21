import { HeartIcon, RocketLaunchIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const values = [
  {
    name: 'Innovation',
    description: 'We constantly push boundaries to create the best job-seeking experience.',
    icon: RocketLaunchIcon,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Community',
    description: 'Building a strong community of job seekers and employers.',
    icon: UserGroupIcon,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Integrity',
    description: 'We operate with transparency and honesty in everything we do.',
    icon: HeartIcon,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Global Impact',
    description: 'Connecting talent with opportunities worldwide.',
    icon: GlobeAltIcon,
    color: 'from-orange-500 to-red-500',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ProHire</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're on a mission to revolutionize the way people find jobs and companies hire talent.
              Founded in 2024, we've helped thousands of job seekers land their dream positions.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400 text-lg">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.name} className="text-center">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} mb-4 shadow-lg`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.name}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">25K+</div>
            <div className="text-gray-400">Job Seekers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">500+</div>
            <div className="text-gray-400">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">10K+</div>
            <div className="text-gray-400">Jobs Posted</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-2">50+</div>
            <div className="text-gray-400">Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
}