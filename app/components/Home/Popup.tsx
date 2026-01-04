"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface Avatar {
  image: string
  title: string
}

interface PopupProps {
  avatars: Avatar[]
  onClose: () => void
}

const Popup: React.FC<PopupProps> = ({ avatars, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % avatars.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [avatars.length])

  useEffect(() => {
    // Disable scrolling and hide scrollbar when the popup is active
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"

    // Re-enable scrolling and show scrollbar when the component unmounts
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }
  }, [])

  const getImageClass = (index: number) => {
    const diff = (index - currentIndex + avatars.length) % avatars.length
    if (diff === 0)
      return "w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] z-30 opacity-100"
    if (diff === 1 || diff === avatars.length - 1)
      return "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 z-20 opacity-70 blur-[4px]"
    return "hidden"
  }

  return (
    <div className="fixed  inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 w-[70vw] h-[70vh] max-w-[1200px] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 transition-all duration-300 ease-in-out hover:bg-red-100 rounded-full group"
          aria-label="Close popup"
        >
          <div className="relative">
            <X size={32} className="relative z-10" />
            <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out" />
          </div>
        </button>
        <h2 className="md:text-[24px] 2xl:text-[28px] text-[16px] font-bold mb-6 text-center">
          Think Better with <span className="text-red-500">Secure</span>
        </h2>
        <div className="relative flex-grow flex items-center justify-center">
          {avatars.map((avatar, index) => {
            const position = (index - currentIndex + avatars.length) % avatars.length
            let translateX: string

            if (position === 0) {
              translateX = "0%"
            } else if (position === 1) {
              translateX = "120%"
            } else if (position === avatars.length - 1) {
              translateX = "-120%"
            } else {
              translateX = "280%"
            }

            return (
              <div
                key={index}
                className={`absolute transition-all duration-500 ease-in-out ${getImageClass(index)}`}
                style={{ transform: `translateX(${translateX})` }}
              >
                <div className="relative w-full h-[85%] flex flex-col items-center">
                  <div className="relative flex-grow w-full">
                    <Image
                      src={avatar.image }
                      alt={`Avatar ${index + 1}`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div className="mt-4 text-sm sm:text-sm lg:text-base text-black text-center">
                    {avatar.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Popup

