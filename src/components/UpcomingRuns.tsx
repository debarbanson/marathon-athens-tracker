'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Interface for upcoming runs data
interface UpcomingRun {
  id: string
  displayDate: string
  type: string
  distance: number
  predictedTime: string
  tag: string
}

// Interface for completed runs data
interface CompletedRun {
  id: string
  date: string
  type: string
  distance: number
  duration: string
  pace: string
  didOverachieveDistance: boolean
  didOverachievePace: boolean
}

interface RunsProps {
  upcomingRunsData: UpcomingRun[]
  completedRunsData: CompletedRun[]
  maxRuns?: number
}

// Helper function to fix month names
const fixMonthName = (dateStr: string): string => {
  const corrections: Record<string, string> = {
    'Aprilil': 'April',
    'Marchch': 'March',
    'Januaryry': 'January',
    'Januray': 'January',
    'Februaryry': 'February',
    'Febuary': 'February',
    'Maych': 'May',
    'Junene': 'June',
    'Julyly': 'July',
    'Augustst': 'August',
    'Septemberber': 'September',
    'Septmeber': 'September',
    'Octoberber': 'October',
    'Ocotber': 'October',
    'Novemberber': 'November',
    'Novermber': 'November',
    'Decemberber': 'December',
    'Decemeber': 'December'
  };

  let fixedString = dateStr;
  Object.entries(corrections).forEach(([incorrect, correct]) => {
    const regex = new RegExp(incorrect, 'gi');
    fixedString = fixedString.replace(regex, correct);
  });
  
  return fixedString;
}

// Helper function to normalize date formats for comparison
const normalizeDate = (dateStr: string): Date => {
  // Already in ISO format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const date = new Date(dateStr)
    // Set time to midnight for proper comparison
    date.setHours(0, 0, 0, 0)
    return date
  }

  // Format like "Monday, April 1st"
  if (dateStr.includes(',')) {
    const fixedDateStr = fixMonthName(dateStr)
    const parts = fixedDateStr.split(', ')[1].split(' ')
    const month = parts[0]
    let day = parts[1].replace(/st|nd|rd|th/, '')
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const monthIndex = months.findIndex(m => m === month)
    
    if (monthIndex !== -1) {
      const currentYear = new Date().getFullYear()
      const date = new Date(currentYear, monthIndex, parseInt(day))
      date.setHours(0, 0, 0, 0)
      return date
    }
  }
  
  // Default to current date if parsing fails
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

// Format date for display with day of week and month+day
const formatDisplayDate = (dateString: string) => {
  // First fix any month name issues
  const fixedDateString = fixMonthName(dateString);
  
  // Parse the date string
  const date = new Date(fixedDateString);
  
  return {
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
    monthAndDay: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  };
};

// Get color based on run type
const getRunColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    'Long Run': '#4338ca', // indigo
    'Easy': '#0891b2', // cyan
    'Recovery': '#84cc16', // lime
    'Tempo': '#ea580c', // orange
    'Speed': '#dc2626', // red
    'Race': '#7c3aed', // violet
  };
  
  return typeColors[type] || '#6b7280'; // default gray if type not found
};

// Helper function to determine color based on run type
const getRunTypeColor = (type: string) => {
  const typeLower = type.toLowerCase()
  
  if (typeLower.includes('easy') || typeLower.includes('recovery')) {
    return 'bg-green-100 text-green-800'
  } else if (typeLower.includes('tempo') || typeLower.includes('threshold')) {
    return 'bg-orange-100 text-orange-800'
  } else if (typeLower.includes('interval') || typeLower.includes('speed')) {
    return 'bg-red-100 text-red-800'
  } else if (typeLower.includes('long')) {
    return 'bg-blue-100 text-blue-800'
  } else {
    return 'bg-purple-100 text-purple-800'
  }
}

const CompletedRunRow = ({ run }: { run: CompletedRun }) => {
  const { dayOfWeek, monthAndDay } = formatDisplayDate(run.date);
  const color = getRunColor(run.type);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-xl p-4 mb-4 bg-white shadow-md dark:bg-gray-800 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        {/* Date Column */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {dayOfWeek}
          </span>
          <span className="font-semibold">
            {monthAndDay}
          </span>
        </div>
        
        {/* Run Details Column */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Type</span>
            <span className="font-medium">{run.type}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Distance</span>
            <span className="font-medium">{run.distance} km</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Time</span>
            <span className="font-medium">{run.duration}</span>
          </div>
          
          <div className="flex flex-col col-span-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">Pace</span>
            <span className="font-medium">{run.pace}/km</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UpcomingRuns: React.FC<RunsProps> = ({ 
  upcomingRunsData, 
  completedRunsData, 
  maxRuns = 6 
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')
  
  // Filter out completed runs from upcoming runs based on date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredUpcomingRuns = upcomingRunsData.filter(run => {
    // Normalize dates for comparison
    const runDate = normalizeDate(run.displayDate)
    
    // Check if this run is in the future
    return runDate >= today
  })

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
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="upcoming-runs"
            >
              <div className="space-y-4">
                {filteredUpcomingRuns.length > 0 ? (
                  filteredUpcomingRuns.map((run) => {
                    const dateComponents = run.displayDate.split(', ')
                    const dayOfWeek = dateComponents[0]
                    let monthAndDay = fixMonthName(dateComponents[1])
                    
                    // Get run color based on type
                    const runColor = getRunTypeColor(run.type)
                    
                    return (
                      <div key={run.id} className="run-card animate-fade-in p-4 bg-white rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-gray-500 text-sm">{dayOfWeek}</div>
                            <div className="font-semibold">{monthAndDay}</div>
                          </div>
                          <div className={`run-type text-sm font-semibold px-2 py-1 rounded ${runColor}`}>
                            {run.type}
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                          <div className="text-sm">
                            <span className="text-gray-500">Distance:</span> {run.distance}km
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Time:</span> {run.predictedTime}
                          </div>
                          <div className="text-sm col-span-2">
                            <span className="text-gray-500">Goal:</span> {run.tag}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No upcoming runs scheduled
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="completed-runs"
            >
              <div className="space-y-4">
                {completedRunsData.length > 0 ? (
                  completedRunsData.map((run) => (
                    <CompletedRunRow key={run.id} run={run} />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No completed runs yet
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default UpcomingRuns 