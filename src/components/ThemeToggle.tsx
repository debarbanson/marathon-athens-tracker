'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Simple ThemeProvider for managing theme
const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)

  // Initialize theme based on user preference or system preference
  useEffect(() => {
    // Check if user has a theme preference saved
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Toggle theme
  const handleToggle = () => {
    setDarkMode(!darkMode)
    
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-md hover:bg-white/90 dark:hover:bg-slate-800/90 transition-colors duration-200"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      tabIndex={0}
    >
      <motion.div
        animate={{ rotate: darkMode ? 40 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        )}
      </motion.div>
    </button>
  )
}

export default ThemeToggle 