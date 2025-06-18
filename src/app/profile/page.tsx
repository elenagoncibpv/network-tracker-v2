import React from 'react'
import { AppShell } from '../../components/layout/app-shell'
import { User, Settings, Download, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="container-mobile py-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Settings, sync, and export options
          </p>
        </div>
        
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-5 w-5" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="font-medium">Demo User</p>
              <p className="text-sm text-muted-foreground">demo@networktracker.com</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full flex items-center gap-3 justify-start h-12">
            <RefreshCw className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Sync Status</div>
              <div className="text-xs text-muted-foreground">Last synced: Just now</div>
            </div>
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-3 justify-start h-12">
            <Download className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Export Data</div>
              <div className="text-xs text-muted-foreground">Download your contacts as CSV</div>
            </div>
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-3 justify-start h-12">
            <Settings className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Settings</div>
              <div className="text-xs text-muted-foreground">App preferences and options</div>
            </div>
          </Button>
        </div>
      </div>
    </AppShell>
  )
} 