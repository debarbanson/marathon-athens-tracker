'use client'

import Link from 'next/link';

const ConnectWithMe = () => {
  return (
    <Link 
      href="https://www.debdc.nl" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 sm:gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-md"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
      <span className="text-xs sm:text-sm font-medium">Connect with me</span>
    </Link>
  );
};

export default ConnectWithMe; 