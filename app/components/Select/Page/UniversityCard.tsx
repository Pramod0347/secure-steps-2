"use client"

import React, { useCallback, useState } from "react"
import type { UniversityInterface } from "@/store/universitystore"
import { useRouter } from "next/navigation"
import { TbCurrencyDollar as DollarIcon, TbHeart } from "react-icons/tb"
import Image from "next/image"
import CompareIcon from "@/app/assets/CompareIcon.png"
import ApplyIcon from "@/app/assets/ApplyIcon.png"
import { motion } from "framer-motion"
import Loader from "../../ui/Loader"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"
import CourseSelectionModal from "../Models/CourseSelectionModal"

const UniversityCard: React.FC<{
  university: UniversityInterface
  onApplyClick: (university: UniversityInterface, e: React.MouseEvent) => void
  onCompareClick: (university: UniversityInterface, e: React.MouseEvent) => void
}> = React.memo(({ university, onApplyClick, onCompareClick }) => {
  const [isNavigating, setIsNavigating] = useState(false)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const getTotalCourses = useCallback(() => university.courses.length, [university.courses])

  const calculateFeesRange = useCallback(() => {
    const fees = university.courses.map((course) => {
      const feeValue = Number.parseFloat(course.fees.replace(/[^0-9.]/g, ""))
      return isNaN(feeValue) ? 0 : feeValue
    })
    const min = Math.min(...fees)
    const max = Math.max(...fees)
    return `${min.toLocaleString()} - ${max.toLocaleString()}`
  }, [university.courses])

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Check if the click target is a button or interactive element
    const target = e.target as HTMLElement
    const isButton = target.closest('button')
    
    if (!isButton) {
      setIsNavigating(true)
      router.push(`/select/${university.slug}`)
    }
  }, [router, university.slug])

  const handleCompareClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      onCompareClick(university, e)
    },
    [university, onCompareClick],
  )

  const handleApplyClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      onApplyClick(university, e)
    },
    [university, onApplyClick],
  )

  const handleWishlistClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()

      if (!isAuthenticated || !user) {
        toast.error("Please login to add to wishlist")
        return
      }

      setIsCourseModalOpen(true)
    },
    [isAuthenticated, user],
  )

  const handleCourseSelect = useCallback(
    async (courseId: string, courseName: string) => {
      if (!isAuthenticated || !user) {
        toast.error("Please login to add to wishlist")
        return
      }

      setIsAddingToFavorites(true)

      try {
        const NextUrl = process.env.NEXTAUTH_URL || window.location.origin
        const response = await fetch(`${NextUrl}/api/auth/fav-courses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            courseId: courseId,
            courseName: courseName,
            universityId: university.id,
            universityName: university.name,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to add to wishlist")
        }

        const data = await response.json()

        if (data.message === "Already in favorites") {
          toast.info("This course is already in your wishlist")
        } else {
          toast.success("Added to your wishlist")
        }
      } catch (error) {
        console.error("Error updating wishlist:", error)
        toast.error(error instanceof Error ? error.message : "Failed to add to wishlist")
        throw error
      } finally {
        setIsAddingToFavorites(false)
      }
    },
    [isAuthenticated, user, university],
  )

  return (
    <>
      <CourseSelectionModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        courses={university.courses}
        universityName={university.name}
        onCourseSelect={handleCourseSelect}
      />

      <div className="w-full h-[420px] 2xl:h-[480px] max-w-[420px] mx-auto relative">
        {/* Show loader in place of card when navigating */}
        {isNavigating ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader isLoading={true} />
          </div>
        ) : (
          <motion.div
            className="group relative flex overflow-hidden rounded-3xl h-full w-full shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
            whileHover={{ y: -12, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={handleCardClick}
          >
            {/* Enhanced Background Image */}
            <Image
              src={university.banner || "/placeholder.svg"}
              alt={university.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={true}
            />

            {/* Premium Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/5 to-transparent opacity-60" />

            {/* Wishlist Button - Enhanced */}
            <motion.button
              onClick={handleWishlistClick}
              className="absolute left-5 top-5 z-20 backdrop-blur-md bg-white/20 hover:bg-white/30 text-white p-3 rounded-2xl border border-white/30 hover:border-white/50 shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              disabled={isNavigating}
            >
              {isAddingToFavorites ? (
                <div className="w-6 h-6 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <TbHeart className="text-2xl drop-shadow-sm" />
              )}
            </motion.button>

            {/* Courses Badge - Enhanced */}
            <div className="absolute right-5 top-5 backdrop-blur-md bg-white/20 text-white px-4 py-3 rounded-2xl border border-white/30 shadow-lg z-10">
              <div className="text-center">
                <p className="text-xs font-medium opacity-90 uppercase tracking-wider">Courses Offered</p>
                <p className="text-lg font-bold mt-1 drop-shadow-sm">{getTotalCourses()}</p>
              </div>
            </div>

            {/* QS Ranking Badge - If available */}
            {university.qsRanking && (
              <div className="absolute left-5 top-20 backdrop-blur-md bg-yellow-400/90 text-black px-3 py-2 rounded-xl font-bold text-sm shadow-lg z-10">
                QS #{university.qsRanking}
              </div>
            )}

            {/* Bottom Content Section - Enhanced */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4 z-10">
              {/* University Name - Enhanced Typography */}
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide line-clamp-2 drop-shadow-lg leading-tight">
                  {university.name}
                </h1>
              </div>

              {/* Info Grid - Better Layout */}
              <div className="grid grid-cols-2 gap-4 text-white">
                {/* Location */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold opacity-90 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-medium line-clamp-1 drop-shadow-sm">{university.location}</p>
                </div>

                {/* Tuition Fee */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold opacity-90 uppercase tracking-wider">Tuition Range</p>
                  <div className="flex items-center gap-1">
                    <DollarIcon className="text-lg flex-shrink-0 drop-shadow-sm" />
                    <p className="text-sm font-medium line-clamp-1 drop-shadow-sm">{calculateFeesRange()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Enhanced Design */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <motion.button
                  onClick={handleCompareClick}
                  disabled={isNavigating}
                  className="bg-black/80 hover:bg-black/90 backdrop-blur-sm text-white rounded-xl py-3.5 px-4 text-sm font-semibold flex items-center gap-2 justify-center border border-white/20 hover:border-white/40 shadow-lg transition-all duration-300 z-20 relative disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={CompareIcon || "/placeholder.svg"}
                    alt="Compare"
                    width={16}
                    height={16}
                    className="flex-shrink-0 drop-shadow-sm"
                  />
                  <span className="drop-shadow-sm">Compare</span>
                </motion.button>

                <motion.button
                  onClick={handleApplyClick}
                  disabled={isNavigating}
                  className="bg-white hover:bg-gray-50 text-black rounded-xl py-3.5 px-4 text-sm font-semibold flex items-center gap-2 justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-20 relative disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={ApplyIcon || "/placeholder.svg"}
                    alt="Apply"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  <span>Apply Now</span>
                </motion.button>
              </div>
            </div>

            {/* Premium Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
})

UniversityCard.displayName = "UniversityCard"

export default UniversityCard