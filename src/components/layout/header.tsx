"use client"

import React from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container-mobile">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Network Tracker</h1>
          
          <Link 
            href="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <User className="h-5 w-5 text-gray-600" />
          </Link>
        </div>
      </div>
    </header>
  )
} 