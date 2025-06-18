"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, User, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { useContacts } from "../hooks"
import { Contact } from "../types"

interface ContactListItemProps {
  contact: Contact
}

function ContactListItem({ contact }: ContactListItemProps) {
  // Generate initials from first and last name
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="flex items-center gap-4 py-4 px-4 bg-white hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
      {/* Initials Avatar */}
      <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
        <span className="text-gray-600 font-semibold text-lg">
          {initials}
        </span>
      </div>
      
      {/* Name and Role */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base leading-tight text-gray-900">
          {contact.firstName} {contact.lastName}
        </h3>
        {contact.jobTitle && (
          <p className="text-sm text-gray-600 mt-1 truncate">
            {contact.jobTitle}
            {contact.company && ` at ${contact.company}`}
          </p>
        )}
        {!contact.jobTitle && contact.company && (
          <p className="text-sm text-gray-600 mt-1 truncate">
            {contact.company}
          </p>
        )}
      </div>
    </div>
  )
}

export function ContactsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const { contacts, loading, error, search } = useContacts()

  // Handle search with debouncing
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      search(query)
    } else {
      // Fetch all contacts when search is cleared
      search("")
    }
  }

  // Sort contacts alphabetically
  const sortedContacts = [...contacts].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
    return nameA.localeCompare(nameB)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading contacts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="container-mobile py-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <Link 
              href="/profile"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* All Contacts Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            All Contacts {searchQuery && `(${sortedContacts.length} found)`}
          </h2>
          <Button 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Full Width Contacts List */}
      {sortedContacts.length > 0 ? (
        <div>
          {sortedContacts.map((contact) => (
            <ContactListItem key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <div className="container-mobile">
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Get started by adding your first contact'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 