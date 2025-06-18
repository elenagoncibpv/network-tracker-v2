import React from 'react'
import { AppShell } from '../../components/layout/app-shell'
import { Button } from '../../components/ui/button'
import { Plus, Users } from 'lucide-react'

export default function AddPage() {
  return (
    <AppShell>
      <div className="container-mobile py-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quick Add</h1>
          <p className="text-muted-foreground">
            Add new contacts or create lists
          </p>
        </div>
        
        <div className="space-y-4">
          <Button className="w-full flex items-center gap-3 h-14">
            <Plus className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Add New Contact</div>
              <div className="text-xs opacity-75">Create a new networking contact</div>
            </div>
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-3 h-14">
            <Users className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Create New List</div>
              <div className="text-xs opacity-75">Organize contacts by event or category</div>
            </div>
          </Button>
        </div>
      </div>
    </AppShell>
  )
} 