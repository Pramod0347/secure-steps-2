"use client"

import type React from "react"
import { X } from "lucide-react"

const rankingRanges = ["Top 10", "Top 50", "Top 100", "Top 200", "Top 500", "All rankings"]

interface QsRankingModalProps {
  onSelect: (ranking: string) => void
  selectedRanking: string
  position?: { top: number; left: number; width: number }
  isOpen?: boolean
}

const QsRankingModal: React.FC<QsRankingModalProps> = ({ onSelect, selectedRanking, position, isOpen = false }) => {
  // Calculate modal position
  const getModalStyle = (): React.CSSProperties => {
    if (!position) return {}

    // Calculate position relative to the viewport
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - position.top
    const modalHeight = Math.min(350, spaceBelow - 20) // Max height or available space minus padding

    // Position the modal centered below the filter
    return {
      position: "absolute",
      top: `${position.top}px`,
      left: `${position.left}px`,
      width: `${Math.max(position.width, 280)}px`,
      maxHeight: `${modalHeight}px`,
      transform: "translateY(10px)",
      pointerEvents: "auto",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="filter-modal bg-white rounded-2xl p-4 overflow-hidden"
      style={getModalStyle()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">QS World University Rankings</h3>
        <button
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(selectedRanking) // Keep the current selection and close
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100% - 100px)" }}>
        {rankingRanges.map((range) => (
          <div
            key={range}
            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
              selectedRanking === range ? "bg-gray-100" : ""
            }`}
            onClick={() => onSelect(range)}
          >
            {range}
          </div>
        ))}
      </div>

      {selectedRanking && selectedRanking !== "All rankings" && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full py-2 text-[#BE243C] hover:text-[#a01f35] font-medium" onClick={() => onSelect("")}>
            Clear selection
          </button>
        </div>
      )}
    </div>
  )
}

export default QsRankingModal
