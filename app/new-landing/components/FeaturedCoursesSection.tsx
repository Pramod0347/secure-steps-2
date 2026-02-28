"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const FeaturedCoursesSection = () => {
  const courses = [
    {
      title: "JavaScript Full Mastery 2024 Edition",
      description:
        "Master JavaScript with our updated course. Learn core concepts, ES6+, and advanced techniques to create dynamic, responsive web applications.",
      price: "$99",
      level: "Intermediate",
      featured: true,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Framer Full Mastery & More 2024",
      description:
        "Master Framer in 2024 with this updated course. Learn to design, prototype, and build interactive websites with ease.",
      price: "$99",
      level: "Beginner",
      featured: true,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Figma Full Mastery 2024 Edition",
      description:
        "Master Figma in 2024 with this updated course. Learn to design, prototype, and collaborate on stunning, user-friendly interfaces.",
      price: "$79",
      level: "Beginner",
      featured: true,
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-600">
            Our Courses
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 sm:mb-6">
          Featured Courses
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10 sm:mb-16 text-sm sm:text-base px-2">
          From critical skills to technical topics, we support your professional
          development with courses that help you grow and succeed.
        </p>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2">
                {/* Course Banner */}
                <div
                  className={`h-36 sm:h-48 bg-gradient-to-br ${course.gradient} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 text-sm font-medium">
                      {course.price}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-6xl opacity-30">
                    📚
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3">
                    {course.featured && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300"
          >
            View All Courses
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;
