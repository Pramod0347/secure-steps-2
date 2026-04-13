"use client";

import React, { useEffect, useState } from "react";
import { animate, motion, useInView, useMotionValue } from "framer-motion";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

const AnimatedCounter = ({
  value,
  suffix,
  duration = 2200,
  shouldStart,
}: {
  value: number;
  suffix: string;
  duration?: number;
  shouldStart: boolean;
}) => {
  const [count, setCount] = useState(0);
  const countMotionValue = useMotionValue(0);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const unsubscribe = countMotionValue.on("change", (latest) => {
      setCount(Math.min(value, Math.floor(latest)));
    });

    const controls = animate(countMotionValue, value, {
      duration: duration / 1000,
      ease: [0.12, 0.82, 0.2, 1],
      onComplete: () => {
        setCount(value);
      },
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [countMotionValue, duration, shouldStart, value]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
};

const StatCard = ({
  stat,
  index,
}: {
  stat: Stat;
  index: number;
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.45 });

  useEffect(() => {
    if (isInView) {
      setHasStarted(true);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-200 flex items-center justify-center mb-2 hover:border-gray-400 transition-colors">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          <AnimatedCounter
            value={stat.value}
            suffix={stat.suffix}
            duration={2200 + index * 250}
            shouldStart={hasStarted}
          />
        </span>
      </div>
      <span className="text-xs sm:text-sm text-gray-500 text-center max-w-[80px] sm:max-w-[100px]">
        {stat.label}
      </span>
    </motion.div>
  );
};

const LeapOfFaithSection = () => {
  const stats: Stat[] = [
    { value: 75, suffix: "+", label: "Happy Students" },
    { value: 150, suffix: "+", label: "Student Enquiries" },
    { value: 100, suffix: "%", label: "Transparency" },
    { value: 100, suffix: "%", label: "Reliable" },
  ];

  return (
    <section className="brand-section-bg py-12 sm:py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3"
        >
          <span className="text-black">
            Students who took a leap of faith with Secure
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-gray-500 text-sm sm:text-base text-center mb-10 sm:mb-16"
        >
          (Now with clarity in their favourite university/country/career path)
        </motion.p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10 md:grid-cols-4 md:gap-12 lg:gap-16">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeapOfFaithSection;
