"use client";

import React from "react";
import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    {
      number: "100+",
      label: "HOURS OF CONTENT",
      iconBg: "from-red-100 to-red-50",
      iconColor: "text-red-500",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <rect x="3" y="4" width="18" height="16" rx="3" className="text-red-400" fill="currentColor" />
          <rect x="3" y="4" width="18" height="6" rx="3" className="text-red-500" fill="currentColor" />
          <circle cx="7" cy="7" r="1.5" className="text-white" fill="currentColor" />
          <circle cx="12" cy="7" r="1.5" className="text-white" fill="currentColor" />
          <circle cx="17" cy="7" r="1.5" className="text-white" fill="currentColor" />
        </svg>
      ),
    },
    {
      number: "15+",
      label: "COURSES",
      iconBg: "from-blue-100 to-cyan-50",
      iconColor: "text-blue-500",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M4 4h16v16H4V4z" className="text-blue-400" fill="currentColor" rx="3" />
          <path d="M4 4h16v8H4V4z" className="text-blue-500" fill="currentColor" />
          <path d="M8 14h8v2H8v-2z" className="text-white" fill="currentColor" />
          <path d="M12 8l-4 4h8l-4-4z" className="text-white" fill="currentColor" />
        </svg>
      ),
    },
    {
      number: "20k+",
      label: "STUDENTS",
      iconBg: "from-purple-100 to-violet-50",
      iconColor: "text-purple-500",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <circle cx="12" cy="8" r="4" className="text-purple-400" fill="currentColor" />
          <circle cx="7" cy="10" r="3" className="text-purple-300" fill="currentColor" />
          <circle cx="17" cy="10" r="3" className="text-purple-300" fill="currentColor" />
          <path d="M12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" className="text-purple-400" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Sparkle decorations */}
      <div className="absolute top-32 left-[20%] text-purple-300 text-xl sm:text-2xl hidden sm:block">✦</div>
      <div className="absolute top-28 right-[20%] text-purple-300 text-xl sm:text-2xl hidden sm:block">✦</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-700">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-500" fill="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" />
              </svg>
            </span>
            We Offer
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
          Boost Your Skills
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10 sm:mb-16 text-sm sm:text-base px-2">
          From critical skills to technical topics, we support your professional
          development with courses that help you grow and succeed.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gradient-to-b from-gray-50 to-white border border-gray-100 p-6 sm:p-8 lg:p-10 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500 text-center h-full">
                {/* Subtle top gradient highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />

                {/* Icon Container */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-sm ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                </div>

                {/* Number */}
                <div className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                  {stat.number}
                </div>

                {/* Label */}
                <div className="text-gray-500 text-xs sm:text-sm tracking-[0.2em] uppercase">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
