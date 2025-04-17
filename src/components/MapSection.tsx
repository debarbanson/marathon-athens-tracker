'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface MapSectionProps {
  totalDistance: number
  totalGoalDistance: number
  progressPercentage: number
  showProgressBar?: boolean
}

const MapSection: React.FC<MapSectionProps> = ({
  totalDistance,
  totalGoalDistance,
  progressPercentage,
  showProgressBar = true
}) => {
  // State to track viewport size
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  // Update viewport state based on window size
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setViewport('mobile')
        } else if (window.innerWidth < 1024) {
          setViewport('tablet')
        } else {
          setViewport('desktop')
        }
      }
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Always use the desktop image for better clarity, but size it appropriately
  const getImageSrc = () => {
    return './images/Background_1200_800_Website.png'
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800">
      {/* Map background */}
      <div className="relative w-full flex-1 max-w-full max-h-full flex items-center justify-center overflow-hidden">
        <div className="relative w-auto h-auto max-w-full max-h-full p-2">
          <Image 
            src={getImageSrc()} 
            alt="Map showing the route from Roelofarendsveen to Marathon"
            width={1200}
            height={800}
            className="object-contain max-h-[95vh] w-auto"
            priority
          />
        </div>
      </div>
      
      {/* Map attribution */}
      <div className="text-center w-full py-2 text-xs text-slate-600 dark:text-slate-400">
        Map visualization of journey from Roelofarendsveen to Marathon
      </div>
      
      {/* Progress indicator at bottom - only show if showProgressBar is true */}
      {showProgressBar && (
        <div className="absolute left-6 right-6 bottom-10 z-10">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-lg shadow-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Roelofarendsveen</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Marathon, Greece</div>
            </div>
            
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-blue-600 dark:bg-blue-500"
              />
            </div>
            
            <div className="mt-2 text-sm text-center font-medium text-slate-800 dark:text-slate-200">
              {totalDistance} km of {totalGoalDistance} km 
              ({Math.round(progressPercentage)}% complete)
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapSection 