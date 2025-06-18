import { useState, useEffect } from 'react'
import { ContactList } from '@/types'
import { contactListsApi } from '@/lib/api'

export function useContactLists() {
  const [lists, setLists] = useState<ContactList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch contact lists
  const fetchLists = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedLists = await contactListsApi.getAll()
      setLists(fetchedLists)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contact lists')
    } finally {
      setLoading(false)
    }
  }

  // Create a new contact list
  const createList = async (listData: {
    name: string
    description: string
    color: string
    icon: string
  }) => {
    try {
      setError(null)
      const newList = await contactListsApi.create(listData)
      setLists(prevLists => [...prevLists, newList])
      return newList
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create contact list'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Refresh data
  const refresh = () => {
    fetchLists()
  }

  // Load data on mount
  useEffect(() => {
    fetchLists()
  }, [])

  return {
    lists,
    loading,
    error,
    createList,
    refresh
  }
} 