'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/axios';
import toast from 'react-hot-toast';
import { ApiResponse, LoginResponse } from '@/types/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', formData);
      const responseData = response.data;
      
      console.log('Login response:', responseData);
      
      if (responseData.success) {
        // Handle token storage - check different possible response structures
        let token = '';
        let userRole = 'CANDIDATE';
        
        if (responseData.accessToken) {
          token = responseData.accessToken;
        } else if (responseData.data?.accessToken) {
          token = responseData.data.accessToken;
        } else if (responseData.token) {
          token = responseData.token;
        }
        
        if (token) {
          localStorage.setItem('accessToken', token);
          // Dispatch event to notify navbar of auth change
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-change'));
          }
        }
        
        // Get user role
        if (responseData.user?.role) {
          userRole = responseData.user.role;
        } else if (responseData.data?.user?.role) {
          userRole = responseData.data.user.role;
        } else if (responseData.role) {
          userRole = responseData.role;
        }
        
        toast.success('Login successful!');
        
        // Redirect based on role
        if (userRole === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (userRole === 'EMPLOYER') {
          router.push('/dashboard/employer');
        } else {
          router.push('/dashboard/candidate');
        }
      } else {
        toast.error(responseData.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Network error - please check if backend is running';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-blue-400 hover:text-blue-300">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}