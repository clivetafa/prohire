import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import axiosInstance from '@/lib/api/axios';

interface User {
  id: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

interface LoginResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface UseAuthOptions {
  middleware?: 'auth' | 'guest';
  redirectIfAuthenticated?: string;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<User> => {
  const response: any = await axiosInstance.get(url);
  return response?.data?.data;
};

export function useAuth(options?: UseAuthOptions) {
  const router = useRouter();
  const { middleware, redirectIfAuthenticated } = options || {};

  const { data: user, error, mutate } = useSWR<User>(
    '/auth/me',
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) {
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'EMPLOYER':
          router.push('/dashboard/employer');
          break;
        default:
          router.push('/dashboard/candidate');
      }
    }

    if (middleware === 'auth' && error) {
      router.push('/auth/login');
    }
  }, [user, error, middleware, redirectIfAuthenticated, router]);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response: any = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      await mutate();
      return { success: true, data: response?.data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
    mutate(undefined);
    router.push('/');
  };

  const register = async (userData: any): Promise<LoginResponse> => {
    try {
      const response: any = await axiosInstance.post(
        '/auth/register',
        userData
      );

      return { success: true, data: response?.data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || 'Registration failed',
      };
    }
  };

  return {
    user,
    isLoading: !error && !user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
}