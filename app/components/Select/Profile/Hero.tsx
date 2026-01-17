"use client"
import { useState } from "react"
import Image from "next/image"
import { Calendar, BookOpen, MapPin, Link, Users } from "lucide-react"
import ArrowUp from "@/app/assets/Select/ArrowUp.png"
import ArrowDown from "@/app/assets/Select/ArrowDown.png"
import UniversityCompareModal from "../Models/UniversityCompareModal"
import UniversityApplicationModal from "../Models/UniversityApplicationModal"
import type { UniversityInterface, CourseInterface } from "@/store/universitystore"

// Import the exact interface types from the modal components
import type { University as CompareUniversity } from "../Models/UniversityCompareModal"
import type { Course as ApplicationCourse } from "../Models/UniversityApplicationModal"

export default function Hero({ university }: { university: UniversityInterface }) {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Format established date (with fallback)
  const establishedYear = university.established 
    ? new Date(university.established).getFullYear() 
    : null

  // Convert our UniversityInterface to the type expected by UniversityCompareModal
  const mapToCompareUniversity = (uni: UniversityInterface): CompareUniversity => {
    return {
      id: uni.id,
      name: uni.name,
      description: uni.description,
      location: uni.location,
      country: uni.country,
      website: uni.website,
      established: uni.established,
      banner: uni.banner,
      logoUrl: uni.logoUrl,
      imageUrls: uni.imageUrls,
      facilities: uni.facilities,
      courses: uni.courses.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        fees: course.fees,
        duration: course.duration,
        degreeType: course.degreeType,
        ieltsScore: course.ieltsScore,
        ranking: course.ranking,
        intake: course.intake,
        websiteLink: course.websiteLink,
      })),
    }
  }

  // Convert our CourseInterface[] to the type expected by UniversityApplicationModal
  const mapToApplicationCourses = (courses: CourseInterface[]): ApplicationCourse[] => {
    return courses.map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      fees: course.fees,
      duration: course.duration,
      degreeType: course.degreeType,
      ieltsScore: course.ieltsScore,
      ranking: course.ranking,
      intake: course.intake,
      websiteLink: course.websiteLink,
    }))
  }

  // Scroll to courses section
  const scrollToCourses = () => {
    document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" })
  }

  // Truncate description for mobile view
  const truncatedDescription = university.description
    ? (university.description.length > 150 ? `${university.description.substring(0, 150)}...` : university.description)
    : ""

  return (
    <div className="w-full max-w-7xl mx-auto bg-cover justify-center md:mt-20 mt-10 flex-col flex items-center gap-4 bg-center text-white pt-20 md:pt-0 px-4 md:px-8">
      {/* Mobile Header */}
      <div className="text-black items-center justify-center md:hidden flex flex-col w-full">
        {university.logoUrl && (
          <div className="mb-3">
            <Image
              src={university.logoUrl || "/placeholder.svg?height=80&width=80&query=university logo"}
              alt={`${university.name} Logo`}
              width={60}
              height={60}
              className="rounded-lg border-2 border-gray-200"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold text-center leading-tight px-2">{university.name}</h1>
        <div className="flex text-[10px] mt-3 gap-2 font-semibold flex-wrap justify-center">
          <h2 className="px-3 py-1 rounded-full border flex items-center gap-1">
            <BookOpen size={12} />
            {university.courses?.length || 0} Courses
          </h2>
          <h2 className="px-3 py-1 rounded-full border flex items-center gap-1">
            <MapPin size={12} />
            {university.location}
          </h2>
          {establishedYear && (
            <h2 className="px-3 py-1 rounded-full border flex items-center gap-1">
              <Calendar size={12} />
              Est. {establishedYear}
            </h2>
          )}
          {university.website && (
            <div className="px-3 py-1 rounded-full border flex items-center gap-1">
              <Link size={12} />
              <a href={university.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Website
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex-col flex items-center md:mt-0 -mt-2 relative justify-center">
        <div className="absolute md:left-[18%] left-6 flex flex-col items-center md:items-start top-6 md:top-10 justify-center md:justify-start gap-10 md:gap-24">
          <Image
            src={ArrowUp || "/placeholder.svg?height=20&width=10&query=arrow up"}
            alt="Arrow Up"
            className="w-1 md:w-1/3"
          />
          <Image
            src={ArrowDown || "/placeholder.svg?height=20&width=10&query=arrow down"}
            alt="Arrow Down"
            className="w-1 md:w-1/3"
          />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex flex-col items-center gap-6 mt-24">
          {university.logoUrl && (
            <Image
              src={university.logoUrl || "/placeholder.svg?height=100&width=100&query=university logo"}
              alt={`${university.name} Logo`}
              width={100}
              height={100}
              className="rounded-lg border-2 border-gray-200"
            />
          )}
          <h1 className="text-black text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-bold max-w-4xl leading-tight">{university.name}</h1>
        </div>

        <div className="hidden md:flex text-[10px] text-black md:text-[20px] mt-6 gap-8 font-semibold mb-8 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <BookOpen size={20} />
            <h2>{university.courses?.length || 0} Courses</h2>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <h2>
              {university.location}{university.country ? `, ${university.country}` : ''}
            </h2>
          </div>
          {establishedYear && (
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <h2>Est. {establishedYear}</h2>
            </div>
          )}
          {university.website && (
            <div className="flex items-center gap-2">
              <Link size={20} />
              <a href={university.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Website
              </a>
            </div>
          )}
        </div>

        {/* Banner Image */}
        <div className="w-full px-4 md:px-0 flex justify-center">
          <Image
            src={university.banner || "/placeholder.svg?height=350&width=1000&query=university banner"}
            className="w-full md:w-[80%] h-[200px] md:h-[350px] object-cover rounded-[20px]"
            alt="University Banner"
            width={1000}
            height={350}
            onError={(e) => {
              // Fallback if banner fails to load
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.src = "/placeholder.svg?key=sxk5d"
            }}
          />
        </div>

        {/* University Facilities */}
        {university.facilities && university.facilities.length > 0 && (
          <div className="w-full md:w-[80%] mt-4 md:mt-6 px-4 md:px-0">
            <h3 className="text-base md:text-xl font-semibold text-black mb-2">Facilities</h3>
            <div className="flex flex-wrap gap-1.5 md:gap-3">
              {university.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-black px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-1"
                >
                  <Users size={12} className="md:block hidden" />
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="inter font-medium flex flex-wrap justify-center gap-3 md:gap-8 mt-6 md:mt-8 px-4">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="hover:bg-[#5A5A5A] text-xs md:text-base bg-[#1B1B1B] text-white rounded-full px-4 md:px-8 py-2 md:py-3 transition-colors"
          >
            Compare
          </button>
          <button
            onClick={() => setIsApplicationModalOpen(true)}
            className="hover:bg-[#5A5A5A] text-xs md:text-base bg-[#1B1B1B] text-white rounded-full px-4 md:px-8 py-2 md:py-3 transition-colors"
          >
            Apply Now
          </button>
          <button
            onClick={scrollToCourses}
            className="hover:bg-[#5A5A5A] text-xs md:text-base bg-[#1B1B1B] text-white rounded-full px-4 md:px-8 py-2 md:py-3 transition-colors flex items-center gap-1 md:gap-2"
          >
            <BookOpen size={14} className="md:w-4 md:h-4" />
            View Courses
          </button>
        </div>

        {/* Description */}
        <div className="text-[10px] md:text-[18px] leading-[16px] md:leading-[30px] text-black md:px-1 px-4 md:w-[80%] text-center py-4 md:py-10">
          {/* Mobile description with show more/less toggle */}
          <div className="md:hidden">
            <p>{showFullDescription ? (university.description || "") : truncatedDescription}</p>
            {university.description && university.description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 font-medium mt-2 text-xs"
              >
                {showFullDescription ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          {/* Desktop description (always full) */}
          <p className="hidden md:block">{university.description || ""}</p>
        </div>
      </div>

      {/* University Compare Modal */}
      {isCompareModalOpen && (
        <UniversityCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          selectedUniversity={mapToCompareUniversity(university)}
        />
      )}

      {/* University Application Modal */}
      {isApplicationModalOpen && (
        <UniversityApplicationModal
          universityId={university.id}
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          courses={mapToApplicationCourses(university.courses)}
          universityName={university.name}
        />
      )}
    </div>
  )
}
