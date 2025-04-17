'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface StatsPanelProps {
  totalDistance: number
  averagePace: string
  totalRuns: number
  totalTime: string
  totalGoalDistance: number
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ 
  title, 
  value, 
  icon,
  colorClass
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700"
  >
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</h3>
      <span className="text-xl text-blue-600 dark:text-blue-400">{icon}</span>
    </div>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </motion.div>
)

const StatsPanel: React.FC<StatsPanelProps> = ({
  totalDistance,
  averagePace,
  totalRuns,
  totalTime,
  totalGoalDistance
}) => {  
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard 
        title="Distance Run" 
        value={`${totalDistance} km`} 
        icon={
          <>
            <img src="./icons/running_man_icon_lightblue.png" alt="Runner" className="w-7 h-7 block dark:hidden" />
            <img src="./icons/running_man_icon_darkblue.png" alt="Runner" className="w-7 h-7 hidden dark:block" />
          </>
        }
        colorClass="text-blue-600 dark:text-blue-400"
      />
      
      <StatCard 
        title="Average Pace" 
        value={`${averagePace} min/km`} 
        icon={
          <>
            <img src="./icons/clock_icon_darkblue.png" alt="Clock" className="w-7 h-7 block dark:hidden" />
            <img src="./icons/clock_icon_lightblue.png" alt="Clock" className="w-7 h-7 hidden dark:block" />
          </>
        }
        colorClass="text-blue-600 dark:text-blue-400"
      />
      
      <StatCard 
        title="Total Runs" 
        value={totalRuns} 
        icon={
          <>
            <img src="./icons/total_runs_icon_lightblue.png" alt="Total Runs" className="w-7 h-7 block dark:hidden" />
            <img src="./icons/total_runs_icon_darkblue.png" alt="Total Runs" className="w-7 h-7 hidden dark:block" />
          </>
        }
        colorClass="text-blue-600 dark:text-blue-400"
      />
      
      <StatCard 
        title="Total Time" 
        value={totalTime} 
        icon={
          <>
            <img src="./icons/Hourglass_icon_lightblue.png" alt="Hourglass" className="w-7 h-7 block dark:hidden" />
            <img src="./icons/Hourglass_icon_darkblue.png" alt="Hourglass" className="w-7 h-7 hidden dark:block" />
          </>
        }
        colorClass="text-blue-600 dark:text-blue-400"
      />
    </div>
  )
}

export default StatsPanel 