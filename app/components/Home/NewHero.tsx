"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Accommodation,
  Admission,
  Community,
  Student,
  HeroImg1,
  HeroImg2,
  HeroImg3,
} from "@/app/assets/Home/New_Hero_Section"
import Link from "next/link"

const avatars = [
  {
    image: Accommodation,
    title: "1 Click = 100+ Housing options",
  },
  {
    image: Admission,
    title: "1 Click = 100+ Universities",
  },
  {
    image: Community,
    title: "1 Click = 100+ Community",
  },
  {
    image: Student,
    title: "1 Click = 100+ Blogs",
  },
  {
    image: HeroImg1,
    title: "1 Step away = Achieving your Dreams",
  },
  {
    image: HeroImg2,
    title: "1 Step away = Ready & Confident for your first day at University",
  },
  {
    image: HeroImg3,
    title: "1 Step away = Overcoming all your Fears & Confusion",
  },
]

const NewHeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % avatars.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getImageClass = (index: number) => {
    const diff = (index - currentIndex + avatars.length) % avatars.length
    if (diff === 0) return "w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] z-30 opacity-100"
    if (diff === 1 || diff === avatars.length - 1) return "w-48 h-48 sm:w-64 sm:h-64 z-20 opacity-70 blur-[8px]"
    return "hidden"
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <section className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="absolute left-5 top-[25%] text-start font-bold text-2xl sm:text-4xl space-y-2 z-40">
          <h2 className="text-white" style={{ WebkitTextStroke: "2px black" }}>Think</h2>
          <h2 className="text-white" style={{ WebkitTextStroke: "2px black" }}>Better</h2>
          <h2 className="text-white" style={{ WebkitTextStroke: "2px black" }}>with</h2>
          <h2 className="featured-text uppercase">Secure</h2>
        </div>

        <div className="relative w-full max-w-[90vw] h-[24rem] sm:h-[32rem] md:h-[40rem] flex items-center justify-center">
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
                <div className="relative w-full h-[85%] top-16 flex flex-col items-center">
                  <div className="relative flex-grow w-full">
                    <Image
                      src={avatar.image }
                      alt={`Avatar ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-[14px] text-black text-center">{avatar.title}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="  w-full flex flex-col items-center gap-4 px-4">
          <p className="text-[12px] sm:text-[16px] text-center md:max-w-[90vw] max-w-[70vw]">
            Carefully Designed Products for your successful study abroad journey
          </p>

        
        </div>
      </section>
    </div>
  )
}

export default NewHeroSection