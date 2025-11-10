"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Hero from "@/app/components/Select/Profile/Hero"
import Gallery from "@/app/components/Select/Profile/Gallery"
import Courses from "@/app/components/Select/Profile/Courses"
import StudentReviewCarousel from "@/app/components/Select/Profile/StudentsReview"
import { useUniversitySelectors, useUniversityActions, type UniversityInterface } from "@/store/universitystore"
import FAQ from "./FAQ"
import UniversityCareerOutcomes from "./UniversityCareer"

interface UniversityPageClientProps {
  slug: string
}

// Loading skeleton component
const UniversityPageSkeleton = () => (
  <main className="min-h-screen w-full">
    <div className="w-full flex flex-col items-center justify-center space-y-8 p-4">
      {/* Hero skeleton */}
      <div className="w-full max-w-6xl h-64 md:h-80 lg:h-96 animate-pulse bg-gray-200 rounded-lg"></div>

      {/* Student reviews skeleton */}
      <div className="w-full max-w-6xl h-64 animate-pulse bg-gray-200 rounded-lg"></div>

      {/* Gallery skeleton */}
      <div className="w-full max-w-6xl h-96 animate-pulse bg-gray-200 rounded-lg"></div>

      {/* Courses skeleton */}
      <div className="w-full max-w-6xl h-96 animate-pulse bg-gray-200 rounded-lg"></div>
    </div>
  </main>
)

export default function UniversityPageClient({ slug }: UniversityPageClientProps) {
  const router = useRouter()
  const [university, setUniversity] = useState<UniversityInterface | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { universities, universityDetails, hasHydrated } = useUniversitySelectors()
  const { fetchUniversityById, getUniversityById } = useUniversityActions()

  // Enhanced function to find university in different ways
  const findUniversityInStore = useCallback(
    (slug: string): UniversityInterface | null => {
      console.log("🔍 Searching for university with slug:", slug)

      // Helper function to match university by different criteria
      const matchUniversity = (uni: UniversityInterface): boolean => {
        const matches = [
          uni.slug === slug,
          uni.id === slug,
          uni.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase(),
          uni.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug.toLowerCase(),
          uni.name.toLowerCase() === slug.toLowerCase().replace(/-/g, " "),
        ]

        return matches.some((match) => match)
      }

      // First, try to find in the main universities list (from cache)
      const foundInMain = universities.find(matchUniversity)
      if (foundInMain) {
        console.log("✅ Found university in main cache:", foundInMain.name)
        return foundInMain
      }

      // Second, try to find in university details cache
      const foundInDetails = Object.values(universityDetails).find(matchUniversity)
      if (foundInDetails) {
        console.log("✅ Found university in details cache:", foundInDetails.name)
        return foundInDetails
      }

      // Third, try to get by ID directly (if slug is an ID)
      const foundById = getUniversityById(slug)
      if (foundById) {
        console.log("✅ Found university by ID:", foundById.name)
        return foundById
      }

      console.log("❌ University not found in store")
      return null
    },
    [universities, universityDetails, getUniversityById],
  )

  // Enhanced API fetch function with better error handling for slug-based queries
  const fetchUniversityFromAPI = useCallback(async (slug: string): Promise<UniversityInterface | null> => {
    try {
      console.log("🌐 Fetching university from API with slug:", slug)

      // Try different API endpoints - PRIORITIZING SLUG-BASED QUERIES
      const endpoints = [
        `/api/universities?slug=${encodeURIComponent(slug)}`,
        // `/api/universities/${encodeURIComponent(slug)}`,
        `/api/universities?id=${encodeURIComponent(slug)}`,
      ]

      for (const endpoint of endpoints) {
        try {
          console.log("🌐 Trying endpoint:", endpoint)

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })

          console.log("📡 Response status:", response.status)

          if (response.ok) {
            const data = await response.json()
            console.log("✅ API Response received:", JSON.stringify(data, null, 2))
            console.log("✅ API Response careerOutcomes:", data.careerOutcomes)
            console.log("✅ API Response careerOutcomes length:", data.careerOutcomes?.length)

            // Handle different response formats
            let university: UniversityInterface | null = null

            if (data.university) {
              university = data.university
            } else if (data.universities && Array.isArray(data.universities) && data.universities.length > 0) {
              university = data.universities[0]
            } else if (data.id) {
              university = data
            }

            if (university && university.id) {
              console.log("✅ Successfully parsed university:", university.name)
              console.log("✅ Parsed university careerOutcomes:", university.careerOutcomes)
              console.log("✅ Parsed university careerOutcomes length:", university.careerOutcomes?.length)
              console.log("✅ Parsed university careerOutcomes type:", typeof university.careerOutcomes)
              console.log("✅ Parsed university careerOutcomes isArray:", Array.isArray(university.careerOutcomes))
              return university
            }
          } else if (response.status === 404) {
            console.log("❌ University not found at endpoint:", endpoint)
            continue // Try next endpoint
          } else {
            console.log("❌ API error at endpoint:", endpoint, response.status)
            continue // Try next endpoint
          }
        } catch (endpointError) {
          console.log("❌ Error with endpoint:", endpoint, endpointError)
          continue // Try next endpoint
        }
      }

      console.log("❌ All API endpoints failed")
      return null
    } catch (error) {
      console.error("❌ API fetch error:", error)
      return null
    }
  }, [])

  // Main effect to find and load university
  useEffect(() => {
    const loadUniversity = async () => {
      console.log("🚀 Starting university load process for slug:", slug)

      // Wait for store hydration
      if (!hasHydrated) {
        console.log("⏸️ Waiting for store hydration...")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Step 1: Try to find in store first
        console.log("📋 Step 1: Checking store for university...")
        const foundUniversity = findUniversityInStore(slug)

        if (foundUniversity) {
          console.log("✅ Using university from store:", foundUniversity.name)
          console.log("✅ Using university from store Data:", foundUniversity)
          setUniversity(foundUniversity)
          setIsLoading(false)
          return
        }

        // Step 2: Try using the store's fetchUniversityById method (now optimized for slugs)
        console.log("📋 Step 2: Using store's fetchUniversityById...")
        const storeResult = await fetchUniversityById(slug)

        if (storeResult) {
          console.log("✅ Successfully fetched via store:", storeResult.name)
          setUniversity(storeResult)
          setIsLoading(false)
          return
        }

        // Step 3: Try direct API call as fallback
        console.log("📋 Step 3: Trying direct API call...")
        const apiResult = await fetchUniversityFromAPI(slug)

        if (apiResult) {
          console.log("✅ Successfully fetched via direct API:", apiResult.name)
          setUniversity(apiResult)
          setIsLoading(false)
          return
        }

        // Step 4: If still not found, set error
        console.log("❌ University not found after all attempts")
        setError("University not found")
      } catch (err) {
        console.error("❌ Error in loadUniversity:", err)
        setError("Failed to load university details")
      } finally {
        setIsLoading(false)
      }
    }

    loadUniversity()
  }, [slug, hasHydrated, findUniversityInStore, fetchUniversityById, fetchUniversityFromAPI])

  // Debug effect to log current state
  useEffect(() => {
    console.log("🔍 Current state:", {
      slug,
      hasHydrated,
      isLoading,
      error,
      university: university?.name || null,
      universitiesInStore: universities.length,
      universityDetailsInStore: Object.keys(universityDetails).length,
    })
  }, [slug, hasHydrated, isLoading, error, university, universities.length, universityDetails])

  // Show loading skeleton while loading or before hydration
  if (!hasHydrated || isLoading) {
    console.log("🔄 Showing loading skeleton")
    return <UniversityPageSkeleton />
  }

  // Show error state
  if (error || !university) {
    console.log("❌ Showing error state:", error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error === "University not found" ? "University Not Found" : "Error Loading University"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === "University not found"
              ? `The university "${slug}" could not be found. It may have been removed or the URL is incorrect.`
              : `There was a problem loading the university details: ${error}`}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/select")}
              className="block w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Universities
            </button>
          </div>
        </div>
      </div>
    )
  }

  console.log("✅ Rendering university page for:", university.name)
  console.log("✅ Rendering university Data", university)
  console.log("✅ careerOutcomes", university.careerOutcomes)
  console.log("✅ careerOutcomes type:", typeof university.careerOutcomes)
  console.log("✅ careerOutcomes isArray:", Array.isArray(university.careerOutcomes))
  console.log("✅ careerOutcomes length:", university.careerOutcomes?.length)
  
  // Extract career outcome data for debugging
  console.log("🔍 Raw university.careerOutcomes:", university.careerOutcomes)
  console.log("🔍 university.careerOutcomes type:", typeof university.careerOutcomes)
  console.log("🔍 university.careerOutcomes isArray:", Array.isArray(university.careerOutcomes))
  console.log("🔍 university.careerOutcomes length:", university.careerOutcomes?.length)
  
  const careerOutcomeData = university.careerOutcomes && 
    Array.isArray(university.careerOutcomes) &&
    university.careerOutcomes.length > 0 
      ? university.careerOutcomes[0] 
      : null
      
  console.log("✅ Extracted careerOutcomeData:", JSON.stringify(careerOutcomeData, null, 2))
  console.log("✅ careerOutcomeData type:", typeof careerOutcomeData)
  console.log("✅ careerOutcomeData is null:", careerOutcomeData === null)
  console.log("✅ careerOutcomeData keys:", careerOutcomeData ? Object.keys(careerOutcomeData) : [])
  
  if (careerOutcomeData) {
    console.log("✅ Career outcome has salaryChartData:", !!careerOutcomeData.salaryChartData, careerOutcomeData.salaryChartData?.length)
    console.log("✅ Career outcome has employmentRateMeter:", !!careerOutcomeData.employmentRateMeter)
    console.log("✅ Career outcome has courseTimelineData:", !!careerOutcomeData.courseTimelineData, careerOutcomeData.courseTimelineData?.length)
  } else {
    console.log("❌ No career outcome data found for university")
    console.log("❌ This means either:")
    console.log("   - university.careerOutcomes is null/undefined")
    console.log("   - university.careerOutcomes is not an array")
    console.log("   - university.careerOutcomes is an empty array")
  }

  // Show university details
  return (
    <main className="min-h-screen w-screen">
      <div className="w-full flex flex-col items-center justify-center">
        <Suspense fallback={<div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg"></div>}>
          <Hero university={university} />
        </Suspense>

        <Suspense fallback={<div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg"></div>}>
          <StudentReviewCarousel university={university} />
        </Suspense>

        <Suspense fallback={<div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg"></div>}>
          {careerOutcomeData ? (
            <UniversityCareerOutcomes 
              universityData={careerOutcomeData} 
            />
          ) : (
            <UniversityCareerOutcomes 
              universityData={null} 
            />
          )}
        </Suspense>

        <Suspense fallback={<div className="w-full h-96 animate-pulse bg-gray-200 rounded-lg"></div>}>
          <Gallery university={university} />
        </Suspense>

        <Suspense fallback={<div className="w-full h-96 animate-pulse bg-gray-200 rounded-lg"></div>}>
          <FAQ faqData={university.faqs} />
        </Suspense>

        <Suspense fallback={<div className="w-full h-96 animate-pulse bg-gray-200 rounded-lg"></div>}>
          <Courses university={university} />
        </Suspense>
      </div>
    </main>
  )
}
