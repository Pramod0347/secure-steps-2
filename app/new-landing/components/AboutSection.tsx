"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-10"
        >
          <div className="text-center mb-4 sm:mb-6">
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
              Why Secure Steps?
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 sm:mb-6 px-2">
            Most consultancies start with university options, we start with you
          </h2>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-gray-800 max-w-4xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed px-2">
            We give you a curated roadmap, a Google Map for your career, helping you understand
            your personality, strengths and future opportunities so you reach your destination
            on time and with less hassle
          </p>
        </motion.div>

        {/* Co-founder Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="relative w-64 sm:w-72 lg:w-80"
              style={{ perspective: "800px" }}
            >
              {/* Dark card background - positioned lower so head overflows */}
              <div
                className="relative rounded-2xl sm:rounded-3xl shadow-2xl mt-16 sm:mt-20"
                style={{ transform: "rotateY(5deg)", transformStyle: "preserve-3d" }}
              >
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl sm:rounded-3xl h-72 sm:h-80 lg:h-96 relative border border-gray-200">
                  {/* Image - anchored to bottom, head overflows top of dark card */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[130%] z-10">
                    <Image
                      src="https://pub-1ed7e98a27564218aec0343ef05fbd57.r2.dev/shreshta.png"
                      alt="Shreshta Dechamma - Co Founder"
                      fill
                      className="object-contain object-bottom"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">Co Founder</p>
              <p className="text-gray-900 font-semibold text-lg">Shreshta Dechamma</p>
            </div>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <p className="text-gray-800 text-base sm:text-lg lg:text-xl leading-relaxed">
                It started when I was 13. Watching my mother teach me, I realised something powerful.
                Impacting a student&apos;s life is the greatest success one can achieve.
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Why help you?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                When I was graduating from school, I was constantly validating my career choice.
                It took 3 trial degrees, to achieve what I truly loved. So here I am to avoid
                trials and give you a clear direction, because no student should have to go
                through what I went through.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
