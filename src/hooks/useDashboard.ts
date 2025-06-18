import { useState, useEffect } from 'react'
import { DashboardStats } from '@/types'
import { dashboardApi } from '@/lib/api'

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLists: 0,
    totalContacts: 0,
    favoriteLists: 0,
    recentlyAdded: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedStats = await dashboardApi.getStats()
      setStats(fetchedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const refresh = () => {
    fetchStats()
  }

  // Load data on mount
  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refresh
  }
} 