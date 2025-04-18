'use client'

import { useState, useEffect } from 'react';

const VisitorCounter = () => {
  const [count, setCount] = useState('--');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const UPSTASH_URL = 'https://noted-whale-14377.upstash.io';
    const UPSTASH_TOKEN = 'ATgpAAIjcDFkZWFmZjQ0N2M2NDU0MDUwOWJmZTZlOTNiM2VmZDk4MnAxMA';
    const COUNTER_KEY = 'athens_visits';

    // Call Upstash Redis REST API to increment the counter
    fetch(`${UPSTASH_URL}/incr/${COUNTER_KEY}`, {
      headers: { 
        'Authorization': `Bearer ${UPSTASH_TOKEN}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update counter');
        return res.json();
      })
      .then(data => {
        if (data && typeof data.result === 'number') {
          setCount(data.result.toLocaleString());
          setIsLoading(false);
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(err => {
        console.error('Visitor counter error:', err);
        setCount('many');
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-100/90 dark:bg-blue-900/80 text-blue-800 dark:text-blue-300 shadow-md border border-blue-200 dark:border-blue-800">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
      <span className={`text-xs sm:text-sm font-medium ${isLoading ? 'animate-pulse' : ''}`}>
        <span className="hidden sm:inline">Running this journey with </span>
        <span className="sm:hidden">With </span>
        {count} supporters
      </span>
    </div>
  );
};

export default VisitorCounter; 