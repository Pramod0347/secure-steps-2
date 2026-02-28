"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full overflow-hidden bg-gradient-to-b from-pink-50 via-pink-100 to-pink-300">
      {/* Subtle gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/60 via-transparent to-pink-200/40" />
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-full px-5 py-2.5 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
            <span className="text-gray-800 text-sm font-medium">
              Trusted by 20,000+ Happy Learners
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.15] tracking-tight px-2">
            <span className="text-gray-900">Web Dev & Design made</span>
            <br />
            <span className="text-gray-900">Simple, Better.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-gray-700 text-center max-w-2xl mx-auto leading-relaxed"
        >
          Practical project-based courses that are easy to understand, straight to the
          point, and distractions while ensuring comprehensive learning.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-4"
        >
          <Link
            href="/courses"
            className="w-full sm:w-auto text-center px-7 py-3.5 bg-pink-50/70 backdrop-blur-md text-gray-900 font-medium rounded-full border border-white/80 hover:bg-pink-100/80 transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]"
          >
            View All Courses
          </Link>

          <button className="w-full sm:w-auto px-7 py-3.5 bg-white/80 backdrop-blur-md text-gray-900 font-medium rounded-full border border-white/90 hover:bg-white transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]">
            Start Learning Now
          </button>
        </motion.div>

        {/* Glass Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 sm:mt-12 lg:mt-16 relative px-2 sm:px-4"
        >
          {/* Large Glass Container */}
          <div className="relative mx-auto max-w-4xl">
            {/* Main glass panel */}
            <div className="relative bg-pink-200/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/30 p-4 sm:p-6 lg:p-10 shadow-2xl shadow-pink-300/20">
              {/* Inner cards container */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                {/* Left Card - Figma & Video Icons */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full sm:w-auto"
                >
                  <div className="w-full sm:w-64 lg:w-72 h-32 sm:h-36 lg:h-40 bg-white/50 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/50 shadow-lg flex items-end p-4 sm:p-5">
                    {/* Figma Icon - 3D Style */}
                    <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-4 w-16 sm:w-20 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gray-900 shadow-xl flex items-center justify-center transform rotate-[-5deg]">
                      <div className="grid grid-cols-2 gap-0.5 sm:gap-1 p-1.5 sm:p-2">
                        <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-orange-500" />
                        <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-purple-500" />
                        <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-green-500" />
                        <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-cyan-400" />
                      </div>
                    </div>
                    
                    {/* Video/Teams Icon */}
                    <div className="absolute bottom-6 sm:bottom-8 left-16 sm:left-20 w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center transform rotate-[5deg]">
                      <svg viewBox="0 0 24 24" className="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="currentColor">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Right Card - Graduate Icon */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="relative w-full sm:w-auto"
                >
                  <div className="w-full sm:w-64 lg:w-72 h-32 sm:h-36 lg:h-40 bg-white/50 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/50 shadow-lg flex items-center justify-center">
                    {/* Graduate Icon */}
                    <svg viewBox="0 0 100 100" className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 text-gray-800" fill="currentColor">
                      {/* Hat */}
                      <polygon points="50,15 10,35 50,55 90,35" />
                      {/* Tassel line */}
                      <line x1="50" y1="35" x2="50" y2="25" stroke="currentColor" strokeWidth="2" />
                      {/* Tassel */}
                      <circle cx="50" cy="22" r="3" />
                      <path d="M47,22 Q50,30 53,22" strokeWidth="1" />
                      {/* Body */}
                      <path d="M35,60 L35,80 Q50,90 65,80 L65,60 Q50,70 35,60" />
                      {/* Head */}
                      <circle cx="50" cy="50" r="12" />
                      {/* Shoulders */}
                      <path d="M30,75 Q50,65 70,75" fill="none" stroke="currentColor" strokeWidth="8" />
                    </svg>
                  </div>

                  {/* Verified Badge */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute -top-3 sm:-top-5 -right-3 sm:-right-5 w-12 sm:w-16 h-12 sm:h-16 bg-gray-900 rounded-[14px] sm:rounded-[18px] flex items-center justify-center shadow-xl"
                    style={{ clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)' }}
                  >
                    <Check className="w-6 sm:w-8 h-6 sm:h-8 text-pink-400" strokeWidth={3} />
                  </motion.div>
                </motion.div>
              </div>

              {/* Additional decorative elements */}
              <div className="absolute bottom-4 right-8 w-48 h-8 bg-white/30 rounded-full backdrop-blur-sm" />
              
              {/* Small floating card bottom right */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/40 backdrop-blur-md rounded-xl border border-white/30 shadow-lg flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-pink-400/60" />
              </div>
            </div>

            {/* Decorative side elements - like documents */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-16 h-32 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transform -rotate-12 hidden lg:block" />
            <div className="absolute -left-4 top-1/2 -translate-y-1/3 w-14 h-28 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 transform -rotate-6 hidden lg:block" />
            
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-32 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transform rotate-12 hidden lg:block" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/3 w-14 h-28 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 transform rotate-6 hidden lg:block" />
          </div>

          {/* Reflection effect */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-gradient-to-b from-pink-300/40 to-transparent blur-2xl" />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
