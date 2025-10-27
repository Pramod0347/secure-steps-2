"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

interface UniversityNameModalProps {
  onSelect: (name: string) => void
  selectedName: string
  position?: { top: number; left: number; width: number }
  universities?: string[]
  isOpen?: boolean
  isMobile?: boolean // New prop for responsive design
}

const UniversityNameModal: React.FC<UniversityNameModalProps> = ({
  onSelect,
  selectedName,
  position,
  universities: providedUniversities,
  isOpen = false,
  isMobile = false, // Default to desktop
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [universities, setUniversities] = useState<string[]>(providedUniversities || [])
  const [filteredUniversities, setFilteredUniversities] = useState<string[]>(universities)

  // Update universities if provided from props
  useEffect(() => {
    if (providedUniversities && providedUniversities.length > 0) {
      setUniversities(providedUniversities)
    }
  }, [providedUniversities])

  useEffect(() => {
    if (searchTerm) {
      setFilteredUniversities(
        universities.filter((university) => university.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    } else {
      setFilteredUniversities(universities)
    }
  }, [searchTerm, universities])

  // Calculate modal position - only used for desktop
  const getModalStyle = (): React.CSSProperties => {
    // For mobile, we don't need inline styles as we use fixed positioning with Tailwind
    if (isMobile || !position) return {}

    // Return simple positioning without calculations
    // The parent container will handle the positioning
    return {}
  }

  // Prevent scroll events from bubbling up to the window
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // This prevents the scroll from propagating to parent elements
    e.stopPropagation()
  }

  if (!isOpen) return null

  return (
    <div
      className={`
      filter-modal bg-white overflow-hidden pointer-events-auto
      ${isMobile ? "w-full" : "rounded-2xl p-4"}
    `}
      style={!isMobile ? getModalStyle() : {}}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Mobile handle indicator */}
      {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3"></div>}

      <div className={`flex justify-between items-center ${isMobile ? "px-4 py-3 border-b" : "mb-3"}`}>
        <h3 className="font-semibold text-lg">Select University</h3>
        <button
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(selectedName) // Keep the current selection and close
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={`${isMobile ? "px-4 py-3" : "mb-4"}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search universities"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#BE243C] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div
        className={`overflow-y-auto ${isMobile ? "px-4" : ""}`}
        style={{ maxHeight: isMobile ? "300px" : "calc(100% - 120px)" }}
        onScroll={handleScroll}
      >
        {filteredUniversities.length > 0 ? (
          <div className="space-y-2">
            {filteredUniversities.map((university) => (
              <div
                key={university}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedName === university ? "bg-gray-100" : ""
                }`}
                onClick={() => onSelect(university)}
              >
                {university}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No universities found</div>
        )}
      </div>

      {selectedName && (
        <div className={`${isMobile ? "px-4 py-3 border-t mt-4" : "mt-4 pt-4 border-t border-gray-200"}`}>
          <button
            className={`${isMobile ? "w-full py-3 bg-[#BE243C] text-white rounded-lg font-medium" : "w-full py-2 text-[#BE243C] hover:text-[#a01f35] font-medium"}`}
            onClick={() => onSelect("")}
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  )
}

export default UniversityNameModal
