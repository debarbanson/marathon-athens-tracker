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

  // Canvas settings for the chart
  const chartHeight = 120;
  const chartWidth = isMobile ? 280 : 300;
  
  // Calculate chart points
  const getChartPoints = () => {
    const history = [...cardioData.history];
    
    // Find min and max values with padding
    const allValues = history.map(item => item.value);
    const minValue = Math.floor(Math.min(...allValues) - 1);
    const maxValue = Math.ceil(Math.max(...allValues) + 1);
    const valueRange = maxValue - minValue;
    
    // Convert to chart points
    return history.map((item, index) => {
      const x = (index / (history.length - 1)) * chartWidth;
      // Invert Y because SVG coordinates go from top to bottom
      const y = chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
      return { x, y, value: item.value, date: item.date };
    });
  };
  
  const chartPoints = getChartPoints();
  
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
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded text-sm">
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
        <div className="relative mb-2 mt-2">
          <svg width={chartWidth} height={chartHeight} className="overflow-visible">
            {/* Background grid lines - horizontal */}
            {[0, 1, 2, 3].map((i) => (
              <line 
                key={`grid-h-${i}`}
                x1="0" 
                y1={i * (chartHeight / 3)} 
                x2={chartWidth} 
                y2={i * (chartHeight / 3)}
                stroke="#e2e8f0" 
                strokeWidth="1"
                className="dark:stroke-slate-700"
              />
            ))}
            
            {/* Reference range backgrounds */}
            {cardioData.referenceRanges.map((range, index) => {
              // We need to convert the VO2max range to chart coordinates
              const allValues = cardioData.history.map(item => item.value);
              const minValue = Math.floor(Math.min(...allValues) - 1);
              const maxValue = Math.ceil(Math.max(...allValues) + 1);
              const valueRange = maxValue - minValue;
              
              // Only show ranges that are in view
              if (range.max < minValue || range.min > maxValue) return null;
              
              // Calculate the visible portion of this range
              const visibleMin = Math.max(range.min, minValue);
              const visibleMax = Math.min(range.max, maxValue);
              
              // Convert to y coordinates (inverted for SVG)
              const yTop = chartHeight - ((visibleMax - minValue) / valueRange) * chartHeight;
              const yBottom = chartHeight - ((visibleMin - minValue) / valueRange) * chartHeight;
              const height = yBottom - yTop;
              
              // Skip if not visible
              if (height <= 0) return null;
              
              // Color based on category
              let color;
              if (range.label === "Poor") color = "rgba(239, 68, 68, 0.1)";
              else if (range.label === "Below Average") color = "rgba(251, 146, 60, 0.1)";
              else if (range.label === "Average") color = "rgba(250, 204, 21, 0.1)";
              else if (range.label === "Above Average") color = "rgba(34, 197, 94, 0.1)";
              else if (range.label === "Excellent") color = "rgba(6, 182, 212, 0.1)";
              else color = "rgba(79, 70, 229, 0.1)";
              
              return (
                <rect
                  key={`range-${index}`}
                  x="0"
                  y={yTop}
                  width={chartWidth}
                  height={height}
                  fill={color}
                  className="dark:opacity-50"
                />
              );
            })}
            
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
              <div key={`label-${i}`} style={{ position: 'absolute', left: `${point.x}px`, transform: 'translateX(-50%)' }}>
                {formatDate(point.date)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Reference Range Legend */}
        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-wrap gap-2 justify-center">
            {cardioData.referenceRanges.map((range, index) => {
              let bgColor = "bg-gray-100";
              let textColor = "text-gray-800";
              
              if (range.label === "Poor") {
                bgColor = "bg-red-100 dark:bg-red-900/30";
                textColor = "text-red-800 dark:text-red-200";
              } else if (range.label === "Below Average") {
                bgColor = "bg-orange-100 dark:bg-orange-900/30";
                textColor = "text-orange-800 dark:text-orange-200";
              } else if (range.label === "Average") {
                bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
                textColor = "text-yellow-800 dark:text-yellow-200";
              } else if (range.label === "Above Average") {
                bgColor = "bg-green-100 dark:bg-green-900/30";
                textColor = "text-green-800 dark:text-green-200";
              } else if (range.label === "Excellent") {
                bgColor = "bg-cyan-100 dark:bg-cyan-900/30";
                textColor = "text-cyan-800 dark:text-cyan-200";
              } else if (range.label === "Superior") {
                bgColor = "bg-indigo-100 dark:bg-indigo-900/30";
                textColor = "text-indigo-800 dark:text-indigo-200";
              }
              
              const isCurrentRange = cardioData.current >= range.min && cardioData.current <= range.max;
              
              return (
                <div 
                  key={`legend-${index}`} 
                  className={`${bgColor} ${textColor} px-2 py-0.5 rounded text-xs ${isCurrentRange ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                >
                  {range.label} ({range.min}-{range.max})
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