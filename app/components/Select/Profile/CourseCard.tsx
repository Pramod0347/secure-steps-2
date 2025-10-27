"use client"
import Image from "next/image"
import type React from "react"

import { Heart } from "lucide-react"
import Course1 from "@/app/assets/Select/Course1.png"
import Group from "@/app/assets/Select/Group.png"
import type { CourseInterface } from "@/store/universitystore"

interface CourseCardProps {
  course: CourseInterface
  isWishlisted: boolean
  onToggleWishlist: (id: string, e?: React.MouseEvent) => void
}

export default function CourseCard({ course, isWishlisted, onToggleWishlist }: CourseCardProps) {
  return (
    <div className="bg-white rounded-[8px] md:rounded-[14px] shadow-md overflow-hidden relative h-full transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      {/* Course Image */}
      <div className="relative h-[120px] md:h-[160px]">
        <Image
          src={course.image || Course1}
          alt={course.name}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement
            target.onerror = null // Prevent infinite loop
            target.src = "/placeholder.svg?key=3s5xt"
          }}
        />

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(course.id, e)
          }}
          className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 bg-white rounded-full shadow-md z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} className={isWishlisted ? "fill-[#DA202E] text-[#DA202E]" : "text-gray-400"} />
        </button>
      </div>

      {/* Duration badge */}
      <div className="flex justify-center -mt-3 md:-mt-4 relative z-10">
        <div className="flex px-4 md:px-7 py-1 items-center justify-center w-[70%] rounded-full bg-[#FAFAFA] shadow-sm">
          {/* <Image
            src={Group || "/placeholder.svg?height=50&width=100&query=duration icon"}
            alt="Duration"
            className="w-[20px] md:w-[30px] h-auto"
            width={30}
            height={15}
          /> */}
          <h1 className="text-[10px] md:text-xs ml-1 md:ml-2 font-medium whitespace-nowrap">{course.duration}</h1>
        </div>
      </div>

      {/* Course Details */}
      <div className="px-2 md:px-4 py-2 flex flex-col mb-6 justify-center gap-2 md:gap-4">
        <h1 className="text-[#B81D24] font-bold text-[11px] md:text-[13px] 2xl:text-[16px] leading-tight md:leading-4 line-clamp-2">
          {course.name}
        </h1>
        <div className="text-[8px] md:text-[12px] md:my-2 -mt-1">
          <h1 className="truncate">Degree: {course.degreeType}</h1>
          <h1 className="truncate">IELTS: {course.ieltsScore}</h1>
          <h1 className="truncate">Intake: {course.intake.join(", ")}</h1>
        </div>
        <h1 className="text-[#B81D24] font-bold text-[10px] md:text-[16px] absolute bottom-2 md:bottom-3">
          ${course.fees}
        </h1>
      </div>
    </div>
  )
}
