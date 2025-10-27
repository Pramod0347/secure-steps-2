"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { UniversityInterface } from "@/store/universitystore"

// Sample student review data
const studentReviews = [
  {
    id: 1,
    name: "Alex Johnson",
    review:
      "The university provided me with exceptional learning opportunities and helped me grow both academically and personally.",
  },
  {
    id: 2,
    name: "Sarah Williams",
    review: "I found the professors to be incredibly knowledgeable and supportive throughout my academic journey.",
  },
  {
    id: 3,
    name: "Michael Chen",
    review: "The campus facilities and resources available to students are outstanding. I had a wonderful experience.",
  },
]

export default function StudentReviewCarousel({ university }: { university: UniversityInterface }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Function to go to the next review
  const nextReview = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex === studentReviews.length - 1 ? 0 : prevIndex + 1))
    setTimeout(() => setIsAnimating(false), 500) // Match the transition duration
  }

  // Function to go to the previous review
  const prevReview = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? studentReviews.length - 1 : prevIndex - 1))
    setTimeout(() => setIsAnimating(false), 500) // Match the transition duration
  }

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextReview()
    }
    if (isRightSwipe) {
      prevReview()
    }

    // Reset values
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextReview()
    }, 5000) // Change review every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Helper function to get image URL from university
  const getBackgroundImage = (index: number) => {
    if (university?.imageUrls && university.imageUrls.length > 0) {
      // Use modulo to cycle through available images if there are fewer images than reviews
      return university.imageUrls[index % university.imageUrls.length]
    }
    // Fallback to default images
    return `/student-portrait-${(index % 3) + 1}.png`
  }

  return (
    <div className="w-screen max-w-6xl mx-auto my-6 md:my-8 px-4">
      <h2 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-6">What Our Students Say</h2>
      <div className="relative overflow-hidden rounded-lg text-white">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {studentReviews.map((review, index) => (
            <div key={review.id} className="w-full flex-shrink-0">
              <div
                className="flex flex-col md:flex-row items-center p-4 md:p-8 border border-gray-700 rounded-lg relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${getBackgroundImage(index)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "auto", // Auto height for mobile
                  minHeight: "250px", // Minimum height for mobile
                }}
              >
                {/* Mobile layout: Image on top, text below */}
                <div className="md:hidden flex flex-col items-center mb-4">
                  <div className="relative w-20 h-20 rounded-full border-2 border-gray-400 overflow-hidden mb-3">
                    <Image
                      src={getBackgroundImage(index) || "/placeholder.svg?height=80&width=80&query=student portrait"}
                      alt={`Photo of ${review.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-center">{review.name}</h3>
                </div>

                {/* Review text - full width on mobile */}
                <div className="flex-1 md:pr-8 z-10 text-center md:text-left pl-6">
                  <p className="text-sm md:text-lg mb-3 md:mb-4">{review.review}</p>
                  {/* Name only shown on desktop layout */}
                  <h3 className="text-base font-semibold hidden md:block">{review.name}</h3>
                </div>

                {/* Image - only shown on desktop layout */}
                <div className="hidden md:block flex-shrink-0 z-10 pr-6">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-gray-400 overflow-hidden">
                    <Image
                      src={getBackgroundImage(index) || "/placeholder.svg?height=128&width=128&query=student portrait"}
                      alt={`Photo of ${review.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center gap-1 md:gap-2">
          {studentReviews.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-500"}`}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true)
                  setCurrentIndex(index)
                  setTimeout(() => setIsAnimating(false), 500)
                }
              }}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 md:p-2 rounded-full"
          onClick={prevReview}
          aria-label="Previous review"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 md:p-2 rounded-full"
          onClick={nextReview}
          aria-label="Next review"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  )
}
