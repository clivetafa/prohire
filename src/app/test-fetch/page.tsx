'use client';

import { useEffect, useState } from 'react';

export default function TestFetchPage() {
  const [health, setHealth] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test with fetch instead of axios
        const response = await fetch('http://localhost:5000/api/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setHealth(data);
        setError('');
      } catch (err: any) {
        setError(err.message);
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return <div className="p-8">Testing connection with fetch...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Fetch API Test</h1>
      
      {error ? (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">❌ Connection Failed</h2>
          <p className="text-red-600">Error: {error}</p>
          <p className="text-gray-700 mt-4">Make sure your backend is running on port 5000</p>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-xl font-semibold text-green-700 mb-2">✅ Backend Connected!</h2>
          <p className="text-gray-700">API URL: http://localhost:5000/api</p>
          <pre className="bg-white p-4 mt-4 rounded-lg overflow-auto">
            {JSON.stringify(health, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}