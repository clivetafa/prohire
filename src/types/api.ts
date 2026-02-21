export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  accessToken?: string;
  token?: string;
  user?: User;
  role?: string;
  jobs?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken?: string;
  token?: string;
  user?: User;
  data?: {
    accessToken?: string;
    user?: User;
  };
}

export interface RegisterResponse {
  success: boolean;
  accessToken?: string;
  token?: string;
  user?: User;
  data?: {
    accessToken?: string;
    user?: User;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  location: string;
  type: string;
  experience: string;
  status: string;
  salaryMin: number;
  salaryMax: number;
  viewCount: number;
  employerId: string;
  createdAt: string;
  updatedAt: string;
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

export interface JobsResponse {
  success: boolean;
  data?: Job[];
  jobs?: Job[];
}

// =============================
// Application Types
// =============================
export interface Application {
  id: string;
  coverLetter: string | null;
  resumeUrl: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  notes: string | null;
  jobId: string;
  candidateId: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  candidate?: User;
}

export interface ApplicationsResponse {
  success: boolean;
  data?: Application[];
  applications?: Application[];
}

// =============================
// Dashboard Stats Types
// =============================
export interface DashboardStats {
  users: {
    total: number;
    employers: number;
    candidates: number;
    newLast7Days: number;
  };
  jobs: {
    total: number;
    pending: number;
    approved: number;
    newLast7Days: number;
    byType: Array<{
      _count: number;
      type: string;
    }>;
  };
  applications: {
    total: number;
    newLast7Days: number;
    byStatus: Array<{
      _count: number;
      status: string;
    }>;
  };
  topEmployers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    _count: {
      jobs: number;
    };
  }>;
  topJobs: Array<{
    id: string;
    title: string;
    employer: {
      firstName: string;
      lastName: string;
      email: string;
    };
    _count: {
      applications: number;
    };
  }>;
}

export interface DashboardStatsResponse {
  success: boolean;
  data?: DashboardStats;
  stats?: DashboardStats;
}