"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { universityLogos } from "./universityLogo"
import type { StaticImageData } from "next/image"

// Update the Logo type to handle both string and StaticImageData
type Logo = {
  id: string
  name: string
  url: string | StaticImageData
}

interface LogoCarouselProps {
  speed?: number
  gap?: number
  height?: number
  mobileHeight?: number // Added mobile height property
  mobileMinWidth?: number // Added mobile min-width property
}

const InfiniteLogoCarousel: React.FC<LogoCarouselProps> = ({ 
  speed = 30, 
  gap = 40, 
  height = 80,
  mobileHeight = 150, // Default mobile height
  mobileMinWidth = 150 // Default mobile min-width
}) => {
  // Refs
  const outerContainerRef = useRef<HTMLDivElement>(null)
  const innerContainerRef = useRef<HTMLDivElement>(null)

  // State
  const [validatedLogos, setValidatedLogos] = useState<Logo[]>([])
  const [contentWidth, setContentWidth] = useState<number>(0)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Animation refs with better performance tracking
  const animationRef = useRef<number>(0)
  const positionRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const isVisibleRef = useRef<boolean>(true)

  // Initialize and validate logos
  useEffect(() => {
    try {
      // Validate logo data structure
      if (!Array.isArray(universityLogos)) {
        throw new Error("universityLogos is not an array")
      }

      if (universityLogos.length === 0) {
        throw new Error("universityLogos array is empty")
      }

      // Type validation and filtering with correct type handling
      const validated: Logo[] = universityLogos.filter((logo: any): logo is Logo => {
        return (
          typeof logo === "object" &&
          logo !== null &&
          typeof logo.id === "string" &&
          typeof logo.name === "string" &&
          (typeof logo.url === "string" ||
            // Handle StaticImageData objects from Next.js
            (typeof logo.url === "object" && "src" in logo.url))
        )
      })

      if (validated.length === 0) {
        throw new Error("No valid logos found in universityLogos")
      }

      setValidatedLogos(validated)
    } catch (error) {
      console.error("Error processing logo data:", error)
      // Set fallback if needed
      setValidatedLogos([])
    }
  }, [])

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Standard mobile breakpoint
    }
    
    // Initial check
    checkMobile()
    
    // Set up listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Pre-load images to prevent layout shifts
  useEffect(() => {
    if (validatedLogos.length === 0) return

    // Preload images to reduce layout shifts
    const preloadImages = () => {
      validatedLogos.forEach(logo => {
        const src = typeof logo.url === "string" ? logo.url : logo.url.src
        const img = new Image()
        img.src = src
      })
    }

    preloadImages()
  }, [validatedLogos])

  // Set up measurements after logos are loaded with more reliable approach
  useEffect(() => {
    if (validatedLogos.length === 0) return

    const initializeCarousel = () => {
      if (!outerContainerRef.current || !innerContainerRef.current) return

      // Use a more reliable approach to measure content
      const measureContent = () => {
        // Force a layout calculation to ensure accurate measurements
        if (innerContainerRef.current) {
          innerContainerRef.current.style.display = "inline-flex"
          innerContainerRef.current.style.width = "auto"
        }

        // Get container width for better calculations
        if (outerContainerRef.current) {
          setContainerWidth(outerContainerRef.current.offsetWidth)
        }

        const logoItems = innerContainerRef.current?.querySelectorAll(".logo-item")
        if (!logoItems || logoItems.length === 0) {
          // If logos haven't loaded yet, try again
          setTimeout(measureContent, 100)
          return
        }

        // Calculate width of one complete set of logos
        let singleSetWidth = 0
        const itemsPerSet = validatedLogos.length

        for (let i = 0; i < Math.min(logoItems.length, itemsPerSet); i++) {
          const item = logoItems[i] as HTMLElement
          singleSetWidth += item.offsetWidth + gap
        }

        // Ensure we have a valid width
        if (singleSetWidth > 0) {
          setContentWidth(singleSetWidth)
          setIsInitialized(true)
        } else {
          // Try again if measurement failed
          setTimeout(measureContent, 100)
        }
      }

      // Use a more reliable approach with setTimeout and try multiple times if needed
      setTimeout(measureContent, 100)
    }

    // Initialize after a small delay to ensure all logos are rendered
    const timeoutId = setTimeout(initializeCarousel, 150)

    return () => clearTimeout(timeoutId)
  }, [validatedLogos, gap])

  // Handle visibility changes to pause animation when not visible
  useEffect(() => {
    if (!isInitialized) return

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting
        
        // Restart animation if becoming visible again
        if (isVisibleRef.current && !animationRef.current) {
          lastTimeRef.current = 0
          animationRef.current = requestAnimationFrame(animate)
        }
      },
      { threshold: 0.1 }
    )

    if (outerContainerRef.current) {
      observer.observe(outerContainerRef.current)
    }

    return () => observer.disconnect()
  }, [isInitialized])

  // Handle resizing with debouncing for better performance
  useEffect(() => {
    if (!isInitialized) return

    let resizeTimeout: NodeJS.Timeout | null = null

    const handleResize = () => {
      // Debounce resize handling
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      // Check if mobile
      setIsMobile(window.innerWidth < 768)

      resizeTimeout = setTimeout(() => {
        // Update container width
        if (outerContainerRef.current) {
          setContainerWidth(outerContainerRef.current.offsetWidth)
        }

        // Reset the position
        positionRef.current = 0
        if (innerContainerRef.current) {
          innerContainerRef.current.style.transform = `translateX(0px)`
        }

        // Re-measure content
        const logoItems = innerContainerRef.current?.querySelectorAll(".logo-item")
        if (!logoItems || logoItems.length === 0) return

        let singleSetWidth = 0
        for (let i = 0; i < Math.min(logoItems.length, validatedLogos.length); i++) {
          const item = logoItems[i] as HTMLElement
          singleSetWidth += item.offsetWidth + gap
        }

        setContentWidth(singleSetWidth)
      }, 150) // Debounce time
    }

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(handleResize)

    if (outerContainerRef.current) {
      resizeObserver.observe(outerContainerRef.current)
    }

    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      resizeObserver.disconnect()
    }
  }, [isInitialized, validatedLogos.length, gap])

  // Animation with optimized performance
  const animate = (timestamp: number) => {
    // If not visible, don't animate
    if (!isVisibleRef.current) {
      animationRef.current = 0
      return
    }

    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    const elapsed = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    // Use requestAnimationFrame's timestamp for more accurate timing
    // Calculate how much to move based on elapsed time and speed
    // Limit maximum pixels per frame to prevent large jumps after tab switch
    const pixelsToMove = Math.min((speed * elapsed) / 1000, 5)

    // Move from right to left (negative direction)
    positionRef.current -= pixelsToMove

    // Reset position when we've scrolled one complete set
    // Use a more precise approach for seamless looping
    if (Math.abs(positionRef.current) >= contentWidth) {
      // Instead of using modulo, add exactly one set width
      // This creates a perfect loop without any jumps
      positionRef.current += contentWidth
    }

    // Apply the transform with hardware acceleration for better performance
    if (innerContainerRef.current) {
      innerContainerRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Start and manage animation
  useEffect(() => {
    if (!isInitialized || contentWidth <= 0) return

    // Start the animation
    animationRef.current = requestAnimationFrame(animate)

    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = 0
      }
      lastTimeRef.current = 0
    }
  }, [isInitialized, contentWidth, speed])

  // Calculate how many sets of logos we need based on container width
  const calculateSetsNeeded = () => {
    if (containerWidth <= 0 || contentWidth <= 0) return 3 // Default

    // Need enough sets to cover at least three times the container width for smoother looping
    return Math.max(3, Math.ceil((containerWidth * 3) / contentWidth))
  }

  // Helper function to get image src from url prop
  const getImageSrc = (url: string | StaticImageData): string => {
    if (typeof url === "string") {
      return url
    }
    // Handle Next.js StaticImageData
    return url.src
  }

  // Render logos with optimization
  const renderLogos = (): React.ReactNode[] => {
    if (validatedLogos.length === 0) {
      return [
        <div key="no-logos" className="text-gray-500 px-4">
          No logos available
        </div>,
      ]
    }

    const setsNeeded = calculateSetsNeeded()
    const logoElements: React.ReactNode[] = []

    // Create multiple sets of logos
    for (let setIndex = 0; setIndex < setsNeeded; setIndex++) {
      validatedLogos.forEach((logo, logoIndex) => {
        logoElements.push(
          <div
            key={`${logo.id}-${setIndex}-${logoIndex}`}
            className="logo-item inline-block"
            style={{
              marginRight: `${gap}px`,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={getImageSrc(logo.url)}
              alt={logo.name}
              className="h-full w-auto object-contain "
              style={{
               maxHeight: isMobile ? `${mobileHeight}px` : "100%",
                minWidth: isMobile ? `${mobileMinWidth}px` : "200px", // Responsive min-width
                marginRight: "15px",
                borderRadius: "4px",
                willChange: "transform", // Hint for browser optimization
              }}
              loading="lazy"
              onError={(e) => {
                // Fallback for failed images
                console.warn(`Failed to load logo: ${String(logo.url)}`)
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=120"
              }}
            />
          </div>,
        )
      })
    }

    return logoElements
  }

  // Calculate the appropriate height based on screen size
  const carouselHeight = isMobile ? mobileHeight : height

  return (
    <div className="w-full text-center ">
      <h2 className="text-[20px] leading-[25.2px] md:text-5xl font-bold uppercase">
        Universities that&#160;
        <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block">await your application</span>
      </h2>
      <p>You name it, We have it</p>
      <div
        ref={outerContainerRef}
        className="w-full overflow-hidden rounded-lg  md:my-20  "
        style={{ height: `${carouselHeight}px` }}
        aria-label="University logos carousel"
      >
        <div
          ref={innerContainerRef}
          className="inline-flex h-full items-center whitespace-nowrap"
          style={{ 
            willChange: "transform",
            backfaceVisibility: "hidden", // Prevent flickering
            WebkitBackfaceVisibility: "hidden",
            perspective: "1000",
            WebkitPerspective: "1000",
          }}
        >
          {renderLogos()}
        </div>
      </div>
    </div>
  )
}

export default InfiniteLogoCarousel