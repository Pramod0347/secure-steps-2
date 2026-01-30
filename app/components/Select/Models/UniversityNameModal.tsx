"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { hasFlag } from 'country-flag-icons'
import * as Flags from 'country-flag-icons/react/3x2'

// Type for university with country info
interface UniversityWithCountry {
  name: string
  country?: string
}

// Country name to ISO code mapping
const countryToCode: Record<string, string> = {
  'usa': 'US',
  'united states': 'US',
  'united states of america': 'US',
  'uk': 'GB',
  'united kingdom': 'GB',
  'england': 'GB',
  'scotland': 'GB',
  'wales': 'GB',
  'britain': 'GB',
  'great britain': 'GB',
  'germany': 'DE',
  'france': 'FR',
  'italy': 'IT',
  'spain': 'ES',
  'netherlands': 'NL',
  'belgium': 'BE',
  'austria': 'AT',
  'ireland': 'IE',
  'portugal': 'PT',
  'finland': 'FI',
  'greece': 'GR',
  'luxembourg': 'LU',
  'slovakia': 'SK',
  'slovenia': 'SI',
  'estonia': 'EE',
  'latvia': 'LV',
  'lithuania': 'LT',
  'malta': 'MT',
  'cyprus': 'CY',
  'australia': 'AU',
  'canada': 'CA',
  'india': 'IN',
  'china': 'CN',
  'japan': 'JP',
  'south korea': 'KR',
  'korea': 'KR',
  'singapore': 'SG',
  'new zealand': 'NZ',
  'switzerland': 'CH',
  'sweden': 'SE',
  'norway': 'NO',
  'denmark': 'DK',
  'poland': 'PL',
  'czech republic': 'CZ',
  'czechia': 'CZ',
  'hungary': 'HU',
  'russia': 'RU',
  'brazil': 'BR',
  'mexico': 'MX',
  'south africa': 'ZA',
  'uae': 'AE',
  'united arab emirates': 'AE',
  'dubai': 'AE',
  'florida': 'US',
  'colorado': 'US',
  'california': 'US',
  'texas': 'US',
  'new york': 'US',
}

// Helper function to get country code from country name or location string
const getCountryCode = (country?: string): string | null => {
  if (!country) return null
  const normalized = country.toLowerCase().trim()
  
  // First try exact match
  if (countryToCode[normalized]) {
    return countryToCode[normalized]
  }
  
  // Then try to find any country name within the string (for location strings like "London, England, UK")
  for (const [countryName, code] of Object.entries(countryToCode)) {
    if (normalized.includes(countryName)) {
      return code
    }
  }
  
  return null
}

// Flag component that renders the appropriate flag
const CountryFlag: React.FC<{ country?: string; className?: string }> = ({ country, className = "w-5 h-4" }) => {
  const code = getCountryCode(country)
  
  if (!code || !hasFlag(code)) {
    return <span className={`${className} inline-block bg-gray-200 rounded`}></span>
  }
  
  const FlagComponent = Flags[code as keyof typeof Flags]
  return FlagComponent ? <FlagComponent className={className} /> : null
}

interface UniversityNameModalProps {
  onSelect: (name: string) => void
  selectedName: string
  position?: { top: number; left: number; width: number }
  universities?: string[] | UniversityWithCountry[]
  isOpen?: boolean
  isMobile?: boolean
}

const UniversityNameModal: React.FC<UniversityNameModalProps> = ({
  onSelect,
  selectedName,
  position,
  universities: providedUniversities,
  isOpen = false,
  isMobile = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [universities, setUniversities] = useState<UniversityWithCountry[]>([])
  const [filteredUniversities, setFilteredUniversities] = useState<UniversityWithCountry[]>([])

  // Normalize input to always be UniversityWithCountry[]
  const normalizeUniversities = (input?: string[] | UniversityWithCountry[]): UniversityWithCountry[] => {
    if (!input || input.length === 0) return []
    
    // Check if first item is a string or object
    if (typeof input[0] === 'string') {
      return (input as string[]).map(name => ({ name, country: undefined }))
    }
    return input as UniversityWithCountry[]
  }

  // Update universities if provided from props
  useEffect(() => {
    if (providedUniversities && providedUniversities.length > 0) {
      const normalized = normalizeUniversities(providedUniversities)
      setUniversities(normalized)
    }
  }, [providedUniversities])

  useEffect(() => {
    if (searchTerm) {
      setFilteredUniversities(
        universities.filter((uni) => 
          uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.country?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      )
    } else {
      setFilteredUniversities(universities)
    }
  }, [searchTerm, universities])

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
    // This prevents the scroll from propagating to parent elements
    e.stopPropagation()
  }

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
        <h3 className="font-semibold text-lg">Select University</h3>
        <button
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(selectedName) // Keep the current selection and close
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={`${isMobile ? "px-4 py-3" : "mb-4"}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search universities"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#BE243C] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div
        className={`overflow-y-auto ${isMobile ? "px-4" : ""}`}
        style={{ maxHeight: isMobile ? "300px" : "calc(100% - 120px)" }}
        onScroll={handleScroll}
      >
        {filteredUniversities.length > 0 ? (
          <div className="space-y-2">
            {filteredUniversities.map((university) => (
              <div
                key={university.name}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center gap-3 ${
                  selectedName === university.name ? "bg-gray-100" : ""
                }`}
                onClick={() => onSelect(university.name)}
              >
                <CountryFlag country={university.country} className="w-6 h-4 rounded-sm flex-shrink-0" />
                <span className="flex-1">{university.name}</span>
                {university.country && (
                  <span className="text-xs text-gray-400">{university.country}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No universities found</div>
        )}
      </div>

      {selectedName && (
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

export default UniversityNameModal
