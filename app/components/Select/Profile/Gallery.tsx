"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { UniversityInterface } from "@/store/universitystore"

export default function Gallery({ university }: { university: UniversityInterface }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const youtubeLink = university.youtubeLink ? university.youtubeLink : ""

  // Handle navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === university.imageUrls.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? university.imageUrls.length - 1 : prevIndex - 1))
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
      nextImage()
    }
    if (isRightSwipe) {
      prevImage()
    }

    // Reset values
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Auto-advance images every 5 seconds
  useEffect(() => {
    if (!university.imageUrls || university.imageUrls.length <= 1) return

    const interval = setInterval(() => {
      nextImage()
    }, 5000)

    return () => clearInterval(interval)
  }, [university.imageUrls])

  // If no images, show placeholder
  if (!university.imageUrls || university.imageUrls.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto my-8 md:my-16 px-4">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 text-center">Campus Gallery</h2>
        <div className="bg-gray-200 rounded-lg h-[250px] md:h-[400px] flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen max-w-6xl mx-auto my-8 md:my-16 px-4">
      <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 text-center">Campus Gallery</h2>

      {/* Main Gallery */}
      <div className="relative">
        {/* Main Image */}
        <div
          className="relative h-[250px] md:h-[500px] rounded-lg overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={
              university.imageUrls[currentImageIndex] || "/placeholder.svg?height=500&width=800&query=university campus"
            }
            alt={`${university.name} campus image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement
              target.onerror = null // Prevent infinite loop
              target.src = "/placeholder.svg?key=34bo3"
            }}
          />

          {/* Navigation arrows */}
          <button
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 md:p-2 rounded-full text-white z-10"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 md:p-2 rounded-full text-white z-10"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-black/70 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
            {currentImageIndex + 1} / {university.imageUrls.length}
          </div>
        </div>

        {/* Thumbnail strip - scrollable on mobile */}
        <div className="flex gap-1 md:gap-2 mt-2 md:mt-4 overflow-x-auto pb-2 hide-scrollbar">
          {university.imageUrls.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0 rounded-md overflow-hidden ${
                index === currentImageIndex ? "ring-2 ring-black" : ""
              }`}
            >
              <Image
                src={image || "/placeholder.svg?height=100&width=100&query=thumbnail"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback if thumbnail fails to load
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.src = "/placeholder.svg?key=w7hv1"
                }}
              />
            </button>
          ))}
        </div>
      </div>
      <a
        href={youtubeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="py-3 px-3 border border-lg rounded-full bg-[#DA202E] text-white text-sm mx-auto w-[180px] flex flex-row items-center justify-center mt-10 hover:bg-white hover:border-[#DA202E] font-semibold hover:text-[#DA202E]"
      >
        Explore the Campus
      </a>
    </div>
  )
}
