'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/axios';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  status: string;
  createdAt: string;
  job?: { title: string; location: string; employer?: { employerProfile?: { companyName?: string } } };
}

interface Profile {
  phone?: string;
  location?: string;
  bio?: string;
  portfolioUrl?: string;
  cvUrl?: string;
  profileCompletion?: number;
  skills?: { id: string; name: string; level: string }[];
  experience?: { id: string; jobTitle: string; company: string; startDate: string; endDate?: string; isCurrent: boolean }[];
  education?: { id: string; institution: string; degree: string; startDate: string; endDate?: string; isCurrent: boolean }[];
}

type Tab = 'overview' | 'profile' | 'skills' | 'experience' | 'education';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  REVIEWED: 'bg-blue-500/20 text-blue-400',
  ACCEPTED: 'bg-green-500/20 text-green-400',
  REJECTED: 'bg-red-500/20 text-red-400',
};

export default function CandidateDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);

  const [profileForm, setProfileForm] = useState({ phone: '', location: '', bio: '', portfolioUrl: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: 'INTERMEDIATE' });
  const [expForm, setExpForm] = useState({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' });
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrent: false, grade: '' });

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) { router.push('/auth/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [appsRes, profileRes] = await Promise.all([
        apiClient.get('/applications/my-applications'),
        apiClient.get('/profile/candidate'),
      ]);
      if (appsRes.data.success) setApplications(appsRes.data.data || []);
      if (profileRes.data.success) {
        setProfile(profileRes.data.profile);
        const p = profileRes.data.profile;
        setProfileForm({ phone: p.phone || '', location: p.location || '', bio: p.bio || '', portfolioUrl: p.portfolioUrl || '' });
      }
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await apiClient.put('/profile/candidate', profileForm);
      setProfile(res.data.profile);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const uploadCv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    setCvUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);
      const res = await apiClient.post('/profile/candidate/cv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(prev => ({ ...prev, cvUrl: res.data.cvUrl }));
      toast.success('CV uploaded successfully!');
    } catch { toast.error('Failed to upload CV'); }
    finally { setCvUploading(false); }
  };

  const addSkill = async () => {
    if (!skillForm.name.trim()) return;
    try {
      const res = await apiClient.post('/profile/candidate/skills', skillForm);
      setProfile(prev => ({ ...prev, skills: [...(prev.skills || []), res.data.skill] }));
      setSkillForm({ name: '', level: 'INTERMEDIATE' });
      toast.success('Skill added!');
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed to add skill'); }
  };

  const removeSkill = async (skillId: string) => {
    try {
      await apiClient.delete(`/profile/candidate/skills/${skillId}`);
      setProfile(prev => ({ ...prev, skills: prev.skills?.filter(s => s.id !== skillId) }));
    } catch { toast.error('Failed to remove skill'); }
  };

  const addExperience = async () => {
    if (!expForm.jobTitle || !expForm.company || !expForm.startDate) { toast.error('Job title, company and start date are required'); return; }
    try {
      const res = await apiClient.post('/profile/candidate/experience', expForm);
      setProfile(prev => ({ ...prev, experience: [res.data.experience, ...(prev.experience || [])] }));
      setExpForm({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' });
      toast.success('Experience added!');
    } catch { toast.error('Failed to add experience'); }
  };

  const deleteExperience = async (id: string) => {
    try {
      await apiClient.delete(`/profile/candidate/experience/${id}`);
      setProfile(prev => ({ ...prev, experience: prev.experience?.filter(e => e.id !== id) }));
    } catch { toast.error('Failed to delete experience'); }
  };

  const addEducation = async () => {
    if (!eduForm.institution || !eduForm.degree || !eduForm.startDate) { toast.error('Institution, degree and start date are required'); return; }
    try {
      const res = await apiClient.post('/profile/candidate/education', eduForm);
      setProfile(prev => ({ ...prev, education: [res.data.education, ...(prev.education || [])] }));
      setEduForm({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrent: false, grade: '' });
      toast.success('Education added!');
    } catch { toast.error('Failed to add education'); }
  };

  const deleteEducation = async (id: string) => {
    try {
      await apiClient.delete(`/profile/candidate/education/${id}`);
      setProfile(prev => ({ ...prev, education: prev.education?.filter(e => e.id !== id) }));
    } catch { toast.error('Failed to delete education'); }
  };

  const completion = profile.profileCompletion || 0;
  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'profile', label: 'Profile' },
    { key: 'skills', label: 'Skills' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Candidate Dashboard</h1>
          <Link href="/jobs" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm hover:from-blue-600 hover:to-purple-600">
            Browse Jobs
          </Link>
        </div>

        {/* Profile completion banner */}
        {completion < 80 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-yellow-400 font-medium">Complete your profile to stand out to employers</p>
              <div className="mt-2 w-64 bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
              <p className="text-yellow-400/70 text-sm mt-1">{completion}% complete</p>
            </div>
            <button onClick={() => setTab('profile')} className="text-yellow-400 text-sm underline">Complete now →</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-white">{applications.length}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Accepted</p>
                <p className="text-3xl font-bold text-green-400">{applications.filter(a => a.status === 'ACCEPTED').length}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Profile Completion</p>
                <p className="text-3xl font-bold text-blue-400">{completion}%</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">My Applications</h2>
              </div>
              <div className="p-6">
                {loading ? <p className="text-gray-400">Loading...</p>
                  : applications.length === 0
                  ? <p className="text-gray-400">No applications yet. <Link href="/jobs" className="text-blue-400 hover:text-blue-300">Browse jobs</Link></p>
                  : <div className="space-y-3">
                    {applications.map(app => (
                      <div key={app.id} className="border border-gray-700 rounded-lg p-4 flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{app.job?.title || 'Unknown Job'}</p>
                          <p className="text-gray-400 text-sm">{app.job?.location}</p>
                          <p className="text-gray-500 text-xs mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || 'bg-gray-700 text-gray-300'}`}>{app.status}</span>
                      </div>
                    ))}
                  </div>}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input type="text" value={profileForm.location} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="City, Country" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Portfolio / Website</label>
                <input type="url" value={profileForm.portfolioUrl} onChange={e => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="https://yourwebsite.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Short Bio</label>
              <textarea rows={4} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Tell employers about yourself, your goals and what makes you unique..." />
            </div>
            <button onClick={saveProfile} disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>

            {/* CV Upload */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-white font-medium mb-3">CV / Resume (PDF only, max 5MB)</h3>
              {profile.cvUrl && (
                <div className="flex items-center gap-3 mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-green-400 text-sm font-medium">CV uploaded</p>
                    <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-xs hover:underline">View CV →</a>
                  </div>
                </div>
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors">
                <span>{cvUploading ? 'Uploading...' : profile.cvUrl ? '🔄 Replace CV' : '📤 Upload CV'}</span>
                <input type="file" accept=".pdf" className="hidden" onChange={uploadCv} disabled={cvUploading} />
              </label>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {tab === 'skills' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map(skill => (
                <span key={skill.id} className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                  {skill.name} <span className="text-blue-400/60 text-xs">• {skill.level}</span>
                  <button onClick={() => removeSkill(skill.id)} className="text-blue-400/60 hover:text-red-400 ml-1">×</button>
                </span>
              ))}
              {!profile.skills?.length && <p className="text-gray-400">No skills added yet.</p>}
            </div>
            <div className="flex gap-3 flex-wrap">
              <input type="text" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                className="flex-1 min-w-48 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g. React, Python, Photoshop" />
              <select value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })}
                className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
              <button onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Skill</button>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {tab === 'experience' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Add Work Experience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={expForm.jobTitle} onChange={e => setExpForm({ ...expForm, jobTitle: e.target.value })}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Job Title *" />
                <input type="text" value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Company *" />
                <input type="text" value={expForm.location} onChange={e => setExpForm({ ...expForm, location: e.target.value })}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Location" />
                <div className="flex gap-2 items-center">
                  <input type="month" value={expForm.startDate} onChange={e => setExpForm({ ...expForm, startDate: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" />
                  {!expForm.isCurrent && (
                    <input type="month" value={expForm.endDate} onChange={e => setExpForm({ ...expForm, endDate: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" />
                  )}
                  <label className="flex items-center gap-1 text-gray-400 text-sm whitespace-nowrap">
                    <input type="checkbox" checked={expForm.isCurrent} onChange={e => setExpForm({ ...expForm, isCurrent: e.target.checked })} /> Current
                  </label>
                </div>
                <textarea value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                  className="md:col-span-2 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500 resize-none" rows={3} placeholder="Description of your role and achievements..." />
              </div>
              <button onClick={addExperience} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Experience</button>
            </div>
            <div className="space-y-3">
              {(profile.experience || []).map(exp => (
                <div key={exp.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between">
                  <div>
                    <p className="text-white font-medium">{exp.jobTitle}</p>
                    <p className="text-blue-400 text-sm">{exp.company}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(exp.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })} —{' '}
                      {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : ''}
                    </p>
                  </div>
                  <button onClick={() => deleteExperience(exp.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
              ))}
              {!profile.experience?.length && <p className="text-gray-400">No experience added yet.</p>}
            </div>
          </div>
        )}

        {/* Education Tab */}
        {tab === 'education' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Add Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={eduForm.institution} onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Institution *" />
                <input type="text" value={eduForm.degree} onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Degree *" />
                <input type="text" value={eduForm.fieldOfStudy} onChange={e => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Field of Study" />
                <input type="text" value={eduForm.grade} onChange={e => setEduForm({ ...eduForm, grade: e.target.value })}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" placeholder="Grade / GPA (optional)" />
                <div className="flex gap-2 items-center">
                  <input type="month" value={eduForm.startDate} onChange={e => setEduForm({ ...eduForm, startDate: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" />
                  {!eduForm.isCurrent && (
                    <input type="month" value={eduForm.endDate} onChange={e => setEduForm({ ...eduForm, endDate: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500" />
                  )}
                  <label className="flex items-center gap-1 text-gray-400 text-sm whitespace-nowrap">
                    <input type="checkbox" checked={eduForm.isCurrent} onChange={e => setEduForm({ ...eduForm, isCurrent: e.target.checked })} /> Current
                  </label>
                </div>
              </div>
              <button onClick={addEducation} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Education</button>
            </div>
            <div className="space-y-3">
              {(profile.education || []).map(edu => (
                <div key={edu.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between">
                  <div>
                    <p className="text-white font-medium">{edu.degree}</p>
                    <p className="text-blue-400 text-sm">{edu.institution}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(edu.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })} —{' '}
                      {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : ''}
                    </p>
                  </div>
                  <button onClick={() => deleteEducation(edu.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
              ))}
              {!profile.education?.length && <p className="text-gray-400">No education added yet.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
