"use client"

import type React from "react"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FacilitiesListProps {
  facilities: string[]
  onChange: (facilities: string[]) => void
}

export function FacilitiesList({ facilities, onChange }: FacilitiesListProps) {
  const [newFacility, setNewFacility] = useState("")

  const addFacility = () => {
    if (newFacility.trim()) {
      onChange([...facilities, newFacility.trim()])
      setNewFacility("")
    }
  }

  const removeFacility = (index: number) => {
    onChange(facilities.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent form submission on Enter
    if (e.key === "Enter") {
      e.preventDefault()
      addFacility()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="space-y-1.5 w-full">
          <label className="text-sm font-medium text-gray-700">Facility</label>
          <Input
            type="text"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            placeholder="Add facility"
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button type="button" onClick={addFacility} className="mt-auto bg-[#3c387e] hover:bg-[#3c387e]/90">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {facilities.map((facility, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-200 px-3 py-1.5 rounded-lg text-sm">
            <span className="line-clamp-1">{facility}</span>
            <button
              type="button"
              onClick={() => removeFacility(index)}
              className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

