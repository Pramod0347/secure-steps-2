"use client";

import React from "react";
import { motion } from "framer-motion";

const FinalCTASection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
          Boost your Learning & Knowledge with CourseSite Now
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center">
            Start Learning Now
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </button>
        </div>

        <p className="text-gray-500 text-sm">
          Your Path to Becoming a Web Wizard
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;
