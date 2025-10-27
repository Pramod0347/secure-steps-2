"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useUniversityStore } from "@/store/universitystore"

interface HydrationProviderProps {
  children: React.ReactNode
}

export const HydrationProvider: React.FC<HydrationProviderProps> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Wait for Zustand to hydrate
    const unsubscribe = useUniversityStore.persist.onFinishHydration(() => {
      console.log("🎯 Hydration completed - store is ready")
      setIsHydrated(true)
    })

    // Fallback timeout in case hydration doesn't fire
    const timeout = setTimeout(() => {
      console.log("⏰ Hydration timeout - forcing ready state")
      setIsHydrated(true)
    }, 1000)

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  // Show loading during hydration
  if (!isHydrated) {
    return (
      <div className="flex flex-col min-h-screen p-4 md:p-16 lg:p-20 2xl:p-28 text-left font-sans">
        <div className="mb-8 sm:mb-12 lg:mb-20 flex flex-row items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2">
            <span>Top Universities</span>
          </h1>
          <div className="flex flex-row items-center gap-3">
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 place-items-center">
          {Array(9)
            .fill(0)
            .map((_, index) => (
              <div key={`skeleton-${index}`} className="w-full max-w-sm bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
