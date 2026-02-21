'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Find Jobs', href: '/jobs' },
  { name: 'Companies', href: '/companies' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setIsAuthenticated(true);
        setUserRole(decoded.role);
        
        // Try to get name from token or use email
        if (decoded.firstName) {
          setUserName(decoded.firstName);
        } else {
          setUserName(decoded.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for storage events (in case token is updated in another tab)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for login/logout
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    toast.success('Logged out successfully');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
    
    router.push('/');
  };

  const getDashboardLink = () => {
    if (userRole === 'ADMIN') return '/dashboard/admin';
    if (userRole === 'EMPLOYER') return '/dashboard/employer';
    return '/dashboard/candidate';
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                ProHire
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-300 hover:text-blue-400'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="text-gray-300 hover:text-blue-400 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                {userRole === 'EMPLOYER' && (
                  <Link
                    href="/jobs/post"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium text-sm shadow-lg shadow-green-500/25"
                  >
                    Post a Job
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {userName?.charAt(0).toUpperCase()}
                    </span>
                    <span className="max-w-[100px] truncate">{userName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700 hidden group-hover:block">
                    <Link
                      href={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-purple-400 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium text-sm shadow-lg shadow-purple-500/25"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-blue-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-blue-400 bg-gray-800'
                    : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                } block px-4 py-2 text-base font-medium rounded-md transition-colors duration-200`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="px-4 py-2 text-gray-300 font-medium">
                    Logged in as {userName}
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {userRole === 'EMPLOYER' && (
                    <Link
                      href="/jobs/post"
                      className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post a Job
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-2 pt-4 border-t border-gray-800">
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-purple-400 hover:bg-gray-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-md mx-4 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}