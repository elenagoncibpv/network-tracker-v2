import { useState, useEffect } from 'react'
import { Contact } from '@/types'
import { contactsApi } from '@/lib/api'

export function useContacts(params?: {
  query?: string
  listId?: string
  autoFetch?: boolean
}) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch contacts
  const fetchContacts = async (searchParams?: {
    query?: string
    listId?: string
    page?: number
    limit?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      const fetchedContacts = await contactsApi.getAll(searchParams || params)
      setContacts(fetchedContacts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts')
    } finally {
      setLoading(false)
    }
  }

  // Create a new contact
  const createContact = async (contactData: {
    firstName: string
    lastName?: string
    company?: string
    jobTitle?: string
    email?: string
    phone?: string
    linkedin?: string
    notes?: string
    tags?: string[]
    listIds?: string[]
  }) => {
    try {
      setError(null)
      const newContact = await contactsApi.create(contactData)
      setContacts(prevContacts => [...prevContacts, newContact])
      return newContact
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create contact'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Search contacts
  const search = (query: string) => {
    fetchContacts({ ...params, query })
  }

  // Refresh data
  const refresh = () => {
    fetchContacts()
  }

  // Load data on mount if autoFetch is true (default)
  useEffect(() => {
    if (params?.autoFetch !== false) {
      fetchContacts()
    }
  }, [params?.query, params?.listId])

  return {
    contacts,
    loading,
    error,
    createContact,
    search,
    refresh,
    fetchContacts
  }
} 