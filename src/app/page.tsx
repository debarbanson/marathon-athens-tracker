'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapSection, 
  StatsPanel, 
  UpcomingRuns, 
  MotivationalSection, 
  ThemeToggle 
} from '@/components'

// Import real data from JSON files
import statsData from '@/data/stats.json'
import upcomingRunsData from '@/data/upcomingRuns.json'
import completedRunsData from '@/data/completedRuns.json'

// Format number with Dutch-style formatting: period for thousands, comma for decimals
const formatNumber = (num: number): string => {
  // Convert to string, replace decimal point with temporary placeholder
  const parts = num.toString().split('.');
  
  // Format the integer part with periods for thousands
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  // If there's a decimal part, add it back with a comma
  return parts.length > 1 ? parts[0] + "," + parts[1] : parts[0];
};

export default function Home() {
  // Calculate progress percentage
  const progressPercentage = (statsData.totalDistance / statsData.totalGoalDistance) * 100
  
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false)
  
  // Update mobile state based on window size
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768)
      }
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <main className="flex flex-col w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Title Bar - Always on top */}
      <div className="w-full sticky top-0 bg-white dark:bg-slate-800 shadow-md z-20 py-4 px-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-slate-800 dark:text-slate-100">
          My Journey to <span className="text-blue-600 dark:text-blue-400">Marathon, Greece</span>
        </h1>
        <ThemeToggle />
      </div>
      
      {/* Main content area */}
      <div className={`flex ${isMobile ? 'flex-col' : 'h-[calc(100vh-72px)]'}`}>
        {/* Map section - full width on mobile, 2/3 on desktop */}
        <div className={`${isMobile ? 'w-full h-[60vh]' : 'w-2/3 h-full'} relative`}>
          <MapSection 
            totalDistance={statsData.totalDistance} 
            totalGoalDistance={statsData.totalGoalDistance}
            progressPercentage={progressPercentage}
            showProgressBar={false} // Hide the progress bar on the map since we'll show it in the content section
          />
        </div>
        
        {/* Content section - full width on mobile, 1/3 on desktop */}
        <div className={`${isMobile ? 'w-full overflow-y-auto' : 'w-1/3 h-full'} bg-white dark:bg-slate-800 shadow-lg z-10 flex flex-col`}>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Stats Panel */}
            <StatsPanel 
              totalDistance={statsData.totalDistance}
              averagePace={statsData.averagePace}
              totalRuns={statsData.totalRuns}
              totalTime={statsData.totalTime}
              totalGoalDistance={statsData.totalGoalDistance}
            />
            
            {/* Progress Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Progress Toward Goal ({Math.round(progressPercentage)}%)</span>
                <span>{formatNumber(statsData.totalDistance)} of {formatNumber(statsData.totalGoalDistance)} km</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-blue-600 dark:bg-blue-500"
                />
              </div>
            </div>
            
            {/* Upcoming Runs */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Run Schedule</h2>
              <UpcomingRuns 
                upcomingRunsData={upcomingRunsData} 
                completedRunsData={completedRunsData} 
                maxRuns={6} 
              />
            </div>
            
            {/* Motivational Section */}
            <MotivationalSection />
          </div>
        </div>
      </div>
    </main>
  )
} 