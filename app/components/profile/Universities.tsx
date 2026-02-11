'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { hasFlag } from 'country-flag-icons'
import * as Flags from 'country-flag-icons/react/3x2'
import type { UniversityInterface } from '@/store/universitystore'

// Country name to ISO code mapping
const countryToCode: Record<string, string> = {
  'uk': 'GB',
  'usa': 'US',
  'canada': 'CA',
  'dubai': 'AE',
  'australia': 'AU',
  'france': 'FR',
  'italy': 'IT',
  'sweden': 'SE',
  'germany': 'DE',
}

// Get country code
const getCountryCode = (country: string): string | null => {
  const normalized = country.toLowerCase().trim()
  return countryToCode[normalized] || null
}

// Flag component
const CountryFlag: React.FC<{ country: string; className?: string }> = ({ country, className = "w-6 h-4" }) => {
  const code = getCountryCode(country)
  
  if (!code || !hasFlag(code)) {
    return <span className={`${className} inline-block bg-gray-200 rounded`}></span>
  }
  
  const FlagComponent = Flags[code as keyof typeof Flags]
  return FlagComponent ? <FlagComponent className={className} /> : null
}

export default function Universities() {
  const [searchQuery, setSearchQuery] = useState('')
  const [universities, setUniversities] = useState<UniversityInterface[]>([])
  const [filteredUniversities, setFilteredUniversities] = useState<UniversityInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false)

  // Preferred countries - ONLY these will be shown
  const preferredCountries = useMemo(() => [
    "USA",
    "UK",
    "Canada",
    "Dubai",
    "Australia",
    "France",
    "Italy",
    "Sweden",
    "Germany"
  ], [])

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/universities?page=1&limit=100`)
      const data = await response.json()
      
      if (data.universities) {
        // Filter universities to only show those from preferred countries
        const filtered = data.universities.filter((uni: UniversityInterface) =>
          preferredCountries.some(country => 
            uni.country?.toLowerCase() === country.toLowerCase()
          )
        )
        setUniversities(filtered)
        setFilteredUniversities(filtered)
      }
    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search and filter
  useEffect(() => {
    let filtered = universities

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter(uni => uni.country?.toLowerCase() === selectedCountry.toLowerCase())
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(uni =>
        uni.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.country?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredUniversities(filtered)
  }, [searchQuery, selectedCountry, universities])

  const filteredCountries = preferredCountries.filter(country =>
    country.toLowerCase().includes(countrySearchQuery.toLowerCase())
  )

  return (
    <section className="py-8 px-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          University Selection
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and compare your dream universities
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Country Selector */}
        <div className="relative">
          <button
            onClick={() => setIsCountryModalOpen(true)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer flex items-center gap-2 min-w-[160px]"
          >
            {selectedCountry || 'All Countries'}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Search Box */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search universities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Compare Button */}
        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
          Compare selected
        </button>
      </div>

      {/* Country Modal */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Country</h2>
              <button
                onClick={() => {
                  setIsCountryModalOpen(false)
                  setCountrySearchQuery('')
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries"
                value={countrySearchQuery}
                onChange={(e) => setCountrySearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 border-2 border-red-500 rounded-lg focus:outline-none"
              />
            </div>

            {/* Countries List */}
            <div className="space-y-2">
              {/* All Countries Option */}
              <button
                onClick={() => {
                  setSelectedCountry('')
                  setIsCountryModalOpen(false)
                  setCountrySearchQuery('')
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  selectedCountry === ''
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-xl">🌍</span>
                <span className="font-semibold text-gray-900 dark:text-white">All Countries</span>
              </button>

              {/* Country Options */}
              {filteredCountries.map(country => (
                <button
                  key={country}
                  onClick={() => {
                    setSelectedCountry(country)
                    setIsCountryModalOpen(false)
                    setCountrySearchQuery('')
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    selectedCountry === country
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <CountryFlag country={country} className="w-6 h-4" />
                  <span className="font-semibold text-gray-900 dark:text-white">{country}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading universities...</div>
        </div>
      )}

      {/* Universities Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map(university => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredUniversities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No universities found</p>
        </div>
      )}
    </section>
  )
}

function UniversityCard({ university }: { university: UniversityInterface }) {
  const courseCount = university.courses?.length || 0

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
        {university.imageUrls?.[0] && (
          <img
            src={university.imageUrls[0]}
            alt={university.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded-full font-semibold">
          {university.country}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          {university.name}
        </h3>
        
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          {university.country} • {university.location}
        </p>

        {/* Courses & QS Ranking */}
        <div className="space-y-2 mb-4">
          {courseCount > 0 && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">{courseCount}</span>
              <span className="text-xs text-gray-500"> courses available</span>
            </div>
          )}
          {university.qsRanking && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">QS Ranking:</span>
              <span className="text-xs text-gray-500"> {university.qsRanking}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Apply Now
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            Compare
          </button>
          <button className="px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            ♡
          </button>
        </div>
      </div>
    </div>
  )
}
