"use client"

import { useState, useEffect, useMemo } from "react"
import Hero from "../components/Select/Page/Hero"
import type { FilterValues } from "../components/Select/Page/Hero"
import type { UniversityInterface } from "@/store/universitystore"
import TopUniversities from "../components/Select/Page/TopUniversities"

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterValues | undefined>(undefined)
  const [allUniversities, setAllUniversities] = useState<UniversityInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all universities once on component mount
  useEffect(() => {
    const fetchAllUniversities = async () => {
      try {
        setIsLoading(true)
        const NextUrl = process.env.NEXTAUTH_URL || window.location.origin
        const url = new URL(`${NextUrl}/api/universities`)
        url.searchParams.append("limit", "10") // Fetch a larger batch initially

        const response = await fetch(url.toString())
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setAllUniversities(data.universities || [])
      } catch (error) {
        console.error("Error fetching universities:", error)
        setError("Failed to load universities. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllUniversities()
  }, [])

  const handleSearch = (query: string, filterValues?: FilterValues) => {
    setSearchQuery(query)
    setFilters(filterValues)
  }

  // Filter universities client-side based on search query and filters
  const filteredUniversities = useMemo(() => {
    return allUniversities.filter((university) => {
      // Apply search query filter
      if (searchQuery && !university.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Apply country filter
      if (filters?.country && university.country !== filters.country) {
        return false
      }

      // Apply university name filter
      if (filters?.universityName && university.name !== filters.universityName) {
        return false
      }

      // Apply fees filter
      if (filters?.fees && filters.fees !== "Any range") {
        // Get the average fees from all courses
        const courseFees = university.courses.map((course) => {
          // Handle different fee formats (assuming fees might be stored as string like "$10,000" or "10000")
          const feeValue = Number.parseFloat(course.fees.replace(/[^0-9.]/g, ""))
          return isNaN(feeValue) ? 0 : feeValue
        })

        const avgFees = courseFees.length > 0 ? courseFees.reduce((sum, fee) => sum + fee, 0) / courseFees.length : 0

        // Parse the selected fee range
        if (filters.fees === "Under $10,000" && avgFees >= 10000) {
          return false
        } else if (filters.fees === "$10,000 - $20,000" && (avgFees < 10000 || avgFees > 20000)) {
          return false
        } else if (filters.fees === "$20,000 - $30,000" && (avgFees < 20000 || avgFees > 30000)) {
          return false
        } else if (filters.fees === "$30,000 - $40,000" && (avgFees < 30000 || avgFees > 40000)) {
          return false
        } else if (filters.fees === "Above $40,000" && avgFees <= 40000) {
          return false
        }
      }

      // Apply course filter
      if (filters?.course) {
        // Check if any course in the university matches the selected course
        const hasCourse = university.courses.some(
          (course) => course.name.toLowerCase() === filters.course?.toLowerCase(),
        )
        if (!hasCourse) {
          return false
        }
      }

      return true
    })
  }, [allUniversities, searchQuery, filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero onSearch={handleSearch} universities={allUniversities} />
      <TopUniversities
        searchQuery={searchQuery}
        filters={filters}
        universities={filteredUniversities}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}

export default Page
