"use client"

import { motion } from "framer-motion"
import Cloud1 from "@/app/assets/PopupQuestions/CloudImg1.png"
import Cloud2 from "@/app/assets/PopupQuestions/CloudImg2.png"
import Cloud3 from "@/app/assets/PopupQuestions/CloudImg3.png"
import Cloud4 from "@/app/assets/PopupQuestions/CloudImg3.png"
import Cloud5 from "@/app/assets/PopupQuestions/CloudImg3.png"

interface CloudProps {
  stage: number
  isTransitioning: boolean
}

const cloudVariants = {
  0: {
    cloud1: { top: "30%", left: "10%", scale: 3.3, opacity: 0.8 },
    cloud2: { top: "80%", left: "15%", scale: 4, opacity: 0.9 },
    cloud3: { top: "50%", right: "10%", scale: 2.4, opacity: 0.9 },
    cloud4: { top: "75%", right: "3%", scale: 5.2, opacity: 0.9 },
    cloud5: { top: "35%", left: "40%", scale: 1, opacity: 0.75 },
  },
  1: {
    cloud1: { top: "20%", left: "1%", scale: 3.3, opacity: 0.9 },
    cloud2: { top: "80%", left: "10%", scale: 4, opacity: 0.9 },
    cloud3: { top: "30%", right: "5%", scale: 3, opacity: 0.9 },
    cloud4: { top: "75%", right: "35%", scale: 3.5, opacity: 0.8 },
    cloud5: { top: "25%", left: "35%", scale: 1.5, opacity: 0.9 },
  },
  2: {
    cloud1: { top: "25%", left: "-8%", scale: 4, opacity: 0.8 },
    cloud2: { top: "85%", left: "25%", scale: 1.8, opacity: 0.8 },
    cloud3: { top: "30%", left: "40%", scale: 2, opacity: 0.8 },
    cloud5: { top: "85%", left: "-4%", scale: 2.5, opacity: 0.8 },
    cloud4: { top: "80%", right: "-3%", scale: 3.5, opacity: 0.7 },
  },
  3: {
    cloud1: { top: "25%", left: "-8%", scale: 4, opacity: 0.8 },
    cloud2: { top: "85%", left: "15%", scale: 1.8, opacity: 0.8 },
    cloud3: { top: "30%", left: "40%", scale: 2, opacity: 0.8 },
    cloud5: { top: "65%", left: "-6%", scale: 2.5, opacity: 0.8 },
    cloud4: { top: "80%", right: "40%", scale: 4, opacity: 0.7 },
  },
  4: {
    cloud1: { top: "20%", left: "-15%", scale: 4.5, opacity: 0.7 },
    cloud2: { top: "75%", left: "30%", scale: 2, opacity: 0.7 },
    cloud3: { top: "40%", left: "50%", scale: 2.2, opacity: 0.7 },
    cloud5: { top: "70%", left: "-10%", scale: 3, opacity: 0.7 },
    cloud4: { top: "85%", right: "45%", scale: 4.5, opacity: 0.6 },
  },
  5: {
    cloud1: { top: "15%", left: "-10%", scale: 3.5, opacity: 0.8 },
    cloud2: { top: "60%", left: "45%", scale: 2.2, opacity: 0.6 },
    cloud3: { top: "45%", left: "30%", scale: 2.4, opacity: 0.6 },
    cloud5: { top: "45%", left: "-10%", scale: 3.5, opacity: 0.6 },
    cloud4: { top: "80%", right: "80%", scale: 5, opacity: 0.5 },
  },
}

export function Clouds({ stage }: CloudProps) {
  const getCloudStyle = (cloudKey: keyof (typeof cloudVariants)[0]) => {
    const safeStage = Math.min(stage, Object.keys(cloudVariants).length - 1)
    return cloudVariants[safeStage as keyof typeof cloudVariants][cloudKey]
  }

  const getResponsiveCloudStyle = (cloudKey: keyof (typeof cloudVariants)[0]) => {
    const style = getCloudStyle(cloudKey)
    return {
      ...style,
      scale: `calc(${style.scale} * var(--cloud-scale-factor, 1))`,
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Cloud 1 */}
      <motion.div
        className="absolute"
        initial={false}
        animate={getResponsiveCloudStyle("cloud1")}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.img
          src={Cloud1.src}
          alt=""
          className="w-16 h-12 md:w-32 md:h-24 object-contain"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Cloud 2 */}
      <motion.div
        className="absolute"
        initial={false}
        animate={getResponsiveCloudStyle("cloud2")}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.img
          src={Cloud2.src}
          alt=""
          className="w-20 h-14 md:w-40 md:h-28 object-contain"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>

      {/* Cloud 3 */}
      <motion.div
        className="absolute"
        initial={false}
        animate={getResponsiveCloudStyle("cloud3")}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.img
          src={Cloud3.src}
          alt=""
          className="w-18 h-12 md:w-36 md:h-24 object-contain"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      {/* Cloud 4 */}
      <motion.div
        className="absolute"
        initial={false}
        animate={getResponsiveCloudStyle("cloud4")}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.img
          src={Cloud4.src}
          alt=""
          className="w-14 h-10 md:w-28 md:h-20 object-contain"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.5 }}
        />
      </motion.div>

      {/* Cloud 5 */}
      <motion.div
        className="absolute"
        initial={false}
        animate={getResponsiveCloudStyle("cloud5")}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.img
          src={Cloud5.src}
          alt=""
          className="w-17 h-12 md:w-34 md:h-24 object-contain"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>
    </div>
  )
}