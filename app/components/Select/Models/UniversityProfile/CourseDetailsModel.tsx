"use client"
import { useEffect, useRef, useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Heart, Award, Clock, BookOpen, Calendar, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import Course1 from "@/app/assets/Select/Course1.png"
import { useAuth } from "@/app/context/AuthContext"
import type { CourseInterface } from "@/store/universitystore"

interface CourseDetailsModalProps {
  course: CourseInterface
  universityId: string
  universityName: string
  isOpen: boolean
  onClose: () => void
  isWishlisted: boolean
  onToggleWishlist: (id: string, e?: React.MouseEvent) => void
  onApply: () => void
}

export default function CourseDetailsModal({
  course,
  universityId,
  universityName,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onApply,
}: CourseDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Handle adding/removing from wishlist
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || !user) {
      toast.error("Please login to manage your wishlist")
      router.push("/auth/signin")
      return
    }

    setIsProcessing(true)
    try {
      // Call the parent component's toggle function
      await onToggleWishlist(course.id, e)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle apply now
  const handleApply = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to apply")
      router.push("/auth/signin")
      return
    }

    onClose()
    onApply()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-h-[70vh] md:max-w-6xl md:max-h-[75vh] overflow-y-auto mt-[5vh] md:mt-[20vh] md:my-[15vh]"
      >
        {/* Header with image */}
        <div className="relative h-[200px]">
          <Image src={course.image || Course1} alt={course.name} fill className="object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Course title and actions */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#B81D24]">{course.name}</h2>
              <p className="text-gray-600 mt-1">{universityName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleWishlistToggle}
                disabled={isProcessing}
                className={`p-2 rounded-full flex items-center gap-1 ${
                  isWishlisted ? "bg-[#DA202E] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing
                  </span>
                ) : (
                  <>
                    <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
                    <span className="text-sm">{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-lg font-semibold text-[#B81D24] mt-2">${course.fees}</p>
        </div>

        {/* Course details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Course Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Degree Type</p>
                  <p className="font-medium">{course.degreeType}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">IELTS Score</p>
                  <p className="font-medium">{course.ieltsScore}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Intake</p>
                  <p className="font-medium">{course.intake.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-700">
              {course.description ||
                "No description available for this course. Please contact the university for more information."}
            </p>

            {course.websiteLink && (
              <a
                href={course.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#DA202E] hover:underline mt-4"
              >
                <ExternalLink size={16} />
                Visit course website
              </a>
            )}
          </div>
        </div>

        {/* Footer with actions */}
        <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-[#DA202E] text-white rounded-full hover:bg-[#b81d24] w-full sm:w-auto"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}
