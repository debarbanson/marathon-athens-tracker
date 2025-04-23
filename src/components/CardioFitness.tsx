'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CardioFitnessProps {
  cardioData: {
    current: number;
    currentAge: number;
    gender: string;
    referenceRanges: {
      label: string;
      min: number;
      max: number;
    }[];
    history: {
      date: string;
      value: number;
    }[];
  }
}

const CardioFitness: React.FC<CardioFitnessProps> = ({ cardioData }) => {
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

  // Calculate improvements
  const firstMeasurement = cardioData.history[0].value;
  const lastMeasurement = cardioData.current;
  const improvementPercent = ((lastMeasurement - firstMeasurement) / firstMeasurement * 100).toFixed(1);
  const daysOfMeasurement = Math.round((new Date(cardioData.history[cardioData.history.length - 1].date).getTime() - 
                            new Date(cardioData.history[0].date).getTime()) / (1000 * 60 * 60 * 24));
  
  // Find current fitness category
  const currentCategory = cardioData.referenceRanges.find(range => 
    cardioData.current >= range.min && cardioData.current <= range.max
  )?.label || "Unknown";
  
  // Find initial fitness category
  const initialCategory = cardioData.referenceRanges.find(range => 
    firstMeasurement >= range.min && firstMeasurement <= range.max
  )?.label || "Unknown";

  // Canvas settings for the chart - use full width
  const chartHeight = 120;
  // Use 100% width minus a small padding
  const chartWidth = isMobile ? '100%' : '100%';
  
  // Calculate chart points
  const getChartPoints = () => {
    const history = [...cardioData.history];
    
    // Find min and max values with padding
    const allValues = history.map(item => item.value);
    const minValue = Math.floor(Math.min(...allValues) - 1);
    const maxValue = Math.ceil(Math.max(...allValues) + 1);
    const valueRange = maxValue - minValue;
    
    // Calculate actual width in pixels
    const chartElement = document.getElementById('vo2max-chart');
    const actualWidth = chartElement?.clientWidth || 300;
    
    // Convert to chart points
    return history.map((item, index) => {
      const x = (index / (history.length - 1)) * actualWidth;
      // Invert Y because SVG coordinates go from top to bottom
      const y = chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
      return { x, y, value: item.value, date: item.date };
    });
  };
  
  // Update chart points when component mounts or resizes
  const [chartPoints, setChartPoints] = useState<Array<{x: number, y: number, value: number, date: string}>>([]);
  const [svgWidth, setSvgWidth] = useState(300);
  
  useEffect(() => {
    const updateChart = () => {
      const chartElement = document.getElementById('vo2max-chart');
      if (chartElement) {
        const actualWidth = chartElement.clientWidth;
        setSvgWidth(actualWidth);
        
        const history = [...cardioData.history];
        
        // Find min and max values with padding
        const allValues = history.map(item => item.value);
        const minValue = Math.floor(Math.min(...allValues) - 1);
        const maxValue = Math.ceil(Math.max(...allValues) + 1);
        const valueRange = maxValue - minValue;
        
        // Convert to chart points
        const points = history.map((item, index) => {
          const x = (index / (history.length - 1)) * actualWidth;
          // Invert Y because SVG coordinates go from top to bottom
          const y = chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
          return { x, y, value: item.value, date: item.date };
        });
        
        setChartPoints(points);
      }
    };
    
    // Initial update
    updateChart();
    
    // Update on resize
    const handleResize = () => {
      updateChart();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardioData.history]);
  
  // Create SVG path for the line
  const createLinePath = () => {
    if (chartPoints.length < 2) return '';
    
    return chartPoints.reduce((path, point, i) => {
      if (i === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, '');
  };
  
  // Format date to display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Cardio Fitness</h2>
      
      <div className="flex flex-col">
        {/* Current VO2max value and improvement */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{lastMeasurement}</span>
            <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">VO₂max</span>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-sm">
            +{improvementPercent}% in {daysOfMeasurement} days
          </div>
        </div>
        
        {/* Category change information */}
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {initialCategory !== currentCategory ? (
            <span>Improved from <span className="font-medium">{initialCategory}</span> to <span className="font-medium">{currentCategory}</span></span>
          ) : (
            <span>Currently in <span className="font-medium">{currentCategory}</span> range</span>
          )}
        </div>
        
        {/* Line Chart */}
        <div id="vo2max-chart" className="relative mb-2 mt-2 w-full">
          <svg width="100%" height={chartHeight} className="overflow-visible" preserveAspectRatio="none">
            {/* Background grid lines - horizontal */}
            {[0, 1, 2, 3].map((i) => (
              <line 
                key={`grid-h-${i}`}
                x1="0" 
                y1={i * (chartHeight / 3)} 
                x2="100%" 
                y2={i * (chartHeight / 3)}
                stroke="#e2e8f0" 
                strokeWidth="1"
                className="dark:stroke-slate-700"
              />
            ))}
            
            {/* Background with subtle blue gradient */}
            <rect
              x="0"
              y="0"
              width="100%"
              height={chartHeight}
              fill="url(#blueGradient)"
              className="opacity-10 dark:opacity-5"
            />
            
            {/* Define gradient */}
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            
            {/* Line Path */}
            <path
              d={createLinePath()}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-blue-400"
            />
            
            {/* Data Points */}
            {chartPoints.map((point, i) => (
              <circle
                key={`point-${i}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#3b82f6"
                strokeWidth="2"
                className="dark:fill-slate-800 dark:stroke-blue-400"
              />
            ))}
          </svg>
          
          {/* X-axis labels (dates) */}
          <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
            {chartPoints.map((point, i) => (
              <div key={`label-${i}`} style={{ position: 'absolute', left: `${(i / (chartPoints.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}>
                {formatDate(point.date)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Reference Range Legend */}
        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-wrap gap-3 justify-center">
            {cardioData.referenceRanges.map((range, index) => {
              // Blue scale for all categories - intensity increases with category
              const baseIntensity = 100 + (index * 100);
              // Ensure we don't exceed tailwind's color scale (100-900)
              const lightModeIntensity = Math.min(baseIntensity, 500);
              const darkModeIntensity = Math.max(900 - (index * 100), 600);
              
              const isCurrentRange = cardioData.current >= range.min && cardioData.current <= range.max;
              
              return (
                <div 
                  key={`legend-${index}`} 
                  className={`flex flex-col items-center ${isCurrentRange ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded' : ''}`}
                >
                  <div className={`px-3 py-1 rounded-t text-xs font-medium 
                    bg-blue-${lightModeIntensity}/10 dark:bg-blue-${darkModeIntensity}/30
                    text-blue-800 dark:text-blue-200`}>
                    {range.label}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 px-1">
                    {range.min}-{range.max}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-center italic text-slate-500 dark:text-slate-400">
          VO₂max is the maximum rate of oxygen your body can use during exercise.
        </div>
      </div>
    </div>
  )
}

export default CardioFitness 