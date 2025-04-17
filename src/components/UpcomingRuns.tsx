'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

// Interface for upcoming runs data
interface UpcomingRun {
  id: number
  date: string
  displayDate: string
  type: string
  distance: number
  tag: string
  predictedTime?: string
}

// Interface for completed runs data
interface CompletedRun {
  id: number
  date: string
  displayDate: string
  type: string
  distance: number
  plannedDistance: number
  tag: string
  duration: string
  pace: string
  predictedTime: string
  predictedPace: string
  overachievedDistance: boolean
  overachievedPace: boolean
}

interface RunsProps {
  upcomingRunsData: UpcomingRun[]
  completedRunsData: CompletedRun[]
  maxRuns?: number
}

// Get run type color
const getRunTypeColor = (type: string) => {
  const colors = {
    short: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100',
    long: 'bg-blue-300 text-blue-950 dark:bg-blue-700 dark:text-blue-50',
    interval: 'bg-blue-400 text-blue-950 dark:bg-blue-600 dark:text-white',
    recovery: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
  }
  
  return colors[type.toLowerCase() as keyof typeof colors] || colors.default
}

// Format date from ISO string to display format with full month name
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Format time string to display HH:MM:SS for times over 60 minutes
const formatTime = (timeString: string) => {
  if (!timeString) return '';
  
  const parts = timeString.split(':').map(Number);
  
  // Check if it's already in HH:MM:SS format
  if (parts.length === 3) {
    return timeString;
  }
  
  // Check if minutes exceed 60
  if (parts.length === 2 && parts[0] >= 60) {
    const hours = Math.floor(parts[0] / 60);
    const minutes = parts[0] % 60;
    const seconds = parts[1];
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  // Return original format if not over 60 minutes
  return timeString;
}

const UpcomingRuns: React.FC<RunsProps> = ({ 
  upcomingRunsData, 
  completedRunsData, 
  maxRuns = 6 
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')
  
  // Filter upcoming runs to only show future dates
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for proper comparison
  
  // Parse dates correctly regardless of format (DD-MM-YYYY or ISO)
  const parseDate = (dateString: string): Date => {
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const parts = dateString.split('-')
      // Check if first part is a 4-digit year (YYYY-MM-DD) or day (DD-MM-YYYY)
      if (parts[0].length === 4) {
        return new Date(dateString) // Already in YYYY-MM-DD format
      } else {
        // Convert from DD-MM-YYYY to YYYY-MM-DD
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      }
    }
    return new Date(dateString)
  }
  
  // Filter upcoming runs to only include future dates
  const upcomingRuns = upcomingRunsData.filter(run => {
    const runDate = parseDate(run.date)
    return runDate >= today
  })
  
  // Show all completed runs
  const completedRuns = completedRunsData
  
  // Fix common month format issues
  const fixMonthFormat = (displayDate: string): string => {
    return displayDate
      .replace('Aprilil', 'April')
      .replace('Apr', 'April')
  }
  
  // Helper to format time difference
  const getTimeDiff = (actual: string, predicted: string) => {
    if (!predicted) return null
    
    const actualParts = actual.split(':').map(Number)
    const predictedParts = predicted.split(':').map(Number)
    
    // Convert to seconds for comparison
    const actualSeconds = actualParts[0] * 60 * 60 + actualParts[1] * 60 + (actualParts[2] || 0)
    const predictedSeconds = predictedParts[0] * 60 * 60 + predictedParts[1] * 60 + (predictedParts[2] || 0)
    
    // Calculate difference in seconds
    const diffSeconds = actualSeconds - predictedSeconds
    
    // Format the difference
    if (Math.abs(diffSeconds) < 60) {
      return `${Math.abs(diffSeconds)}s ${diffSeconds >= 0 ? 'slower' : 'faster'}`
    }
    
    const diffMinutes = Math.floor(Math.abs(diffSeconds) / 60)
    const remainingSeconds = Math.abs(diffSeconds) % 60
    
    return `${diffMinutes}:${String(remainingSeconds).padStart(2, '0')} ${diffSeconds >= 0 ? 'slower' : 'faster'}`
  }

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex mb-4 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 font-medium text-sm md:text-base ${
            activeTab === 'upcoming'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-4 font-medium text-sm md:text-base ${
            activeTab === 'completed'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Completed
        </button>
      </div>
      
      {/* Tab content - scrollable container */}
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {activeTab === 'upcoming' ? (
          <ul className="space-y-4">
            {upcomingRuns.length > 0 ? (
              upcomingRuns.map((run, index) => (
                <motion.li 
                  key={run.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                  className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-600 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-base md:text-lg text-slate-800 dark:text-slate-200">
                        {fixMonthFormat(run.displayDate)}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium">{run.type}</p>
                      {run.predictedTime && (
                        <p className="text-sm mt-1.5 text-blue-600 dark:text-blue-400">
                          Est. time: {formatTime(run.predictedTime)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{run.distance} km</span>
                      <span className={`text-xs md:text-sm px-3 py-1 mt-1.5 rounded-full font-medium ${getRunTypeColor(run.tag)}`}>
                        {run.tag}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No upcoming runs scheduled
              </div>
            )}
          </ul>
        ) : (
          <ul className="space-y-4">
            {completedRuns.length > 0 ? (
              completedRuns.map((run, index) => (
                <motion.li 
                  key={run.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                  className={`bg-slate-50 dark:bg-slate-900 rounded-lg py-3 px-4 border-l-4 border-blue-${
                    run.overachievedPace ? '600' : '500'
                  } dark:border-blue-${
                    run.overachievedPace ? '500' : '600'
                  } shadow-sm`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-base md:text-lg text-slate-800 dark:text-slate-200">
                        {fixMonthFormat(run.displayDate)}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium mb-1">
                        {run.type} 
                        <span className="text-slate-500 dark:text-slate-400 text-xs md:text-sm ml-1.5">
                          ({run.plannedDistance} km planned)
                        </span>
                      </p>
                      <div className="space-y-1 md:space-y-2">
                        {/* Pace row */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-center">
                          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base whitespace-nowrap md:w-1/3 md:self-center">
                            Pace: {run.pace} min/km
                          </span>
                          <div className="mt-0.5 md:mt-0 md:ml-4 md:flex-1 md:flex md:justify-center">
                            {run.overachievedPace ? (
                              <span className="text-blue-600 dark:text-blue-400 flex items-center text-sm md:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                                  <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                                </svg>
                                Faster than predicted
                              </span>
                            ) : (
                              <span className="text-orange-600 dark:text-orange-400 flex items-center text-sm md:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                                  <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.797l2.22-2.22a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06l2.22 2.22V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
                                </svg>
                                Slower than predicted
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Time row */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-center">
                          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base whitespace-nowrap md:w-1/3 md:self-center">
                            Time: {formatTime(run.duration)}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-sm md:text-base mt-0.5 md:mt-0 md:ml-4 md:flex-1 md:text-center">
                            vs. predicted: {formatTime(run.predictedTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <div className="flex items-baseline">
                        <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{run.distance}</span>
                        <span className="ml-1 text-sm font-medium text-blue-600 dark:text-blue-400">km</span>
                      </div>
                      <span className={`text-xs md:text-sm px-3 py-1 mt-1.5 rounded-full font-medium ${getRunTypeColor(run.tag)}`}>
                        {run.tag}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No completed runs yet
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default UpcomingRuns 