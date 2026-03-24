"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BRAND_ASSETS } from "@/app/lib/constants";

interface FullScreenLoaderProps {
  isLoading?: boolean;
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  isLoading = true,
  message = "Loading...",
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-16 w-16"
            >
              <Image
                src={BRAND_ASSETS.LOGO_URL}
                alt="Securesteps"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Loading text */}
            <p className="text-gray-700 font-medium text-sm">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenLoader;