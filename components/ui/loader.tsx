"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoaderProps {
  isLoading: boolean
  fullScreen?: boolean
}

const Loader: React.FC<LoaderProps> = ({ isLoading, fullScreen = false }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={`${
            fullScreen ? "fixed inset-0 z-50" : "absolute inset-0 z-20"
          } flex items-center justify-center bg-black/50 backdrop-blur-sm`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="relative w-16 h-16">
              {/* Outer circle */}
              <motion.div
                className="absolute inset-0 border-4 border-t-green-500 border-r-green-400 border-b-green-300 border-l-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Inner circle */}
              <motion.div
                className="absolute inset-2 border-4 border-t-transparent border-r-green-400 border-b-green-500 border-l-green-300 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>
            <p className="text-white font-medium text-sm">Loading...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Loader
