"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { IllustrationProps } from "./type"
import QuesImg1 from "@/app/assets/PopupQuestions/QuesImg1.png"
import QuesImg2 from "@/app/assets/PopupQuestions/QuesImg2.png"
import QuesImg3 from "@/app/assets/PopupQuestions/QuesImg3.png"
import QuesImg4 from "@/app/assets/PopupQuestions/QuesImg4.png"
import QuesImg5 from "@/app/assets/PopupQuestions/QuesImg5.png"
import QuesImg6 from "@/app/assets/PopupQuestions/QuesImg6.png"
import Image from "next/image"

const illustrations = [QuesImg1, QuesImg2, QuesImg3, QuesImg4, QuesImg5, QuesImg6]

export function Illustration({ stage }: IllustrationProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full h-64 relative"
      >
        <Image
          src={illustrations[stage] }
          alt={`Quiz illustration stage ${stage}`}
          className="w-[445px] h-[414px] object-contain"
          width={445}
          height={414}
        />
      </motion.div>
    </AnimatePresence>
  )
}

