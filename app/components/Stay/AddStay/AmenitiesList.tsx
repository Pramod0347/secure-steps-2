import React, { useState } from 'react'

interface AmenitiesListProps {
  amenities: string[]
  onChange: (amenities: string[]) => void
}

export function AmenitiesList({ amenities, onChange }: AmenitiesListProps) {
  const [newAmenity, setNewAmenity] = useState('')

  const commonAmenities = [
    'WiFi',
    'Air Conditioning',
    'Heating',
    'Washing Machine',
    'Dryer',
    'Kitchen',
    'TV',
    'Dishwasher',
    'Parking',
    'Elevator',
    'Balcony',
    'Garden',
    'Gym',
    'Pool'
  ]

  const addAmenity = () => {
    if (newAmenity.trim()) {
      onChange([...amenities, newAmenity.trim()])
      setNewAmenity('')
    }
  }

  const removeAmenity = (index: number) => {
    onChange(amenities.filter((_, i) => i !== index))
  }

  const addCommonAmenity = (amenity: string) => {
    if (!amenities.includes(amenity)) {
      onChange([...amenities, amenity])
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Amenities</label>
      
      {/* Custom amenity input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          value={newAmenity}
          onChange={(e) => setNewAmenity(e.target.value)}
          placeholder="Add custom amenity"
          onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
        />
        <button
          type="button"
          onClick={addAmenity}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Common amenities suggestions */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-500">Common amenities</label>
        <div className="flex flex-wrap gap-2">
          {commonAmenities
            .filter(amenity => !amenities.includes(amenity))
            .map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => addCommonAmenity(amenity)}
                className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 border border-gray-200"
              >
                + {amenity}
              </button>
            ))}
        </div>
      </div>

      {/* Selected amenities */}
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
          >
            <span>{amenity}</span>
            <button
              type="button"
              onClick={() => removeAmenity(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}