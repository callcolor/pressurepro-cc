'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        {error.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
            <p className="text-sm text-red-600 font-mono break-all">{error.message}</p>
          </div>
        )}
        <div className="flex gap-3">
          <Button onClick={reset} fullWidth>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')} fullWidth>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
