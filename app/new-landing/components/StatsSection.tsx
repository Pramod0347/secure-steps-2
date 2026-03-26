"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Building2, Globe } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      number: "100+",
      label: "FUTURE READY DEGREES",
      iconBg: "from-red-100 to-red-50",
      iconColor: "text-red-500",
      icon: <GraduationCap className="w-8 h-8" />,
    },
    {
      number: "880+",
      label: "UNIVERSITIES TO CHOOSE FROM",
      iconBg: "from-blue-100 to-cyan-50",
      iconColor: "text-blue-500",
      icon: <Building2 className="w-8 h-8" />,
    },
    {
      number: "32+",
      label: "COUNTRIES TO EXPLORE",
      iconBg: "from-purple-100 to-violet-50",
      iconColor: "text-purple-500",
      icon: <Globe className="w-8 h-8" />,
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
            What makes us different?
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
          10X your career opportunities
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10 sm:mb-16 text-sm sm:text-base px-2">
          We don&apos;t just help you discover what you&apos;re good at or identify the right career,
          we design a strategic roadmap that opens multiple pathways through one powerful degree.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95, rotateX: 0, rotateY: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
              }}
              whileHover={{
                scale: 1.03,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group [perspective:1400px] lg:odd:mt-6 lg:odd:mb-2 lg:even:-mt-1"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin:
                  index === 0
                    ? "right center"
                    : index === 2
                      ? "left center"
                      : "center center",
              }}
            >
              <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gradient-to-b from-gray-50 via-white to-white border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-[0_24px_70px_rgba(148,163,184,0.18)] hover:shadow-[0_30px_90px_rgba(148,163,184,0.24)] hover:border-gray-200 transition-all duration-500 text-center h-full min-h-[280px] sm:min-h-[340px]">
                {/* Subtle top gradient highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent group-hover:via-purple-300/50 transition-all duration-500" />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-transparent to-blue-50/0 group-hover:from-purple-50/30 group-hover:to-blue-50/30 transition-all duration-500 rounded-2xl sm:rounded-[2rem]" />

                {/* Icon Container */}
                <motion.div 
                  className="flex justify-center mb-6 sm:mb-8 relative z-10"
                  whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                >
                  <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                </motion.div>

                <div className="relative z-10 flex min-h-[80px] sm:min-h-[170px] lg:min-h-[190px] flex-col justify-end">
                  {/* Number */}
                  <motion.div 
                    className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight group-hover:text-gray-800 transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>

                  {/* Label */}
                  <div className="text-gray-500 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase group-hover:text-gray-700 transition-colors">
                    {stat.label}
                  </div>
                </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-1/2 transition-all duration-500 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
