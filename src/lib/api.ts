import { ContactList, Contact, DashboardStats } from '@/types'

// API client for making requests to our backend

// Contact Lists API
export const contactListsApi = {
  // Get all contact lists
  async getAll(): Promise<ContactList[]> {
    const response = await fetch('/api/lists')
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch contact lists')
    }
    
    return result.data
  },

  // Create a new contact list
  async create(listData: {
    name: string
    description: string
    color: string
    icon: string
  }): Promise<ContactList> {
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listData),
      })
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Expected JSON response, got: ${text.substring(0, 200)}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create contact list')
      }
      
      return result.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Unknown error occurred while creating contact list')
    }
  }
}

// Contacts API
export const contactsApi = {
  // Get all contacts with optional search and filtering
  async getAll(params?: {
    query?: string
    listId?: string
    page?: number
    limit?: number
  }): Promise<Contact[]> {
    const searchParams = new URLSearchParams()
    
    if (params?.query) searchParams.set('q', params.query)
    if (params?.listId) searchParams.set('list_id', params.listId)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const response = await fetch(`/api/contacts?${searchParams}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch contacts')
    }
    
    return result.data
  },

  // Create a new contact
  async create(contactData: {
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
  }): Promise<Contact> {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Expected JSON response, got: ${text.substring(0, 200)}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create contact')
      }
      
      return result.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Unknown error occurred while creating contact')
    }
  }
}

// Dashboard API
export const dashboardApi = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    const response = await fetch('/api/dashboard/stats')
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch dashboard stats')
    }
    
    return result.data
  }
} 