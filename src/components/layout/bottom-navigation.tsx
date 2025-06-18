"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderOpen, Users } from 'lucide-react'
import { cn } from '../../lib/utils'

const tabs = [
  {
    name: 'Lists',
    href: '/lists',
    icon: FolderOpen,
  },
  {
    name: 'Contacts', 
    href: '/contacts',
    icon: Users,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around py-2 px-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href === '/lists' && pathname === '/')
          return (
            <Link 
              key={tab.name} 
              href={tab.href} 
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 