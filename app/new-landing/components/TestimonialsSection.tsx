"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "The courses are top-notch, providing in-depth knowledge that's easy to apply. Each lesson is structured to ensure you fully grasp the material.",
      name: "Brendan Wilson",
      role: "Aspiring Web Designer",
      avatar: "👨‍💻",
    },
    {
      quote:
        "The courses are excellent, delivering practical insights with ease. Each module is designed to help you fully understand and apply the knowledge.",
      name: "Rock Lee",
      role: "Web Designer",
      avatar: "👨‍🎨",
    },
    {
      quote:
        "These courses are exceptional, offering detailed content that's easy to implement. Every lesson is carefully crafted to deepen your understanding.",
      name: "Sakura",
      role: "Web Developer",
      avatar: "👩‍💻",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
            Testimonials
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 sm:mb-6 px-2">
          Our Students feedback
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-2">
          Explore the incredible advantages of enrolling in our courses and
          enhancing your skills.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mb-10 sm:mb-16">
          <button className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 text-sm sm:text-base">
            Start Learning Now
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200 p-5 sm:p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 h-full">
                {/* LinkedIn Icon */}
                <Link
                  href="#"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mb-6 hover:bg-blue-200 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>

                {/* Quote */}
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
