"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const ComingSoon: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-black overflow-hidden">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <motion.h1
          className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Coming Soon
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl text-gray-600 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          We're crafting something extraordinary for you.
        </motion.p>
        <motion.div
          className="w-16 h-16 mx-auto"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z"
              fill="currentColor"
            />
            <path d="M12 6V12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

export default ComingSoon

