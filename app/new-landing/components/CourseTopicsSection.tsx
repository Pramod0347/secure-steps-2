"use client";

import React from "react";
import { motion } from "framer-motion";


const CourseTopicsSection = () => {
  const topics = [
    "Anxious",
    "Peer Pressure",
    "Clueless",
    "Confused",
    "Awareness",
    "Lack of Direction",
    "Overthinking",
    "Skills unexplored",
    "Fear of wrong choices",
    "Low confidence",
    "Self doubt",
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
            Most Common Student Struggles
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 sm:mb-6 px-2">
          Figuring out what’s next
        </h2>

        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base lg:text-lg px-2 leading-relaxed">
          It&apos;s completely normal to feel this way.
          <br />
          These emotions don&apos;t define your future.
        </p>

        {/* Topics Grid */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {topics.map((topic, index) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300 cursor-pointer text-sm sm:text-base">
                {topic}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseTopicsSection;
