"use client";

import React from "react";
import { motion } from "framer-motion";

const CommunitySection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
            Community
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 sm:mb-6 px-2">
          Join our community where creativity thrives.
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-2">
          Unlock the amazing benefits of joining our community, growing your
          skills, and building connections.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-10 sm:mb-16">
          <button className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 text-sm sm:text-base">
            Start Learning Now
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </button>
        </div>

        {/* Chat Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-lg">
            {/* Chat Messages */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                  <p className="text-gray-700 text-sm">
                    Do you think this design is better?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl rounded-tr-none px-4 py-3 max-w-xs">
                  <p className="text-gray-700 text-sm">
                    This one is slightly better, it has more contrast
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
