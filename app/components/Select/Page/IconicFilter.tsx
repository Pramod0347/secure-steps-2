"use client"

import type React from "react"

import { useState } from "react"
import { Award, BookOpen, Building, DollarSign, Flag, GraduationCap, Heart, Star, TrendingUp } from "lucide-react"

interface IconicFilterProps {
  onFilterSelect: (filter: string) => void
}

const filters = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "ivy-league", label: "Ivy League", icon: Award },
  { id: "top-ranked", label: "Top Ranked", icon: Star },
  { id: "affordable", label: "Affordable", icon: DollarSign },
  { id: "popular-courses", label: "Popular Courses", icon: BookOpen },
  { id: "usa", label: "USA", icon: Flag },
  { id: "uk", label: "UK", icon: Flag },
  { id: "canada", label: "Canada", icon: Flag },
  { id: "australia", label: "Australia", icon: Flag },
  { id: "student-favorites", label: "Student Favorites", icon: Heart },
  { id: "prestigious", label: "Prestigious", icon: Building },
  { id: "stem", label: "STEM", icon: GraduationCap },
]

const IconicFilter: React.FC<IconicFilterProps> = ({ onFilterSelect }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const handleFilterClick = (filterId: string) => {
    const newFilter = activeFilter === filterId ? null : filterId
    setActiveFilter(newFilter)
    onFilterSelect(newFilter || "")
  }

  return (
    <div className="flex space-x-6 md:space-x-8 overflow-x-auto pb-2">
      {filters.map((filter) => {
        const Icon = filter.icon
        const isActive = activeFilter === filter.id

        return (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`flex flex-col items-center justify-center min-w-[70px] transition-colors ${
              isActive ? "text-black" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className={`p-3 rounded-full mb-2 ${isActive ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium whitespace-nowrap">{filter.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default IconicFilter
