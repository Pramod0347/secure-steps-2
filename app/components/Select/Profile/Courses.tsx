"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Search, Filter, X, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import UniversityApplicationModal from "../Models/UniversityApplicationModal"
import CourseCard from "./CourseCard"
import CourseDetailsModal from "../Models/UniversityProfile/CourseDetailsModel"
import { useAuth } from "@/app/context/AuthContext"
import type { UniversityInterface, CourseInterface } from "@/store/universitystore"

interface CoursesProps {
  university: UniversityInterface
}

interface FavCourse {
  id: string
  userId: string
  courseId: string
  universityId: string
  course: {
    id: string
    name: string
    fees: string
    duration: string
    degreeType: string
  }
}

export default function Courses({ university }: CoursesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDegreeType, setSelectedDegreeType] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState<CourseInterface | null>(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false)

  const { user, isAuthenticated } = useAuth()

  const searchBarRef = useRef<HTMLDivElement>(null)
  const coursesContainerRef = useRef<HTMLDivElement>(null)
  const coursesPerPage = 8

  // Fetch user's favorite courses when component mounts or user changes
  useEffect(() => {
    const fetchFavoriteCourses = async () => {
      if (!isAuthenticated || !user) {
        setWishlist([])
        return
      }

      setIsLoadingWishlist(true)
      try {
        const NextUrl = process.env.NEXTAUTH_URL || window.location.origin
        const response = await fetch(`${NextUrl}/api/auth/fav-courses?userId=${user.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch favorite courses")
        }

        const favCourses: FavCourse[] = await response.json()
        const courseIds = favCourses.map((fav) => fav.courseId)
        setWishlist(courseIds)
      } catch (error) {
        console.error("Error fetching favorite courses:", error)
      } finally {
        setIsLoadingWishlist(false)
      }
    }

    fetchFavoriteCourses()
  }, [isAuthenticated, user])

  // Get trending courses (first 8 or all if less than 8)
  const trendingCourses = (university.courses || []).slice(0, 8)

  // Filter courses based on search and filters
  const filteredCourses = (university.courses || []).filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDegree = selectedDegreeType ? course.degreeType === selectedDegreeType : true
    return matchesSearch && matchesDegree
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const currentCourses = filteredCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage)

  // Degree types for filter
  const degreeTypes = Array.from(new Set(university.courses?.map((course) => course.degreeType).filter(Boolean) || []))

  // Toggle wishlist - now updates both local state and server
  const toggleWishlist = async (courseId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    // Update local state immediately for better UX
    const isCurrentlyWishlisted = wishlist.includes(courseId)

    if (isCurrentlyWishlisted) {
      // If it's already in wishlist, we'll remove it
      setWishlist((prev) => prev.filter((id) => id !== courseId))
    } else {
      // If it's not in wishlist, we'll add it
      setWishlist((prev) => [...prev, courseId])
    }

    // No need to make API call if user is not authenticated
    if (!isAuthenticated || !user) {
      return
    }

    try {
      const course = university.courses.find((c) => c.id === courseId)
      if (!course) return

      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin

      if (isCurrentlyWishlisted) {
        // Remove from wishlist on server
        await fetch(`${NextUrl}/api/auth/fav-courses`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            courseId: courseId,
          }),
        })
      } else {
        // Add to wishlist on server
        await fetch(`${NextUrl}/api/auth/fav-courses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            courseId: course.id,
            courseName: course.name,
            universityId: university.id,
            universityName: university.name,
          }),
        })
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      // Revert local state if server update fails
      if (isCurrentlyWishlisted) {
        setWishlist((prev) => [...prev, courseId])
      } else {
        setWishlist((prev) => prev.filter((id) => id !== courseId))
      }
    }
  }

  // Handle Find Your Course button click with improved scrolling
  const handleFindCourseClick = () => {
    const newSearchState = !showSearch
    setShowSearch(newSearchState)

    if (newSearchState) {
      // Reset pagination when opening search
      setCurrentPage(1)

      // Use requestAnimationFrame to ensure DOM updates before scrolling
      requestAnimationFrame(() => {
        // Calculate header height (adjust this value based on your actual header height)
        const headerHeight = 100

        if (searchBarRef.current) {
          const searchBarTop = searchBarRef.current.getBoundingClientRect().top
          const scrollPosition = window.scrollY + searchBarTop - headerHeight - 20 // 20px extra padding

          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          })
        }
      })
    } else {
      // Clear search when closing
      setSearchQuery("")
      setSelectedDegreeType(null)
    }
  }

  // Open course details modal
  const openCourseDetails = (course: CourseInterface) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
  }

  // Create empty placeholder cards when no results to maintain layout
  const renderEmptyPlaceholders = () => {
    if (!showSearch || filteredCourses.length > 0) return null

    return Array.from({ length: 4 }).map((_, index) => <div key={`empty-${index}`} className="h-0 invisible"></div>)
  }

  // Generate pagination buttons with limited display
  const renderPaginationButtons = () => {
    // Maximum number of page buttons to show at once
    const maxButtonsToShow = 5

    // If we have fewer pages than the max, just show all pages
    if (totalPages <= maxButtonsToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentPage === page ? "bg-[#DA202E] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))
    }

    // For many pages, we need to show a subset with ellipsis
    const buttons = []

    // Always show first page
    buttons.push(
      <button
        key={1}
        onClick={() => setCurrentPage(1)}
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentPage === 1 ? "bg-[#DA202E] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        1
      </button>,
    )

    // Calculate the range of pages to show around current page
    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)

    // Adjust if we're near the beginning
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1)
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3)
    }

    // Add ellipsis if needed at the beginning
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis-start" className="flex items-center justify-center px-1">
          <MoreHorizontal size={16} />
        </span>,
      )
    }

    // Add the middle pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentPage === i ? "bg-[#DA202E] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {i}
        </button>,
      )
    }

    // Add ellipsis if needed at the end
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis-end" className="flex items-center justify-center px-1">
          <MoreHorizontal size={16} />
        </span>,
      )
    }

    // Always show last page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentPage === totalPages ? "bg-[#DA202E] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {totalPages}
        </button>,
      )
    }

    return buttons
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8" id="courses-section">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          {showSearch ? "Find Your Course" : "Trending Courses"}
        </h1>
      </div>

      {/* Search Bar (appears when showSearch is true) */}
      <div
        ref={searchBarRef}
        className={`transition-all duration-200 ease-in-out overflow-hidden bg-gray-50 rounded-lg ${
          showSearch
            ? "max-h-[300px] border border-gray-200 p-4 mb-8 visible opacity-100"
            : "max-h-0 p-0 border-0 mb-0 invisible opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search change
              }}
              className={`pl-10 pr-4 py-2 border rounded-full w-full focus:outline-none focus:ring-2 ${
                showSearch ? "focus:ring-[#DA202E] border-gray-300" : "focus:ring-black"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setCurrentPage(1) // Reset to first page when clearing search
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="relative w-full md:w-auto md:flex-grow md:max-w-xs">
            <select
              value={selectedDegreeType || ""}
              onChange={(e) => {
                setSelectedDegreeType(e.target.value || null)
                setCurrentPage(1) // Reset to first page on filter change
              }}
              className={`pl-10 pr-4 py-2 border rounded-full appearance-none w-full focus:outline-none focus:ring-2 ${
                showSearch ? "focus:ring-[#DA202E] border-gray-300" : "focus:ring-black"
              }`}
            >
              <option value="">All Degree Types</option>
              {degreeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Courses Grid with min-height to maintain layout */}
      <div
        ref={coursesContainerRef}
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
      >
        {isLoadingWishlist
          ? // Show loading placeholders while fetching wishlist
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="bg-gray-100 rounded-xl animate-pulse aspect-[3/4]"
              ></div>
            ))
          : // Show actual courses
            (showSearch ? currentCourses : trendingCourses).map((course) => (
              <div key={course.id} onClick={() => openCourseDetails(course)} className="cursor-pointer">
                <CourseCard
                  course={course}
                  isWishlisted={wishlist.includes(course.id)}
                  onToggleWishlist={toggleWishlist}
                />
              </div>
            ))}

        {/* Empty placeholders to maintain grid layout */}
        {renderEmptyPlaceholders()}

        {showSearch && filteredCourses.length === 0 && !isLoadingWishlist && (
          <div className="col-span-full py-12 text-center text-gray-500">
            <p className="text-lg">No courses found matching your criteria.</p>
            <p className="mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Improved Pagination with limited buttons */}
      {showSearch && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-1 overflow-x-auto py-2 max-w-full">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1 max-w-[calc(100%-80px)] overflow-x-auto hide-scrollbar">
            {renderPaginationButtons()}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Find Your Course Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleFindCourseClick}
          className="bg-black text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors transform hover:scale-105 duration-200"
        >
          {showSearch ? (
            <>
              <X size={18} />
              Close Search
            </>
          ) : (
            <>
              <Search size={18} />
              Find Your Course
            </>
          )}
        </button>
      </div>

      {/* Course Details Modal */}
      {showCourseModal && selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          universityId={university.id}
          universityName={university.name}
          isOpen={showCourseModal}
          onClose={() => setShowCourseModal(false)}
          isWishlisted={wishlist.includes(selectedCourse.id)}
          onToggleWishlist={toggleWishlist}
          onApply={() => {
            setShowCourseModal(false)
            setIsModalOpen(true)
          }}
        />
      )}

      {/* Apply Now Modal */}
      <UniversityApplicationModal
        universityId={university.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={university.courses}
        universityName={university.name}
      />
    </div>
  )
}
