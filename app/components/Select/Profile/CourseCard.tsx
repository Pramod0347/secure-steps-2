"use client"
import Image from "next/image"
import type React from "react"

import { Heart, Clock, GraduationCap, Languages, Calendar } from "lucide-react"
import Course1 from "@/app/assets/Select/Course1.png"
import type { CourseInterface } from "@/store/universitystore"

interface CourseCardProps {
  course: CourseInterface
  isWishlisted: boolean
  onToggleWishlist: (id: string, e?: React.MouseEvent) => void
}

export default function CourseCard({ course, isWishlisted, onToggleWishlist }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100">
      {/* Course Image */}
      <div className="relative h-[100px] md:h-[140px] lg:h-[160px]">
        <Image
          src={course.image || Course1}
          alt={course.name || "Course"}
          fill
          className="object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(course.id, e)
          }}
          className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md z-10 hover:bg-white transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} className={`md:w-4 md:h-4 ${isWishlisted ? "fill-[#DA202E] text-[#DA202E]" : "text-gray-500"}`} />
        </button>

        {/* Duration badge */}
        <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3">
          <div className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
            <Clock size={10} className="md:w-3 md:h-3 text-gray-600" />
            <span className="text-[9px] md:text-xs font-medium text-gray-700">{course.duration}</span>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-3 md:p-4 flex flex-col gap-2 md:gap-3">
        {/* Course Name */}
        <h2 className="text-gray-900 font-semibold text-xs md:text-sm lg:text-base leading-tight line-clamp-2 min-h-[2.5em]">
          {course.name}
        </h2>
        
        {/* Course Info */}
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex items-center gap-1.5 text-gray-600">
            <GraduationCap size={12} className="md:w-3.5 md:h-3.5 flex-shrink-0" />
            <span className="text-[9px] md:text-xs truncate">{course.degreeType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Languages size={12} className="md:w-3.5 md:h-3.5 flex-shrink-0" />
            <span className="text-[9px] md:text-xs truncate">IELTS: {course.ieltsScore}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Calendar size={12} className="md:w-3.5 md:h-3.5 flex-shrink-0" />
            <span className="text-[9px] md:text-xs truncate">{course.intake.slice(0, 2).join(", ")}</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 md:pt-3 mt-auto border-t border-gray-100">
          <p className="text-[#DA202E] font-bold text-sm md:text-base lg:text-lg">
            {course.fees}
          </p>
        </div>
      </div>
    </div>
  )
}
