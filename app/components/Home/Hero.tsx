"use client"

import { useAuth } from "@/app/context/AuthContext"
import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowRight } from "lucide-react"
import CostEstimatorPage from "./CostEstimator/page"

const textOptions = ["University", "Course", "Career"] as const

// Popup component moved outside of the main Hero component
const Popup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !phone || !date || !time) {
      return // Don't submit if any field is empty
    }
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Form submitted:", { email, phone, date, time })
    setIsSubmitting(false)
    setIsSubmitted(true)
    setTimeout(() => {
      onClose()
      // Reset form after closing
      setEmail("")
      setPhone("")
      setDate("")
      setTime("")
      setIsSubmitted(false)
    }, 3000)
  }

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split("T")[0]

  // Available time slots
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="bg-white p-6 md:p-8 flex flex-col w-full max-w-md rounded-2xl shadow-xl relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#BE243C]">Schedule a Call</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="w-16 h-16 border-4 border-[#BE243C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isSubmitted ? (
          <div className="flex flex-col items-center justify-center h-40">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-700">We'll reach you soon!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BE243C]"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BE243C]"
                placeholder="123-456-7890"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                min={today}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BE243C]"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-700">
                Select Time
              </label>
              <select
                id="time"
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BE243C]"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 text-white rounded-full font-medium transition-colors duration-200 bg-[#BE243C] hover:bg-[#A61F35]"
            >
              Schedule Call
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [prevTextIndex, setPrevTextIndex] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleOpenPopup = useCallback(() => {
    setIsPopupOpen(true)
  }, [])

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
  }, [])

  // Improved text animation with controlled transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevTextIndex(currentTextIndex)
      setIsAnimating(true)

      // Move to next text after animation completes
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textOptions.length)
        setIsAnimating(false)
      }, 500) // Match this with animation duration
    }, 3000)

    return () => clearInterval(interval)
  }, [currentTextIndex])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = (): void => {
      // Safari requires user interaction to play video, so we just ensure it's ready
      if (video.paused) {
        video.play().catch((error) => {
          console.error("Error playing video:", error)
          setVideoError("Error playing video")
        })
      }
    }

    const handleError = (e: Event): void => {
      console.error("Video error:", e)
      setVideoError("Error loading video")
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)

    // For Safari, try playing after a short delay
    const playTimeout = setTimeout(() => {
      if (video.paused) {
        video.play().catch((err) => console.error("Delayed play error:", err))
      }
    }, 300)

    return () => {
      clearTimeout(playTimeout)
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
    }
  }, [])

  return (
    <div className="relative z-50 md:h-screen h-[85vh] w-full overflow-hidden bg-gray-800 max-w-full ">
      {videoError && <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-2 z-50">{videoError}</div>}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
        loop
        controls={false}
        preload="auto"
      >
        <source
          src="https://ik.imagekit.io/99y1fc9mh/secure/videos/Secure%20Steps%20Main%20Banner.mp4?updatedAt=1740206665625"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex h-full w-full items-end gap-20 bg-gradient-to-b from-transparent via-transparent to-white/10">
        <div className="flex md:flex-row md:items-center flex-col w-full justify-between rounded-lg p-4 md:p-8 md:px-20 text-center">
          <h1 className="mb-4 md:mb-0 text-center md:text-left text-[25px] md:text-[50px] 2xl:text-[80px] font-bold leading-[1.2] md:leading-[1.1] 2xl:leading-[1.1] text-white z-10 uppercase">
            <span className="whitespace-nowrap">Begin your journey with</span>
            <br />
            <span className="whitespace-nowrap">
              right{" "}
              <span className="animated-text-wrapper inline-block align-bottom">
                {textOptions.map((text, index) => (
                  <span
                    key={text}
                    className={`animated-text text-[#da202e] transition-all duration-500 ${
                      index === currentTextIndex ? "active" : index === prevTextIndex && isAnimating ? "exit" : "enter"
                    }`}
                    aria-hidden={index !== currentTextIndex}
                  >
                    {text}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <div className="flex relative w-full md:w-auto max-w-[350px] h-auto mx-auto flex-col items-center justify-center p-4 gap-3 rounded-xl bg-white/30 backdrop-blur-lg">
            <p className="text-center md:text-[24px] 2xl:text-[28px] text-[16px] font-bold leading-tight text-white py-1">
              Help us help you
            </p>
            <button
              onClick={handleOpenPopup}
              className="w-full md:w-auto flex items-center justify-center gap-2 text-center rounded-xl bg-black hover:bg-[#da202e] px-5 py-2.5 text-[14px] md:text-[16px] 2xl:text-[18px] font-medium text-white"
            >
              <span>Schedule a call with us</span> <ArrowRight className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Render the Popup component */}
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup} />

      <style jsx>{`
        .animated-text-wrapper {
          position: relative;
          display: inline-flex;
          min-width: 150px;
          height: 1.2em;
          line-height: 1.2;
          overflow: visible;
        }

        .animated-text {
          position: absolute;
          left: 0;
          top: 0;
          white-space: nowrap;
          display: block;
        }

        .animated-text.active {
          opacity: 1;
          transform: translateY(0);
        }

        .animated-text.exit {
          opacity: 0;
          transform: translateY(-100%);
        }

        .animated-text.enter {
          opacity: 0;
          transform: translateY(100%);
        }

        @media (max-width: 768px) {
          .animated-text-wrapper {
            min-width: 100px;
            height: 1.3em;
            line-height: 1.3;
          }
        }

        @media (min-width: 1536px) {
          .animated-text-wrapper {
            min-width: 250px;
            height: 1.2em;
            line-height: 1.2;
          }
        }
      `}</style>
     
    </div>
    
  )
}

export default Hero;