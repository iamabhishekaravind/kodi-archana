import { useState, useEffect } from 'react';

interface VisitorCounterProps {
  className?: string;
}

export function VisitorCounter({ className = '' }: VisitorCounterProps) {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAndIncrementVisitorCount = async () => {
      try {
        // Replace with your Cloudflare Worker URL
        const WORKER_URL = 'https://your-worker.your-subdomain.workers.dev/visitor-count';
        
        // Call your Cloudflare Worker to increment and get visitor count
        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'increment',
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count || 1);
        } else {
          console.warn('Failed to fetch visitor count from worker');
          setVisitorCount(1);
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
        setVisitorCount(1);
      } finally {
        setLoading(false);
      }
    };

    fetchAndIncrementVisitorCount();
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <div className="text-gray-500 text-xs">
          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
          <span className="ml-2">Loading visitor count...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1 text-gray-500 text-xs">
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
          />
        </svg>
        <span>
          Visitors: <span className="font-semibold text-gray-600">{formatNumber(visitorCount)}</span>
        </span>
      </div>
    </div>
  );
}