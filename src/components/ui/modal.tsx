"use client"

import React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  variant?: "center" | "bottom"
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  variant = "center" 
}: ModalProps) {
  if (!isOpen) return null

  const isBottomSheet = variant === "bottom"

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "absolute bg-white shadow-xl transition-transform",
        isBottomSheet 
          ? "bottom-0 left-0 right-0 rounded-t-xl max-h-[80vh] overflow-y-auto" 
          : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl w-full max-w-md mx-4",
        className
      )}>
        {/* Header */}
        {(title || !isBottomSheet) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          "p-6",
          isBottomSheet && !title && "pt-8",
          isBottomSheet && "pb-8"
        )}>
          {children}
        </div>
      </div>
    </div>
  )
} 