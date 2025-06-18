"use client"

import React from 'react'
import { BottomNavigation } from './bottom-navigation'

interface AppShellProps {
  children: React.ReactNode
  hideBottomNav?: boolean
}

export function AppShell({ children, hideBottomNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        {children}
      </main>
      {!hideBottomNav && <BottomNavigation />}
    </div>
  )
} 