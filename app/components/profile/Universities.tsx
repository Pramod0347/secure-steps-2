'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import { hasFlag } from 'country-flag-icons'
import * as Flags from 'country-flag-icons/react/3x2'
import type { UniversityInterface } from '@/store/universitystore'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { toast } from 'sonner'
import CourseSelectionModal from '@/app/components/Select/Models/CourseSelectionModal'

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
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [universities, setUniversities] = useState<UniversityInterface[]>([])
  const [filteredUniversities, setFilteredUniversities] = useState<UniversityInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [selectedUniversityForCompare, setSelectedUniversityForCompare] = useState<UniversityInterface | null>(null)
  const [compareSearchQuery, setCompareSearchQuery] = useState('')
  const [compareWithUniversity, setCompareWithUniversity] = useState<UniversityInterface | null>(null)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [selectedUniversityForWishlist, setSelectedUniversityForWishlist] = useState<UniversityInterface | null>(null)

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

  const handleCompare = (university: UniversityInterface) => {
    setSelectedUniversityForCompare(university)
    setCompareWithUniversity(null)
    setCompareSearchQuery('')
    setIsCompareModalOpen(true)
  }

  const handleApply = (university: UniversityInterface) => {
    const universitySlug = university.slug || university.id
    if (!universitySlug) {
      toast.error('Unable to open university page')
      return
    }
    router.push(`/select/${universitySlug}`)
  }

  const handleWishlist = (university: UniversityInterface) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to add to wishlist')
      return
    }

    if (!university.courses?.length) {
      toast.error('No courses available for this university')
      return
    }

    setSelectedUniversityForWishlist(university)
    setIsCourseModalOpen(true)
  }

  const handleCourseSelect = async (courseId: string, courseName: string) => {
    if (!isAuthenticated || !user || !selectedUniversityForWishlist) {
      toast.error('Please login to add to wishlist')
      return
    }

    const response = await fetch('/api/auth/fav-courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        courseId,
        courseName,
        universityId: selectedUniversityForWishlist.id,
        universityName: selectedUniversityForWishlist.name,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to add to wishlist')
    }

    const data = await response.json()
    if (data.message === 'Already in favorites') {
      toast.info('This course is already in your wishlist')
      return
    }

    toast.success('Added to your wishlist')
  }

  const compareCandidates = useMemo(() => {
    if (!selectedUniversityForCompare) return []

    return filteredUniversities.filter((uni) => {
      if (uni.id === selectedUniversityForCompare.id) return false

      if (!compareSearchQuery.trim()) return true

      const query = compareSearchQuery.toLowerCase().trim()
      return (
        uni.name?.toLowerCase().includes(query) ||
        uni.country?.toLowerCase().includes(query) ||
        uni.location?.toLowerCase().includes(query)
      )
    })
  }, [filteredUniversities, selectedUniversityForCompare, compareSearchQuery])

  return (
    <section className="p-8 bg-white dark:bg-black min-h-screen">
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
        <button
          onClick={() => selectedUniversityForCompare && setIsCompareModalOpen(true)}
          disabled={!selectedUniversityForCompare}
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
            <UniversityCard
              key={university.id}
              university={university}
              onCompare={handleCompare}
              onApply={handleApply}
              onWishlist={handleWishlist}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredUniversities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No universities found</p>
        </div>
      )}

      {selectedUniversityForCompare && (
        <ProfileUniversityCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => {
            setIsCompareModalOpen(false)
            setCompareSearchQuery('')
            setCompareWithUniversity(null)
          }}
          selectedUniversity={selectedUniversityForCompare}
          compareWithUniversity={compareWithUniversity}
          onSelectCompareUniversity={setCompareWithUniversity}
          compareSearchQuery={compareSearchQuery}
          onCompareSearchChange={setCompareSearchQuery}
          compareCandidates={compareCandidates}
        />
      )}

      {selectedUniversityForWishlist && (
        <CourseSelectionModal
          isOpen={isCourseModalOpen}
          onClose={() => {
            setIsCourseModalOpen(false)
            setSelectedUniversityForWishlist(null)
          }}
          courses={selectedUniversityForWishlist.courses}
          universityName={selectedUniversityForWishlist.name}
          onCourseSelect={handleCourseSelect}
        />
      )}
    </section>
  )
}

function UniversityCard({
  university,
  onCompare,
  onApply,
  onWishlist,
}: {
  university: UniversityInterface
  onCompare: (university: UniversityInterface) => void
  onApply: (university: UniversityInterface) => void
  onWishlist: (university: UniversityInterface) => void
}) {
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
          <button
            onClick={() => onApply(university)}
            className="flex-1 px-3 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Apply Now
          </button>
          <button
            onClick={() => onCompare(university)}
            className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Compare
          </button>
          <button
            onClick={() => onWishlist(university)}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            ♡
          </button>
        </div>
      </div>
    </div>
  )
}

function getFeesRange(university: UniversityInterface) {
  const fees = university.courses.map((course) => {
    const feeValue = parseFloat((course.fees || '').replace(/[^0-9.]/g, ''))
    return Number.isNaN(feeValue) ? 0 : feeValue
  })

  if (!fees.length) return 'N/A'
  const min = Math.min(...fees)
  const max = Math.max(...fees)
  if (min === 0 && max === 0) return 'N/A'
  return `${min.toLocaleString()} - ${max.toLocaleString()}`
}

function CompareUniversityHeroCard({ university }: { university: UniversityInterface }) {
  const establishedYear = university.established ? new Date(university.established).getFullYear() : 'N/A'

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden h-56">
        <img
          src={university.banner || university.imageUrls?.[0] || '/placeholder.svg'}
          alt={university.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h4 className="text-2xl font-bold leading-tight">{university.name}</h4>
          <p className="text-sm">{university.qsRanking || 'N/A Rank'}</p>
        </div>
      </div>
      <p className="text-xs text-gray-600">
        {university.location}, {university.country} • Est. {establishedYear}
      </p>
    </div>
  )
}

function ProfileUniversityCompareModal({
  isOpen,
  onClose,
  selectedUniversity,
  compareWithUniversity,
  onSelectCompareUniversity,
  compareSearchQuery,
  onCompareSearchChange,
  compareCandidates,
}: {
  isOpen: boolean
  onClose: () => void
  selectedUniversity: UniversityInterface
  compareWithUniversity: UniversityInterface | null
  onSelectCompareUniversity: (uni: UniversityInterface | null) => void
  compareSearchQuery: string
  onCompareSearchChange: (query: string) => void
  compareCandidates: UniversityInterface[]
}) {
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow || 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[5px] max-w-6xl w-[96vw] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="md:text-2xl text-lg font-bold text-black">Compare Universities</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-5">
            <h3 className="md:text-xl text-lg font-semibold text-black mb-3">Compare With</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search from displayed universities..."
                value={compareSearchQuery}
                onChange={(e) => onCompareSearchChange(e.target.value)}
                className="w-full p-3 border rounded-lg text-black"
              />
              {compareWithUniversity && (
                <button
                  onClick={() => onSelectCompareUniversity(null)}
                  className="px-4 py-3 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Change selection
                </button>
              )}
            </div>
          </div>

          {compareWithUniversity ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <CompareUniversityHeroCard university={selectedUniversity} />
                <CompareUniversityHeroCard university={compareWithUniversity} />
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                {[
                  {
                    label: 'Location',
                    left: `${selectedUniversity.location}, ${selectedUniversity.country}`,
                    right: `${compareWithUniversity.location}, ${compareWithUniversity.country}`,
                  },
                  {
                    label: 'Established',
                    left: selectedUniversity.established ? new Date(selectedUniversity.established).getFullYear().toString() : 'N/A',
                    right: compareWithUniversity.established ? new Date(compareWithUniversity.established).getFullYear().toString() : 'N/A',
                  },
                  {
                    label: 'Tuition Range',
                    left: getFeesRange(selectedUniversity),
                    right: getFeesRange(compareWithUniversity),
                  },
                  {
                    label: 'Total Courses',
                    left: String(selectedUniversity.courses?.length || 0),
                    right: String(compareWithUniversity.courses?.length || 0),
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[140px_1fr_1fr] items-center border-b border-gray-200 last:border-b-0"
                  >
                    <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-900">{row.label}</div>
                    <div className="px-4 py-3 text-sm text-gray-900 border-l border-gray-200">{row.left}</div>
                    <div className="px-4 py-3 text-sm text-gray-900 border-l border-gray-200">{row.right}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Selected University</p>
                <div className="w-full flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                  <img
                    src={selectedUniversity.banner || selectedUniversity.imageUrls?.[0] || '/placeholder.svg'}
                    alt={selectedUniversity.name}
                    className="w-16 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-semibold text-black">{selectedUniversity.name}</p>
                    <p className="text-xs text-gray-600">{selectedUniversity.location}, {selectedUniversity.country}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {compareCandidates.length > 0 ? (
                  compareCandidates.map((uni) => (
                    <button
                      key={uni.id}
                      onClick={() => onSelectCompareUniversity(uni)}
                      className="w-full text-left flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={uni.banner || uni.imageUrls?.[0] || '/placeholder.svg'}
                        alt={uni.name}
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold text-black">{uni.name}</p>
                        <p className="text-xs text-gray-600">{uni.location}, {uni.country}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-4">
                    No universities available to compare from the current list.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
