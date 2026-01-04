"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import StarsImg from "@/app/assets/PopupQuestions/StarsImg.png";

export function Background({ stage }: { stage: number }) {
  const isDayTime = stage < 3

  return (
    <motion.div
      className="absolute inset-0 w-full h-full transition-colors duration-1000 ease-in-out"
      style={{
        background: isDayTime 
          ? "#87CEEB" 
          : "linear-gradient(to bottom, #01061F, #1a1a2e)",
      }}
    >
      {!isDayTime && (
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src={StarsImg}
            alt="Stars"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
    </motion.div>
  )
}

