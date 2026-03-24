"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [studentCount, setStudentCount] = useState(1);

  useEffect(() => {
    const start = 1;
    const end = 847;
    const duration = 1800;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.floor(start + (end - start) * easedProgress);
      setStudentCount(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden bg-pink-100 sm:min-h-[90vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(252,231,243,0.78)_38%,_rgba(249,168,212,0.62)_100%)]" />
      <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-white/50 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute left-[12%] top-28 h-40 w-40 rounded-full bg-pink-200/45 blur-3xl" />
      <div className="absolute right-[10%] top-24 h-48 w-48 rounded-full bg-rose-200/35 blur-3xl" />

      <div className="absolute inset-0 bg-gradient-to-b from-pink-50/75 via-pink-100/65 to-pink-300/75" />
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-full px-5 py-2.5 shadow-sm">
            <span className="text-gray-800 text-sm font-medium">
              Counselled {studentCount}+ Students
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
            <span className="text-gray-900">From confusion to career</span>
            <br />
            <span className="text-gray-900">clarity</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-gray-700 text-center max-w-2xl mx-auto leading-relaxed"
        >
          Too many options. Too many opinions. Too much pressure.
          We simplify the noise and help you design a clear path that fits who you are and where you want to go.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-4"
        >
          <Link
            href="/select"
            className="w-full sm:w-auto text-center px-7 py-3.5 bg-pink-50/70 backdrop-blur-md text-gray-900 font-medium rounded-full border border-white/80 hover:bg-pink-100/80 transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]"
          >
            Know who you are
          </Link>

          <Link
            href="/auth/signup"
            className="w-full sm:w-auto text-center px-7 py-3.5 bg-white/80 backdrop-blur-md text-gray-900 font-medium rounded-full border border-white/90 hover:bg-white transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]"
          >
            What&apos;s next after college?
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
