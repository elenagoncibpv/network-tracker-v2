"use client"

import React, { useState } from "react"
import { Modal } from "./ui/modal"
import { Button } from "./ui/button"
import { ListColor } from "../types"

interface CreateListModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateList: (listData: {
    name: string
    description: string
    color: ListColor
    icon: string
  }) => void
}



const iconOptions = [
  "📁", "💼", "🎯", "📈", "🚀", "💻", "🎨", "📚",
  "🔬", "🏢", "🌟", "💡", "🎓", "🤝", "💰", "☕"
]

export function CreateListModal({ isOpen, onClose, onCreateList }: CreateListModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("📁")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    onCreateList({
      name: name.trim(),
      description: description.trim(),
      color: "blue", // Default color since colors are removed
      icon: selectedIcon
    })

    // Reset form
    setName("")
    setDescription("")
    setSelectedIcon("📁")
    onClose()
  }

  const handleClose = () => {
    // Reset form on close
    setName("")
    setDescription("")
    setSelectedIcon("📁")
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New List"
      variant="bottom"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* List Name */}
        <div className="space-y-2">
          <label htmlFor="listName" className="block text-sm font-medium text-gray-700">
            List Name *
          </label>
          <input
            id="listName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter list name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="listDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="listDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Icon Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Choose Icon
          </label>
          <div className="grid grid-cols-8 gap-2">
            {iconOptions.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                  selectedIcon === icon
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>



        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!name.trim()}
          >
            Create List
          </Button>
        </div>
      </form>
    </Modal>
  )
} 