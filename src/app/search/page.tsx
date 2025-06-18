import React from 'react'
import { AppShell } from '../../components/layout/app-shell'
import { Search } from 'lucide-react'

export default function SearchPage() {
  return (
    <AppShell>
      <div className="container-mobile py-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Search</h1>
          <p className="text-muted-foreground">
            Find contacts and lists across your network
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contacts, companies, or lists..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">Search functionality coming soon...</p>
        </div>
      </div>
    </AppShell>
  )
} 