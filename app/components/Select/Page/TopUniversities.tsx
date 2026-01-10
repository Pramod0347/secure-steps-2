"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import UniversityApplicationModal from "../Models/UniversityApplicationModal"
import UniversityCompareModal from "../Models/UniversityCompareModal"
import WiseListModal from "../Models/WiseListModal"
import { Building2, Heart } from "lucide-react"
import UniversityCardSkeleton from "./UniversityCardSkeleton"
import UniversityCard from "./UniversityCard"
import Pagination from "../../ui/pagination"
import FullScreenLoader from "../../ui/FullScreenLoader"
import type { FilterValues } from "./Hero"
import { useScrollLock } from "@/hooks/useScrollLock"
import { useUniversities } from "@/hooks/useUniversities"
import type { UniversityInterface, CourseInterface } from "@/store/universitystore"

interface TopUniversitiesProps {
  searchQuery?: string
  filters?: FilterValues
}

const TopUniversities: React.FC<TopUniversitiesProps> = ({
  searchQuery = "",
  filters,
}) => {
  const { user, isAuthenticated } = useAuth()

  // Modal state
  const [universityToCompare, setUniversityToCompare] = useState<UniversityInterface | null>(null)
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityInterface | null>(null)
  const [applicationData, setApplicationData] = useState<{
    universityId: string
    courses: CourseInterface[]
    universityName: string
  } | null>(null)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [isWiseListModalOpen, setIsWiseListModalOpen] = useState(false)
  
  // Local loading state for pagination/search
  const [isPaginationLoading, setIsPaginationLoading] = useState(false)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const loadingStartTimeRef = useRef<number>(0)
  const targetPageRef = useRef<number | null>(null)
  const initialUniversityIdsRef = useRef<string[]>([])
  const MINIMUM_LOADER_TIME = 800 // Minimum time loader should show (ms)

  // Use the hook
  const {
    currentUniversities,
    isLoading,
    isFetchingPage,
    isRefreshing,
    showLoader,
    error,
    setModalInteraction,
    hasData,
    isEmpty,
    isHydrated,
    totalPages,
    currentPage,
    handlePageChange: hookHandlePageChange,
  } = useUniversities({
    searchQuery,
    filters,
    autoFetch: true,
  })

  // Wrap handlePageChange to track loading
  const handlePageChange = useCallback((page: number) => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
    // Store the current university IDs to compare when new data arrives
    initialUniversityIdsRef.current = currentUniversities.map(u => u.id)
    targetPageRef.current = page
    loadingStartTimeRef.current = Date.now()
    setIsPaginationLoading(true)
    hookHandlePageChange(page)
  }, [hookHandlePageChange, currentUniversities])

  // Track when loading should end - only when new data is actually rendered
  useEffect(() => {
    if (!isPaginationLoading) return
    
    // Get current university IDs
    const currentIds = currentUniversities.map(u => u.id)
    const initialIds = initialUniversityIdsRef.current
    
    // Check if data has actually changed (different universities are now showing)
    // Also consider empty results as a valid change (e.g., search with no matches)
    const dataActuallyChanged = 
      // Results changed to different universities
      (currentIds.length > 0 && (
        currentIds.length !== initialIds.length ||
        !currentIds.every((id, index) => id === initialIds[index])
      )) ||
      // Results became empty (no matches for search/filter)
      (currentIds.length === 0 && initialIds.length > 0) ||
      // Was already empty and search completed (isEmpty state)
      (currentIds.length === 0 && isEmpty)
    
    // Check if data loading is complete
    const dataIsLoaded = !isLoading && !isFetchingPage
    
    // Close loader when:
    // 1. Data has actually changed AND loading is complete, OR
    // 2. There's an error, OR
    // 3. Empty results and loading is complete
    const shouldCloseLoader = (dataActuallyChanged && dataIsLoaded) || (error && dataIsLoaded)
    
    if (shouldCloseLoader) {
      const elapsedTime = Date.now() - loadingStartTimeRef.current
      const remainingTime = Math.max(0, MINIMUM_LOADER_TIME - elapsedTime)
      
      // Wait for remaining minimum time before closing
      loadingTimeoutRef.current = setTimeout(() => {
        setIsPaginationLoading(false)
        targetPageRef.current = null
        initialUniversityIdsRef.current = []
      }, remainingTime)
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [currentPage, currentUniversities, isLoading, isFetchingPage, isPaginationLoading, error, isEmpty])

  // Track search changes
  const prevSearchQuery = useRef(searchQuery)
  const prevFilters = useRef(filters)
  
  useEffect(() => {
    const searchChanged = prevSearchQuery.current !== searchQuery
    const filtersChanged = JSON.stringify(prevFilters.current) !== JSON.stringify(filters)
    
    if (searchChanged || filtersChanged) {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      // Store current IDs before search changes
      initialUniversityIdsRef.current = currentUniversities.map(u => u.id)
      loadingStartTimeRef.current = Date.now()
      setIsPaginationLoading(true)
      prevSearchQuery.current = searchQuery
      prevFilters.current = filters
    }
  }, [searchQuery, filters, currentUniversities])

  // Lock scroll when modals are open
  useScrollLock(isApplicationModalOpen || isCompareModalOpen || isWiseListModalOpen)

  const handleApplyClick = useCallback(
    (university: UniversityInterface, e: React.MouseEvent) => {
      e.preventDefault()
      setModalInteraction(true)
      setSelectedUniversity(university)
      setApplicationData({
        universityId: university.id,
        courses: university.courses,
        universityName: university.name,
      })
      setIsApplicationModalOpen(true)
    },
    [setModalInteraction],
  )

  const handleOpenApplicationFromWishlist = useCallback(
    (universityId: string, courses: CourseInterface[], universityName: string) => {
      setModalInteraction(true)
      setSelectedUniversity(null)
      setApplicationData({
        universityId,
        courses,
        universityName,
      })
      setIsApplicationModalOpen(true)
    },
    [setModalInteraction],
  )

  const handleCompareClick = useCallback(
    (university: UniversityInterface, e: React.MouseEvent) => {
      e.preventDefault()
      setModalInteraction(true)
      setUniversityToCompare(university)
      setIsCompareModalOpen(true)
    },
    [setModalInteraction],
  )

  const handleWiseListClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setModalInteraction(true)
      setIsWiseListModalOpen(true)
    },
    [setModalInteraction],
  )

  const handleModalClose = useCallback(
    (modalType: "application" | "compare" | "wiselist") => {
      if (modalType === "application") {
        setIsApplicationModalOpen(false)
        setTimeout(() => {
          setSelectedUniversity(null)
          setApplicationData(null)
          setModalInteraction(false)
        }, 300)
      } else if (modalType === "compare") {
        setIsCompareModalOpen(false)
        setTimeout(() => {
          setUniversityToCompare(null)
          setModalInteraction(false)
        }, 300)
      } else if (modalType === "wiselist") {
        setIsWiseListModalOpen(false)
        setTimeout(() => {
          setModalInteraction(false)
        }, 300)
      }
    },
    [setModalInteraction],
  )

  // Clean up modal state when component unmounts
  useEffect(() => {
    return () => {
      setIsApplicationModalOpen(false)
      setIsCompareModalOpen(false)
      setIsWiseListModalOpen(false)
      setSelectedUniversity(null)
      setApplicationData(null)
      setUniversityToCompare(null)
      setModalInteraction(false)
    }
  }, [setModalInteraction])

  // Helper function to render skeleton cards
  const renderSkeletonCards = (count: number = 9) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10 2xl:gap-12 justify-items-center">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <UniversityCardSkeleton key={`skeleton-${index}`} />
        ))}
    </div>
  )

  // Show skeleton during initial loading
  if (showLoader) {
    return (
      <div className="flex flex-col min-h-screen p-4 md:p-16 lg:p-20 2xl:p-28 text-left font-sans">
        <div className="mb-8 sm:mb-12 lg:mb-20 flex flex-row items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2">
            <span>Top Universities</span>
          </h1>
          <div className="flex flex-row items-center gap-3">
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {renderSkeletonCards()}
      </div>
    )
  }

  // Main content after loading
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-16 lg:p-20 2xl:p-28 text-left ">
      {/* Show full screen loader overlay when fetching data (search, pagination, refresh) */}
      <FullScreenLoader 
        isLoading={isPaginationLoading} 
        message="Loading..." 
      />

      <div className="mb-4 lg:mb-8 flex flex-col items-start justify-between">
        {/* <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2">
          <span>Top Universities</span>
        </h1> */}
        <div className="h-full flex-col gap-4 flex items-center">
          <h1 className="md:text-5xl 2xl:text-[90px] text-3xl 2xl:leading-[87px] md:leading-[70px] leading-[43px] text-black text-center bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent font-bold">
            Let&apos;s Find Your Dream Universities
          </h1>
        </div>
      </div>

      <div className="flex flex-row items-end justify-end gap-3 mb-8 sm:mb-8 lg:mb-8">
          {isAuthenticated && user?.role === "ADMIN" && (
            <Link
              href="/admin/select"
              className="px-3 sm:px-4 lg:px-6 py-2 text-sm lg:text-base bg-[#5D4A9C] text-white rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              <span className="hidden sm:inline">Manage Universities</span>
            </Link>
          )}
          {isAuthenticated && (
            <div
              onClick={handleWiseListClick}
              className="px-3 sm:px-4 lg:px-6 py-2 text-sm lg:text-base bg-[#DA202E] text-white rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">My WiseList</span>
            </div>
          )}
        </div>

      {/* Content rendering */}
      {error ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center py-10 text-gray-500">
            <p className="text-xl">Error loading universities.</p>
            <p className="mt-2">{error}</p>
            <p className="mt-2">Please try again later.</p>
          </div>
        </div>
      ) : isLoading ? (
        // Show skeleton when loading
        renderSkeletonCards()
      ) : isEmpty ? (
        // Show empty state when no universities found
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-center py-10">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Universities Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filters?.country 
                ? `We couldn't find any universities in "${filters.country}". Try a different country or clear the filter.`
                : searchQuery 
                  ? `No universities match "${searchQuery}". Try a different search term.`
                  : "No universities available at the moment. Please check back later."}
            </p>
          </div>
        </div>
      ) : (
        // Show data when available
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10 2xl:gap-12 justify-items-center">
          {currentUniversities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
              onApplyClick={handleApplyClick}
              onCompareClick={handleCompareClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {isHydrated && (
        <>
          {applicationData && (
            <UniversityApplicationModal
              universityId={applicationData.universityId}
              courses={applicationData.courses}
              isOpen={isApplicationModalOpen}
              onClose={() => handleModalClose("application")}
              universityName={applicationData.universityName}
            />
          )}

          {universityToCompare && (
            <UniversityCompareModal
              isOpen={isCompareModalOpen}
              onClose={() => handleModalClose("compare")}
              selectedUniversity={universityToCompare}
            />
          )}

          <WiseListModal
            isOpen={isWiseListModalOpen}
            onClose={() => handleModalClose("wiselist")}
            onOpenApplicationModal={handleOpenApplicationFromWishlist}
          />
        </>
      )}

      {/* Pagination */}
{hasData && totalPages > 1 && (
  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
)}
    </div>
  )
}

export default TopUniversities