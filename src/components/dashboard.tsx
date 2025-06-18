"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Star, Users, Plus, Search, User } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { CreateListModal } from "./create-list-modal"
import { useContactLists, useDashboard } from "../hooks"
import { 
  filterFavoriteLists, 
  sortListsByFavorite, 
  getListBackgroundClass,
  getListTextColorClass,
  formatContactCount,
  formatDate,
  cn 
} from "../lib/utils"
import { ContactList, ListColor } from "../types"

interface ListCardProps {
  list: ContactList
  isFeatured?: boolean
}

function ListCard({ list, isFeatured = false }: ListCardProps) {
  const backgroundClass = getListBackgroundClass(list.color)
  const textColorClass = getListTextColorClass(list.color)
  
  if (isFeatured) {
    // Square card for featured lists
    return (
      <Card className={cn(
        "card-hover cursor-pointer border border-gray-200 shadow-sm flex-shrink-0",
        backgroundClass
      )}>
        <CardContent className="p-4 w-40 h-40 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Icon */}
            {list.icon && (
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{list.icon}</span>
              </div>
            )}
            
            {/* Title */}
            <div>
              <h3 className={cn("font-semibold text-sm leading-tight", textColorClass)}>
                {list.name}
              </h3>
              {list.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {list.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">
                {list.contactCount}
              </span>
            </div>
            {list.isFavorite && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Regular card for all lists
  return (
    <Card className={cn(
      "card-hover cursor-pointer border border-gray-200 shadow-sm",
      backgroundClass
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with Icon */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {list.icon && (
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{list.icon}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={cn("font-semibold text-lg leading-tight", textColorClass)}>
                    {list.name}
                  </h3>
                  {list.isFavorite && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  )}
                </div>
                {list.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {list.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats and Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {formatContactCount(list.contactCount)}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(list.updatedAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



export function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { lists, loading, error, createList } = useContactLists()
  const { stats } = useDashboard()
  
  const favoriteLists = filterFavoriteLists(lists)
  const sortedLists = sortListsByFavorite(lists)

  const handleCreateList = async (listData: {
    name: string
    description: string
    color: ListColor
    icon: string
  }) => {
    try {
      await createList(listData)
      setIsCreateModalOpen(false)
    } catch (error) {
      // Error is already handled by the hook
      console.error('Failed to create list:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your lists...</p>
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
      <div className="container-mobile py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Network Tracker</h1>
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
            placeholder="Search contacts and lists..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Featured Lists (Favorites) */}
      {favoriteLists.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured Lists</h2>
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {favoriteLists.map((list) => (
              <ListCard key={list.id} list={list} isFeatured={true} />
            ))}
          </div>
        </div>
      )}

      {/* All Lists */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Lists</h2>
          <Button 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add List
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      </div>
      </div>

      {/* Floating Add Contact Button */}
      <button 
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Create List Modal */}
      <CreateListModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateList={handleCreateList}
      />
    </div>
  )
} 