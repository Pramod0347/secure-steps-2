"use client"

import type React from "react"
import { X } from "lucide-react"

// Define fee ranges
const feeRanges = [
  "Under $10,000",
  "$10,000 - $20,000",
  "$20,000 - $30,000",
  "$30,000 - $40,000",
  "Above $40,000",
  "Any range",
]

interface FeesModalProps {
  onSelect: (value: string) => void
  selectedFees: string
  position?: { top: number; left: number; width: number }
  isOpen?: boolean
  isMobile?: boolean // New prop for responsive design
}

const FeesModal: React.FC<FeesModalProps> = ({
  onSelect,
  selectedFees,
  position,
  isOpen = false,
  isMobile = false, // Default to desktop
}) => {
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

      <div className={`flex justify-between items-center ${isMobile ? "px-4 py-3 border-b" : "mb-4"}`}>
        <h3 className="font-semibold text-lg">Tuition Fees (Annual)</h3>
        <button
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(selectedFees) // Keep the current selection and close
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className={`space-y-2 overflow-y-auto ${isMobile ? "px-4" : ""}`}
        style={{ maxHeight: isMobile ? "300px" : "calc(100% - 100px)" }}
        onScroll={handleScroll}
      >
        {feeRanges.map((range) => (
          <div
            key={range}
            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${selectedFees === range ? "bg-gray-100" : ""}`}
            onClick={() => onSelect(range)}
          >
            {range}
          </div>
        ))}
      </div>

      {selectedFees && selectedFees !== "Any range" && (
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

export default FeesModal
