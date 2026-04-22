"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { animate, motion, useInView, useMotionValue } from "framer-motion";
import { Phone } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const HeroSection = () => {
  const [studentCount, setStudentCount] = useState(0);
  const { isAuthenticated } = useAuth();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const hasAnimatedRef = React.useRef(false);
  const isInView = useInView(sectionRef, { amount: 0.35, once: true });
  const countMotionValue = useMotionValue(0);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) {
      return;
    }

    hasAnimatedRef.current = true;
    const unsubscribe = countMotionValue.on("change", (latest) => {
      setStudentCount(Math.min(847, Math.floor(latest)));
    });

    const controls = animate(countMotionValue, 847, {
      duration: 2.8,
      ease: [0.12, 0.82, 0.2, 1],
      onComplete: () => {
        setStudentCount(847);
      },
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [countMotionValue, isInView]);

  return (
    <section ref={sectionRef} className="relative min-h-[75vh] w-full overflow-hidden bg-pink-100 sm:min-h-[90vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(252,231,243,0.66)_34%,_rgba(249,168,212,0.46)_68%,_rgba(241,207,248,0.28)_100%)]" />
      <div className="absolute left-1/2 top-8 h-72 w-[28rem] -translate-x-1/2 rounded-full bg-white/55 blur-[120px] sm:h-96 sm:w-[34rem]" />
      <div className="absolute left-[8%] top-24 h-64 w-64 rounded-full bg-pink-200/35 blur-[120px]" />
      <div className="absolute right-[8%] top-20 h-72 w-72 rounded-full bg-rose-200/30 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_42%,rgba(244,114,182,0.18)_0%,rgba(244,114,182,0.12)_18%,transparent_42%),radial-gradient(circle_at_80%_44%,rgba(147,197,253,0.22)_0%,rgba(196,181,253,0.12)_22%,transparent_46%),radial-gradient(circle_at_50%_42%,rgba(249,168,212,0.22)_0%,rgba(252,231,243,0.2)_26%,rgba(255,255,255,0.72)_58%,rgba(255,255,255,0.96)_100%)]" />
      
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
              Counselled <span className="inline-block tabular-nums">{studentCount}+</span> Students
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
            <span className="text-gray-900">From confusion to career clarity</span>
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
            href={isAuthenticated ? "/profile" : "/quizform"}
            className="w-full sm:w-auto text-center px-7 py-3.5 bg-white/80 backdrop-blur-md text-gray-900 font-medium rounded-full border border-white/90 hover:bg-white transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]"
          >
            What&apos;s next after college?
          </Link>

          <Link
            href="tel:+917093568336"
            className="inline-flex w-full sm:w-auto items-center justify-center text-center px-7 py-3.5 bg-rose-100/80 backdrop-blur-md text-gray-900 font-medium rounded-full border border-white/90 hover:bg-rose-200/80 transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]"
          >
            <Phone size={16} className="mr-2" />
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </section>
  );
};

export default HeroSection;
