import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ListColor, ContactList, Contact } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getListColorClass(color: ListColor): string {
  const colorMap: Record<ListColor, string> = {
    blue: "bg-list-blue",
    green: "bg-list-green", 
    purple: "bg-list-purple",
    orange: "bg-list-orange",
    pink: "bg-list-pink",
    indigo: "bg-list-indigo",
    red: "bg-list-red",
    teal: "bg-list-teal",
  }
  return colorMap[color] || "bg-gray-400"
}

export function getListBackgroundClass(color: ListColor, opacity: number = 10): string {
  // Always return white background for simplicity
  return "bg-white"
}

export function getListTextColorClass(color: ListColor): string {
  // Always return dark text for simplicity
  return "text-gray-900"
}

export function getListBorderColorClass(color: ListColor): string {
  const colorMap: Record<ListColor, string> = {
    blue: "border-list-blue",
    green: "border-list-green",
    purple: "border-list-purple", 
    orange: "border-list-orange",
    pink: "border-list-pink",
    indigo: "border-list-indigo",
    red: "border-list-red",
    teal: "border-list-teal",
  }
  return colorMap[color] || "border-gray-400"
}

export function formatContactCount(count: number): string {
  if (count === 0) return "No contacts"
  if (count === 1) return "1 contact"
  return `${count} contacts`
}

export function formatDate(date: Date | string): string {
  try {
    // Handle both Date objects and date strings
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function sortListsByFavorite(lists: ContactList[]): ContactList[] {
  return [...lists].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return a.name.localeCompare(b.name)
  })
}

export function filterFavoriteLists(lists: ContactList[]): ContactList[] {
  return lists.filter(list => list.isFavorite)
} 