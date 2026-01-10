"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"
import HorizontalScrollingText from "../../ui/horizontalscrolling"
import { TypeAnimation } from "react-type-animation"

interface CircleAnimationProps {
  avatars: { image: string; title: string, count?: number }[]
}

const CircleAnimation: React.FC<CircleAnimationProps> = ({ avatars }) => {
  const { isAuthenticated } = useAuth()
  const [rotationAngle, setRotationAngle] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRotationAngle((prevAngle) => (prevAngle + 1) % 360)
    }, 20)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % avatars.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [avatars.length])

  const circleSize = "min(50vw, 50vh)"

  const getImageClass = (index: number) => {
    const diff = (index - currentIndex + avatars.length) % avatars.length
    if (diff === 0) return "w-[85%] h-[85%] z-30 opacity-100"
    if (diff === 1 || diff === avatars.length - 1) return "w-[45%] h-[45%] z-20 opacity-70 blur-[2px]"
    return "hidden"
  }

  const getImagePosition = (index: number) => {
    const diff = (index - currentIndex + avatars.length) % avatars.length
    if (diff === 0) return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" }
    if (diff === 1) return { left: "130%", top: "50%", transform: "translate(10%, -50%)" }
    if (diff === avatars.length - 1) return { left: "-30%", top: "50%", transform: "translate(-110%, -50%)" }
    return { left: "50%", top: "50%", transform: "translate(-50%, -50%) scale(0)" }
  }

  return (
    <div className="relative w-full md:h-screen  flex flex-col items-center overflow-hidden  ">
      {/* <div className="text-[20px] md:text-5xl leading-[25.2px] text-center   ">
        <TypeAnimation
          sequence={[
            "Why think better with Secure  ?",
            1000,
            "How to think better with Secure ?",
            1000,
            // "Why Choose innovation ?",
            // 1000,
          ]}
          wrapper="h1"
          speed={50}
          style={{ display: "inline-block" }}
          repeat={Number.POSITIVE_INFINITY}
          cursor={true}
        />
      </div> */}

      {/* Title text outside the circle */}
      <div className=" text-center">
        <h1 className="font-bold text-4xl transition-opacity duration-500 h-10">
          {avatars[currentIndex].count ? `${avatars[currentIndex].count}+` : ""}
        </h1>
 
        <h2 className="text-base font-semibold text-gray-800 transition-opacity duration-500 font-sf-pro-display">
          {avatars[currentIndex].title}
        </h2>
      </div>

      <div
        className="relative mt-14"
        style={{
          width: circleSize,
          height: circleSize,
        }}
      >
        {/* Main circle with enhanced inset shadow */}
        <div
          className="absolute inset-0 rounded-full bg-white "
          style={{
            boxShadow: "inset 0 4px 8px rgba(0,0,0,0.3)",
          }}
        />

        {/* Rotating gradient with Cards timing */}
        <div
          className="absolute inset-[-10px] rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotationAngle}deg)`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from 0deg, 
                transparent 0deg,
                transparent 315deg,
                rgba(255,255,255,0.1) 315deg,
                rgba(255,255,255,0.95) 330deg,
                rgba(255,255,255,0.1) 345deg,
                transparent 360deg
              )`,
              filter: "blur(4px)",
            }}
          />
        </div>

        {/* Image container */}
        <div className="absolute inset-0 overflow-visible ">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className={`absolute transition-all w-full h-full duration-500 ease-in-out ${getImageClass(index)}`}
              style={getImagePosition(index)}
            >
              <div className="relative w-full h-full ">
                <Image
                  src={avatar.image}
                  alt={avatar.title}
                  fill
                  className="object-contain rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <br/>
      {!isAuthenticated && (
        <Link href="/auth/signin" className="bg-black px-14 py-5  text-white rounded-full  text-[14px] shining-button">
          Login
        </Link>
      )}
      <br/>



     

      <style jsx global>{`
        @keyframes spin-ease-out {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-ease-out {
          animation: spin-ease-out 0.5s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default CircleAnimation