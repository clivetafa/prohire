'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/axios';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  status: string;
  location: string;
  type: string;
  createdAt: string;
  _count?: { applications: number };
}

interface Profile {
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  description?: string;
  location?: string;
  foundedYear?: number;
  profileCompletion?: number;
}

type Tab = 'overview' | 'profile';

const STATUS_COLORS: Record<string, string> = {
  PENDING_APPROVAL: 'bg-yellow-500/20 text-yellow-400',
  APPROVED: 'bg-green-500/20 text-green-400',
  REJECTED: 'bg-red-500/20 text-red-400',
  DRAFT: 'bg-gray-500/20 text-gray-400',
  CLOSED: 'bg-gray-500/20 text-gray-400',
};

export default function EmployerDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    companyName: '', industry: '', companySize: '', website: '', description: '', location: '', foundedYear: '',
  });

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) { router.push('/auth/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [jobsRes, profileRes] = await Promise.all([
        apiClient.get('/jobs/employer/my-jobs'),
        apiClient.get('/profile/employer'),
      ]);
      if (jobsRes.data.success) setJobs(jobsRes.data.data || []);
      if (profileRes.data.success) {
        const p = profileRes.data.profile;
        setProfile(p);
        setProfileForm({
          companyName: p.companyName || '', industry: p.industry || '',
          companySize: p.companySize || '', website: p.website || '',
          description: p.description || '', location: p.location || '',
          foundedYear: p.foundedYear?.toString() || '',
        });
      }
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await apiClient.put('/profile/employer', {
        ...profileForm,
        foundedYear: profileForm.foundedYear ? parseInt(profileForm.foundedYear) : undefined,
      });
      setProfile(res.data.profile);
      toast.success('Company profile updated!');
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const completion = profile.profileCompletion || 0;
  const totalApps = jobs.reduce((sum, j) => sum + (j._count?.applications || 0), 0);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Employer Dashboard</h1>
            {profile.companyName && <p className="text-gray-400 mt-1">{profile.companyName}</p>}
          </div>
          <Link href="/jobs/post" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm hover:from-blue-600 hover:to-purple-600">
            + Post New Job
          </Link>
        </div>

        {/* Profile completion banner */}
        {completion < 80 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-blue-400 font-medium">Complete your company profile to attract better candidates</p>
              <div className="mt-2 w-64 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
              <p className="text-blue-400/70 text-sm mt-1">{completion}% complete</p>
            </div>
            <button onClick={() => setTab('profile')} className="text-blue-400 text-sm underline">Complete now →</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg mb-8 w-fit">
          {(['overview', 'profile'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t === 'overview' ? 'Overview' : 'Company Profile'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Jobs Posted</p>
                <p className="text-3xl font-bold text-white">{jobs.length}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-blue-400">{totalApps}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-green-400">{jobs.filter(j => j.status === 'APPROVED').length}</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">My Job Postings</h2>
              </div>
              <div className="p-6">
                {loading ? <p className="text-gray-400">Loading...</p>
                  : jobs.length === 0
                  ? <p className="text-gray-400">No jobs posted yet. <Link href="/jobs/post" className="text-blue-400 hover:text-blue-300">Post your first job</Link></p>
                  : <div className="space-y-3">
                    {jobs.map(job => (
                      <div key={job.id} className="border border-gray-700 rounded-lg p-4 flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{job.title}</p>
                          <p className="text-gray-400 text-sm">{job.location} · {job.type?.replace('_', ' ')}</p>
                          <p className="text-gray-500 text-xs mt-1">{job._count?.applications || 0} applications · {new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[job.status] || 'bg-gray-700 text-gray-300'}`}>
                          {job.status?.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>}
              </div>
            </div>
          </div>
        )}

        {/* Company Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                <input type="text" value={profileForm.companyName} onChange={e => setProfileForm({ ...profileForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Industry</label>
                <input type="text" value={profileForm.industry} onChange={e => setProfileForm({ ...profileForm, industry: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Technology, Finance, Healthcare..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company Size</label>
                <select value={profileForm.companySize} onChange={e => setProfileForm({ ...profileForm, companySize: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="">Select size</option>
                  <option value="1-10">1–10 employees</option>
                  <option value="11-50">11–50 employees</option>
                  <option value="51-200">51–200 employees</option>
                  <option value="201-500">201–500 employees</option>
                  <option value="501-1000">501–1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Website</label>
                <input type="url" value={profileForm.website} onChange={e => setProfileForm({ ...profileForm, website: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="https://yourcompany.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input type="text" value={profileForm.location} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="City, Country" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Founded Year</label>
                <input type="number" value={profileForm.foundedYear} onChange={e => setProfileForm({ ...profileForm, foundedYear: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="2010" min="1800" max="2030" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Description</label>
              <textarea rows={5} value={profileForm.description} onChange={e => setProfileForm({ ...profileForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Tell candidates about your company, mission, culture and what makes you a great place to work..." />
            </div>
            <button onClick={saveProfile} disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Company Profile'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
