"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import UniversityApplicationModal from "../Models/UniversityApplicationModal"
import UniversityCompareModal from "../Models/UniversityCompareModal"
import WiseListModal from "../Models/WiseListModal"
import { Building2, Heart } from "lucide-react"
import UniversityCardSkeleton from "./UniversityCardSkeleton"
import UniversityCard from "./UniversityCard"
import Pagination from "../../ui/pagination"
import Loader from "../../ui/Loader"
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

  // Use the hook
  const {
    currentUniversities,
    isLoading,
    showLoader,
    error,
    setModalInteraction,
    hasData,
    isEmpty,
    isHydrated,
    totalPages,
    currentPage,
    handlePageChange,
  } = useUniversities({
    searchQuery,
    filters,
    autoFetch: true,
  })

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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 place-items-center">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <UniversityCardSkeleton key={`skeleton-${index}`} />
        ))}
    </div>
  )

  // Show skeleton during initial loading
  if (showLoader) {
    console.log("🔄 Showing skeleton loader")
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
    <div className="flex flex-col min-h-screen p-4 md:p-16 lg:p-20 2xl:p-28 text-left font-sans">
      {/* Show loader overlay when fetching additional data */}
      {isLoading && hasData && <Loader isLoading={true} />}

      <div className="mb-8 sm:mb-8 lg:mb-8 flex flex-col items-start justify-between">
        {/* <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2">
          <span>Top Universities</span>
        </h1> */}
        <div className="h-full flex-col gap-4 flex items-center">
          <h1 className="md:text-5xl 2xl:text-[90px] text-3xl font-bold  2xl:leading-[87px] md:leading-[70px] leading-[43px] text-black text-center">
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
      ) : isEmpty || isLoading ? (
        // Always show skeleton when loading or when no data
        renderSkeletonCards()
      ) : (
        // Show data when available
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 place-items-center">
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