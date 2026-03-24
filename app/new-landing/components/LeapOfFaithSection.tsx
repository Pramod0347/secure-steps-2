"use client";

import React from "react";
import { motion } from "framer-motion";

const LeapOfFaithSection = () => {
  const stats = [
    { number: "75+", label: "Happy Students" },
    { number: "150+", label: "Student Enquiries" },
    { number: "100%", label: "Transparency" },
    { number: "100%", label: "Reliable" },
  ];

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3"
        >
          <span className="bg-gradient-to-r from-[#997CE1] via-[#E2B9E3] to-[#FA7BD6] bg-clip-text text-transparent">
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
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-200 flex items-center justify-center mb-2 hover:border-gray-400 transition-colors">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.number}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 text-center max-w-[80px] sm:max-w-[100px]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeapOfFaithSection;
