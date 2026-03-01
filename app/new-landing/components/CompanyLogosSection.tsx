"use client";

import React from "react";
import { motion } from "framer-motion";

const CompanyLogosSection = () => {
  const universities = [
    { name: "SKEMA Business School", short: "SKEMA", color: "from-blue-600 to-blue-800" },
    { name: "UCL", short: "UCL", color: "from-purple-600 to-purple-800" },
    { name: "NYIT", short: "NYIT", color: "from-blue-500 to-indigo-700" },
    { name: "Warwick Business School", short: "Warwick", color: "from-purple-700 to-purple-900" },
    { name: "Toronto Metropolitan University", short: "TMU", color: "from-blue-600 to-blue-900" },
    { name: "Monash University", short: "Monash", color: "from-gray-700 to-gray-900" },
    { name: "James Cook University", short: "JCU", color: "from-yellow-500 to-yellow-700" },
    { name: "SP Jain", short: "SP Jain", color: "from-red-600 to-red-800" },
    { name: "Johns Hopkins University", short: "Johns Hopkins", color: "from-blue-700 to-blue-900" },
    { name: "Queen Mary University of London", short: "QMUL", color: "from-red-700 to-red-900" },
    { name: "Kings College London", short: "KCL", color: "from-red-600 to-red-800" },
    { name: "Heriot-Watt University", short: "Heriot Watt", color: "from-blue-800 to-indigo-900" },
  ];

  const stats = [
    { number: "75+", label: "Happy Students" },
    { number: "150+", label: "Student Enquiries" },
    { number: "100%", label: "Transparency" },
    { number: "100%", label: "Reliable" },
  ];

  return (
    <>
      {/* Universities Marquee Section */}
      <section className="py-10 sm:py-16 border-y border-gray-100 bg-white overflow-hidden">
        <div className="w-full">
          <p className="text-center text-gray-600 text-sm sm:text-base mb-6 sm:mb-10 px-4">
            Some renowned universities where Secure students study
          </p>

          {/* Marquee Container */}
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10" />
            
            <div className="flex animate-marquee whitespace-nowrap">
              {[...universities, ...universities].map((uni, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-3 mx-3 sm:mx-4 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 transition-colors flex-shrink-0"
                  title={uni.name}
                  aria-label={uni.name}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${uni.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {uni.short.charAt(0)}
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    {uni.short}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Students Who Took A Leap of Faith Section */}
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
            <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent">
              STUDENTS WHO TOOK A LEAP OF FAITH WITH SECURE
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
    </>
  );
};

export default CompanyLogosSection;
