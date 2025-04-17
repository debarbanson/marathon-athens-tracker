'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Sample quotes data
const quotes = [
  {
    id: 1,
    text: "The man who can drive himself further once the effort gets painful is the man who will win.",
    author: "Roger Bannister"
  },
  {
    id: 2,
    text: "Run when you can, walk if you have to, crawl if you must; just never give up.",
    author: "Dean Karnazes"
  },
  {
    id: 3,
    text: "The marathon can humble you.",
    author: "Bill Rodgers"
  },
  {
    id: 4,
    text: "The more I train, the more I realize I have more speed in me.",
    author: "Usain Bolt"
  },
  {
    id: 5,
    text: "I run to see who has the most guts.",
    author: "Steve Prefontaine"
  },
  {
    id: 6,
    text: "There is no victory greater than victory over oneself.",
    author: "Ancient Greek Proverb"
  },
  {
    id: 7,
    text: "It is not the mountain we conquer, but ourselves.",
    author: "Edmund Hillary"
  },
  {
    id: 8,
    text: "Even the great and godlike Heracles had to sweat.",
    author: "Ancient Greek Saying"
  },
  {
    id: 9,
    text: "He who is not contented with what he has, would not be contented with what he would like to have.",
    author: "Socrates"
  },
  {
    id: 10,
    text: "First with the head, then with the heart.",
    author: "Eliud Kipchoge"
  }
]

const MotivationalSection: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [key, setKey] = useState(0) // For animation triggering
  
  // Change quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex])
      setKey(prev => prev + 1)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Motivation</h2>
      
      <div className="flex flex-col items-center">
        {/* Greek vase icon */}
        <div className="w-16 h-16 mb-4 relative">
          <div 
            className="w-full h-full bg-contain bg-center bg-no-repeat opacity-80" 
            style={{ backgroundImage: "url('./images/greek-vase.png')" }}
          />
        </div>
        
        <div className="w-full px-2 mb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-base italic mb-2 text-blue-600 dark:text-blue-400 font-medium">"{currentQuote.text}"</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">— {currentQuote.author}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="w-full border-t border-slate-100 dark:border-slate-700 pt-3 mt-1"></div>
        
        <div className="mt-2 text-center">
          <p className="text-xs italic text-slate-500 dark:text-slate-500">
            The original Olympic marathon commemorated the run of the soldier Pheidippides from 
            Marathon to Athens, bringing news of the victory over the Persians.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MotivationalSection 