"use client"

import { motion } from "framer-motion"
import Plane from "@/app/assets/PopupQuestions/FlighImg.png"
import type { PlaneProps } from "./type"

export function PlaneAnimation({ stage }: PlaneProps) {
  const planeVariants = {
    0: {
      x: "-40%",
      scale: 0.8,
      rotate: 20,
      transformOrigin: "center",
    },
    1: {
      x: "-20%",
      scale: 0.9,
      rotate: 10,
      transformOrigin: "center",
    },
    2: {
      x: "0%",
      scale: 1,
      rotate: 10,
      transformOrigin: "center",
    },
    3: {
      x: "20%",
      scale: 1.1,
      rotate: 5,
      transformOrigin: "center",
    },
    4: {
      x: "40%",
      scale: 1.2,
      rotate: 5,
      transformOrigin: "center",
    },
    5: {
      x: "60%",
      scale: 1.3,
      rotate: 5,
      transformOrigin: "center",
    },
    6: {
      x: "70%",
      scale: 1.1,
      rotate: 5,
      transformOrigin: "center",
    },
    7: {
      x: "90%",
      scale: 1.2,
      rotate: 5,
      transformOrigin: "center",
    },
    8: {
      x: "100%",
      scale: 1.3,
      rotate: 5,
      transformOrigin: "center",
    },
  }

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      initial={false}
      animate={stage.toString()}
      variants={planeVariants}
      transition={{
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
        rotate: {
          duration: 1.5,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
    >
      <motion.img
        src={Plane.src}
        alt="Airplane"
        className="w-[65%] h-[65%] mt-16 md:w-[60%] md:h-[60%] md:mt-36 object-cover relative"
        style={{
          objectPosition: stage === 5 ? "center right" : "center left",
          objectFit: "fill",
          transform: "scaleX(-1)",
        }}
      />
    </motion.div>
  )
}