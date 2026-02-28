"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Github } from "lucide-react";

const AboutSection = () => {
  const leftBenefits = [
    {
      title: "Certificate of Completion",
      description:
        "Receive a recognized credential that significantly boosts your resume.",
    },
    {
      title: "Networking Opportunities",
      description:
        "Connect with peers and valuable industry professionals for growth.",
    },
  ];

  const rightBenefits = [
    {
      title: "Comprehensive Curriculum",
      description:
        "Master essential topics and practical skills effectively and thoroughly.",
    },
    {
      title: "Expert Guidance",
      description:
        "Learn from experienced instructors for personalized and effective support.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
            About Me
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 sm:mb-6 px-2">
          But Why CourseSite ?
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10 sm:mb-16 text-sm sm:text-base px-2">
          Explore the incredible advantages of enrolling in our courses and
          enhancing your skills for the ultimate career success.
        </p>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-center">
          {/* Left Benefits */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            {leftBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-left lg:text-right"
              >
                <div className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200 p-4 sm:p-6 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center - Instructor */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 border border-gray-200 aspect-[3/4]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-7xl sm:text-9xl opacity-50">👨‍🏫</div>
              </div>
            </div>

            {/* Info Card */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">
                  <span className="text-gray-900 font-semibold">
                    I started my journey:
                  </span>{" "}
                  In web design and development in 2010 at the age of 24. I
                  transitioned into a full-time instructor and mentor in 2018.
                </p>
                <p className="text-gray-700 text-xs sm:text-sm">
                  <span className="text-gray-900 font-semibold">
                    Through hands-on:
                  </span>{" "}
                  project-based courses, I simplify challenging topics and make
                  them accessible to everyone.
                </p>

                {/* Social Links */}
                <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <Link
                    href="#"
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Twitter className="w-4 sm:w-5 h-4 sm:h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Github className="w-4 sm:w-5 h-4 sm:h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Benefits */}
          <div className="space-y-4 sm:space-y-6 order-3">
            {rightBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200 p-4 sm:p-6 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
