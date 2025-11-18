"use client"

import { useState } from "react"
import Hero from "../components/Select/Page/Hero"
import type { FilterValues } from "../components/Select/Page/Hero"
import TopUniversities from "../components/Select/Page/TopUniversities"

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterValues | undefined>(undefined)

  const handleSearch = (query: string, filterValues?: FilterValues) => {
    setSearchQuery(query)
    setFilters(filterValues)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero onSearch={handleSearch} />
      <TopUniversities
        searchQuery={searchQuery}
        filters={filters}
      />
    </div>
  )
}

export default Page
