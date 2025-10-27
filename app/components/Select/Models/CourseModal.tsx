"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"

interface CourseModalProps {
  onSelect: (course: string) => void
  selectedCourse: string
  position?: { top: number; left: number; width: number }
  courses?: string[]
  isOpen?: boolean
  isMobile?: boolean // New prop for responsive design
}

const CourseModal: React.FC<CourseModalProps> = ({
  onSelect,
  selectedCourse,
  position,
  courses: providedCourses = [],
  isOpen = false,
  isMobile = false, // Default to desktop
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [displayedCourses, setDisplayedCourses] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Store the full course list in a ref to avoid re-renders
  const allCoursesRef = useRef<string[]>([])

  // Initialize with just a few courses for showcase
  useEffect(() => {
    if (providedCourses && providedCourses.length > 0) {
      // Store all courses in ref for search
      allCoursesRef.current = providedCourses

      // Only display 10 courses initially
      const initialCourses = providedCourses.slice(0, 10)
      setDisplayedCourses(initialCourses)

      // Focus the search input when modal opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 50)
    }
  }, [providedCourses])

  // Debounced search function
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (term.trim() === "") {
      // If search is cleared, show initial courses
      setIsSearching(false)
      setDisplayedCourses(allCoursesRef.current.slice(0, 10))
      return
    }

    // Set searching state immediately for UI feedback
    setIsSearching(true)

    // Debounce the actual search
    searchTimeoutRef.current = setTimeout(() => {
      const searchResults = allCoursesRef.current
        .filter((course) => course.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 50) // Limit results to 50 for performance

      setDisplayedCourses(searchResults)
      setIsSearching(false)
    }, 300)
  }, [])

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
    e.stopPropagation()
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

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
        <h3 className="font-semibold text-lg">Select Course</h3>
        <button
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(selectedCourse) // Keep the current selection and close
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={`${isMobile ? "px-4 py-3" : "mb-4"}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search courses"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#BE243C] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {searchTerm.length === 0 && (
        <div className={`text-xs text-gray-500 mb-2 ${isMobile ? "px-4" : "px-1"}`}>
          Showing 10 of {allCoursesRef.current.length} courses. Search to find more.
        </div>
      )}

      <div
        className={`overflow-y-auto ${isMobile ? "px-4" : ""}`}
        style={{ maxHeight: isMobile ? "300px" : "calc(100% - 140px)" }}
        onScroll={handleScroll}
      >
        {isSearching ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-5 w-5 text-[#BE243C] animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Searching...</span>
          </div>
        ) : displayedCourses.length > 0 ? (
          <div className="space-y-2">
            {displayedCourses.map((course) => (
              <div
                key={course}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedCourse === course ? "bg-gray-100" : ""
                }`}
                onClick={() => onSelect(course)}
              >
                {course}
              </div>
            ))}

            {searchTerm && displayedCourses.length >= 50 && (
              <div className="text-xs text-center text-gray-500 py-2">
                Showing top 50 results. Refine your search for more specific results.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No courses found. Try a different search term.</div>
        )}
      </div>

      {selectedCourse && (
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

export default CourseModal
