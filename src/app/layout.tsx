import type { Metadata, Viewport } from 'next'
import React from 'react'
import './globals.css'
import VisitorCounter from '../components/VisitorCounter'
import ConnectWithMe from '../components/ConnectWithMe'

export const metadata: Metadata = {
  title: 'My Journey to Marathon, Greece',
  description: 'Tracking my progress for the Athens Marathon',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        {children}
        
        {/* Mobile - Connect with me fixed at bottom left with smaller padding */}
        <div className="md:hidden fixed bottom-4 left-3 z-30">
          <ConnectWithMe />
        </div>
        
        {/* Desktop - Connect with me at bottom left */}
        <div className="hidden md:block fixed bottom-6 left-6 z-30">
          <ConnectWithMe />
        </div>
        
        {/* Visitor counter - bottom right with responsive spacing */}
        <div className="fixed bottom-4 right-3 md:bottom-6 md:right-6 z-30">
          <VisitorCounter />
        </div>
      </body>
    </html>
  )
} 