'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface TabsProps {
  children: React.ReactElement[]
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0)
  
  // Extract tab titles from children
  const tabTitles = React.Children.map(children, child => 
    child.props.title || 'Untitled'
  )
  
  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setActiveTab(index)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200">
        {tabTitles.map((title, index) => (
          <button
            key={index}
            className={`py-3 px-4 text-sm font-medium flex-1 transition-colors duration-200 
              ${activeTab === index 
                ? 'text-greek-blue border-b-2 border-greek-blue' 
                : 'text-gray-500 hover:text-greek-blue hover:bg-gray-50'
              }`}
            onClick={() => handleTabClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            tabIndex={0}
            aria-label={`${title} tab`}
            aria-selected={activeTab === index}
          >
            {title}
          </button>
        ))}
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {children[activeTab]}
        </motion.div>
      </div>
    </div>
  )
}

export default Tabs 