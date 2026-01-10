"use client"

import type React from "react"
import { useCallback, useRef, useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import CountryModal from "../Models/CountryModal"
import UniversityNameModal from "../Models/UniversityNameModal"
import FeesModal from "../Models/FeesModal"
import CourseModal from "../Models/CourseModal"
import { useUniversities } from "@/hooks/useUniversities"
import type { UniversityInterface } from "@/store/universitystore"

interface SearchProps {
  onSearch: (query: string, filters?: FilterValues) => void
}

export interface FilterValues {
  country: string
  universityName: string
  fees: string
  course: string
}

const Hero: React.FC<SearchProps> = ({ onSearch }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    country: "",
    universityName: "",
    fees: "",
    course: "",
  })

  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0, width: 0 })
  const [isMobile, setIsMobile] = useState(false)

  // Use the universities hook to get data for filter options
  // Note: This fetches the first page, which should be enough for filter dropdowns
  // For a complete list, we might need a separate endpoint or fetch all pages
  const { universities: hookUniversities } = useUniversities({
    searchQuery: "",
    filters: undefined,
    autoFetch: true,
  })

  // Use hook data for filter options
  const universitiesData = hookUniversities

  // Extract unique countries from universities data
  const countries = [...new Set(universitiesData.map((uni) => uni.country).filter(Boolean))].sort()

  // Extract unique university names from universities data
  const universityNames = [...new Set(universitiesData.map((uni) => uni.name).filter(Boolean))].sort()

  // Extract unique course names from universities data
  const courses = [...new Set(universitiesData.flatMap((uni) => uni.courses.map((course) => course.name)))]
    .filter(Boolean)
    .sort()

  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close modal on scroll
  useEffect(() => {
    if (!activeModal) return

    const handleScroll = () => {
      if (activeModal) {
        setActiveModal(null)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeModal])

  // Apply filters and close modal (don't trigger search - wait for search button)
  const applyFilter = useCallback(
    (filterType: keyof FilterValues, value: any) => {
      setActiveFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }))
      setActiveModal(null)
      // Don't call onSearch here - filters will apply when search button is clicked
    },
    [],
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      country: "",
      universityName: "",
      fees: "",
      course: "",
    })
    onSearch("", {
      country: "",
      universityName: "",
      fees: "",
      course: "",
    })
  }, [onSearch])

  // Clear specific filter (don't trigger search - wait for search button)
  const clearFilter = useCallback(
    (filterType: keyof FilterValues) => {
      setActiveFilters((prev) => ({
        ...prev,
        [filterType]: "",
      }))
      // Don't call onSearch here - filters will apply when search button is clicked
    },
    [],
  )

  // Toggle modal visibility with improved handling
  const toggleModal = useCallback(
    (modalName: string | null, e?: React.MouseEvent | React.TouchEvent) => {
      // If this was triggered by a click/touch event, prevent it from bubbling
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }

      // Detect iOS
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

      // If we're on the same modal, close it
      if (activeModal === modalName) {
        setActiveModal(null)
        return
      }

      // iOS-specific handling
      if (isIOS) {
        // First close any open modal
        setActiveModal(null)

        // Use a longer timeout for iOS to ensure the previous modal is fully closed
        setTimeout(() => {
          setActiveModal(modalName)
        }, 100)
      } else {
        // For non-iOS devices, just set the active modal directly
        setActiveModal(modalName)
      }
    },
    [activeModal],
  )

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModal) {
        setActiveModal(null)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [activeModal])

  // Prevent body scroll when modal is open on mobile with improved iOS handling
  useEffect(() => {
    if (activeModal && isMobile) {
      // Save current scroll position
      const scrollY = window.scrollY

      // Detect iOS
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

      // Apply different fixes based on device
      if (isIOS) {
        // iOS-specific approach
        document.body.style.position = "fixed"
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = "100%"
        document.body.style.overflow = "hidden"

        // Additional iOS-specific fixes
        document.documentElement.style.overflow = "hidden"
        document.documentElement.style.height = "100%"

        // Prevent touchmove on body for iOS
        const preventTouchMove = (e: TouchEvent) => {
          if (e.target === document.body) {
            e.preventDefault()
          }
        }

        document.body.addEventListener("touchmove", preventTouchMove, { passive: false })

        return () => {
          // Cleanup for iOS
          document.body.style.position = ""
          document.body.style.top = ""
          document.body.style.width = ""
          document.body.style.overflow = ""
          document.documentElement.style.overflow = ""
          document.documentElement.style.height = ""

          // Remove event listener
          document.body.removeEventListener("touchmove", preventTouchMove)

          // Restore scroll position
          window.scrollTo(0, scrollY)
        }
      } else {
        // Non-iOS approach
        document.body.style.overflow = "hidden"

        return () => {
          document.body.style.overflow = ""
        }
      }
    }
  }, [activeModal, isMobile])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoadedData = () => {};
      const handleError = (e: Event) => {
        // console.error("Error loading video:", e)
        setVideoError("Error loading video")
      }

      video.addEventListener("loadeddata", handleLoadedData)
      video.addEventListener("error", handleError)

      video.load()

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData)
        video.removeEventListener("error", handleError)
      }
    }
  }, [])

  // Update modal position based on clicked element
  const updateModalPosition = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    filterType: string,
  ) => {
    const element = e.currentTarget
    const rect = element.getBoundingClientRect()

    if (!isMobile) {
      // On desktop, position directly below the clicked field
      // Calculate available space to ensure modal is visible
      const viewportWidth = window.innerWidth

      // Default position below the clicked element
      let left = rect.left
      const top = rect.bottom

      // Ensure modal doesn't go off-screen to the right
      if (left + rect.width > viewportWidth - 20) {
        left = Math.max(20, viewportWidth - rect.width - 20)
      }

      setModalPosition({
        top,
        left,
        width: rect.width,
      })
    }
    // On mobile, we don't need to set position as we'll use fixed positioning
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some((filter) => filter !== "")

  // Helper function to handle filter item touch/click events
  const handleFilterInteraction = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    filterType: string,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    updateModalPosition(e, filterType)
    toggleModal(filterType, e)
  }

  return (
    <div className="relative h-[80vh] mt-0 w-screen overflow-hidden">
      {videoError && <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-2 z-50">{videoError}</div>}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source
          src="https://ik.imagekit.io/99y1fc9mh/secure/videos/Select-hero-video.mp4?updatedAt=1736144671299"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Modal container */}
      {activeModal && (
        <>
          {/* Backdrop only for mobile */}
          {isMobile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" onClick={() => setActiveModal(null)} />
          )}

          {isMobile ? (
            // Mobile: Fixed positioning at the bottom of the screen with iOS-specific fixes
            <div
              className="fixed inset-0 z-[10000]"
              ref={modalRef}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setActiveModal(null)
              }}
              style={{
                pointerEvents: "auto",
                touchAction: "none", // Prevent iOS from handling touch events in unexpected ways
              }}
            >
              <div
                className="fixed bottom-0 left-0 right-0 w-full mx-auto rounded-t-xl bg-white overflow-hidden z-[10001] max-h-[80vh]"
                style={{
                  pointerEvents: "auto",
                  transform: "translate3d(0,0,0)", // Force hardware acceleration
                  WebkitOverflowScrolling: "touch", // Improve iOS scrolling
                  touchAction: "auto", // Allow touch events within the modal
                  // Ensure the modal is visually stable
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                  perspective: "1000px",
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
             

                {activeModal === "country" && (
                  <CountryModal
                    onSelect={(country) => applyFilter("country", country)}
                    selectedCountry={activeFilters.country}
                    countries={countries.length > 0 ? countries : undefined}
                    isOpen={true}
                    isMobile={true}
                  />
                )}

                {activeModal === "universityName" && (
                  <UniversityNameModal
                    onSelect={(name) => applyFilter("universityName", name)}
                    selectedName={activeFilters.universityName}
                    universities={universityNames.length > 0 ? universityNames : undefined}
                    isOpen={true}
                    isMobile={true}
                  />
                )}

                {activeModal === "fees" && (
                  <FeesModal
                    onSelect={(value) => applyFilter("fees", value)}
                    selectedFees={activeFilters.fees}
                    isOpen={true}
                    isMobile={true}
                  />
                )}

                {activeModal === "course" && (
                  <CourseModal
                    onSelect={(value) => applyFilter("course", value)}
                    selectedCourse={activeFilters.course}
                    courses={courses.length > 0 ? courses : undefined}
                    isOpen={true}
                    isMobile={true}
                  />
                )}
              </div>
            </div>
          ) : (
            // Desktop: Position relative to the clicked element
            <div
              className="fixed inset-0 z-[10000]"
              ref={modalRef}
              onClick={() => setActiveModal(null)}
              style={{ pointerEvents: "none" }}
            >
              <div
                className="absolute bg-white rounded-lg shadow-xl overflow-hidden overflow-y-auto scrollbar-hide"
                style={{
                  top: `${modalPosition.top}px`,
                  left: `${modalPosition.left}px`,
                  width: `${Math.max(modalPosition.width, 320)}px`, // Minimum width of 320px
                  height:"60%",
                  pointerEvents: "auto",
                  zIndex: 10001,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {activeModal === "country" && (
                  <CountryModal
                    onSelect={(country) => applyFilter("country", country)}
                    selectedCountry={activeFilters.country}
                    countries={countries.length > 0 ? countries : undefined}
                    isOpen={true}
                    isMobile={false}
                  />
                )}

                {activeModal === "universityName" && (
                  <UniversityNameModal
                    onSelect={(name) => applyFilter("universityName", name)}
                    selectedName={activeFilters.universityName}
                    universities={universityNames.length > 0 ? universityNames : undefined}
                    isOpen={true}
                    isMobile={false}
                  />
                )}

                {activeModal === "fees" && (
                  <FeesModal
                    onSelect={(value) => applyFilter("fees", value)}
                    selectedFees={activeFilters.fees}
                    isOpen={true}
                    isMobile={false}
                  />
                )}

                {activeModal === "course" && (
                  <CourseModal
                    onSelect={(value) => applyFilter("course", value)}
                    selectedCourse={activeFilters.course}
                    courses={courses.length > 0 ? courses : undefined}
                    isOpen={true}
                    isMobile={false}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="relative z-10 flex items-end md:items-center h-full w-full bg-black bg-opacity-20">
        <div className="flex flex-col xl:pt-[0px] md:px-20 px-4 gap-10 md:gap-20 md:pt-[90px] md:mt-10 w-full">
         

          {/* Airbnb-style search bar */}
          <div className="pb-10 md:pb-0 w-full" ref={searchBarRef}>
            <div className="bg-white rounded-3xl md:rounded-full shadow-lg max-w-5xl mx-auto">
              {/* Using a grid layout for more control */}
              <div className="grid md:grid-cols-5 grid-cols-1">
                {/* Country Filter - Fixed column */}
                <div
                  className="search-filter px-8 py-3 md:py-4 cursor-pointer border-b md:border-b-0 md:border-r border-gray-200"
                  onClick={(e) => handleFilterInteraction(e, "country")}
                  onTouchEnd={(e) => handleFilterInteraction(e, "country")}
                >
                  <div className="text-sm font-semibold">Country</div>
                  <div className="flex items-center">
                    <div className="text-gray-500 truncate max-w-full">{activeFilters.country || "Any country"}</div>
                    {activeFilters.country && (
                      <button
                        className="ml-1 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearFilter("country")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* University Name Filter - Fixed column */}
                <div
                  className="search-filter px-8 py-3 md:py-4 cursor-pointer border-b md:border-b-0 md:border-r border-gray-200"
                  onClick={(e) => handleFilterInteraction(e, "universityName")}
                  onTouchEnd={(e) => handleFilterInteraction(e, "universityName")}
                >
                  <div className="text-sm font-semibold">University Name</div>
                  <div className="flex items-center">
                    <div className="text-gray-500 truncate max-w-full">
                      {activeFilters.universityName || "Any university"}
                    </div>
                    {activeFilters.universityName && (
                      <button
                        className="ml-1 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearFilter("universityName")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Fees Filter - Fixed column */}
                <div
                  className="search-filter px-8 py-3 md:py-4 cursor-pointer border-b md:border-b-0 md:border-r border-gray-200"
                  onClick={(e) => handleFilterInteraction(e, "fees")}
                  onTouchEnd={(e) => handleFilterInteraction(e, "fees")}
                >
                  <div className="text-sm font-semibold">Fees</div>
                  <div className="flex items-center">
                    <div className="text-gray-500 truncate max-w-full">{activeFilters.fees || "Any range"}</div>
                    {activeFilters.fees && (
                      <button
                        className="ml-1 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearFilter("fees")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Course Filter - Fixed column */}
                <div
                  className="search-filter px-8 py-3 md:py-4 cursor-pointer border-b md:border-b-0 border-gray-200"
                  onClick={(e) => handleFilterInteraction(e, "course")}
                  onTouchEnd={(e) => handleFilterInteraction(e, "course")}
                >
                  <div className="text-sm font-semibold">Course</div>
                  <div className="flex items-center">
                    <div className="text-gray-500 truncate max-w-full">{activeFilters.course || "Any course"}</div>
                    {activeFilters.course && (
                      <button
                        className="ml-1 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearFilter("course")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Button - Fixed in its own column */}
                <div className="flex items-center justify-center md:justify-end p-2 md:p-3">
                  <button
                    className="bg-[#BE243C] text-white py-2 px-3 md:p-4 rounded-full flex items-center justify-center hover:bg-[#a01f35] transition-colors gap-2"
                    onClick={() => onSearch("", activeFilters)}
                  >
                    <span className="font-bold">Search</span>
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero