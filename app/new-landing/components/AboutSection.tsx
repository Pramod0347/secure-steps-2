"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const founders = [
  {
    name: "Shreshta Dechamma",
    image: "https://pub-1ed7e98a27564218aec0343ef05fbd57.r2.dev/shreshta.png",
    headline:
      "It started when I was 13. Watching my mother teach me, I realised something powerful.",
    supporting: "Impacting a student's life is the greatest success one can achieve.",
    detail:
      "When I was graduating from school, I was constantly validating my career choice. It took 3 trial degrees to achieve what I truly loved. So here I am to avoid trials and give you a clear direction, because no student should have to go through what I went through.",
    accentWord: "you?",
  },
  {
    name: "Sandeep",
    image: "https://pub-1ed7e98a27564218aec0343ef05fbd57.r2.dev/sandeep.png",
    headline:
      "My journey across 7 different schools and into top automotive companies taught me one thing,",
    supporting:
      "success comes to those who see the world differently. Secure Steps was built to give students that perspective, the right direction, and the confidence to step into the top 1% of opportunities globally.",
    detail:
      "Secure Steps exists to help students think beyond the obvious, choose with confidence, and move toward globally competitive opportunities with the right perspective from the start.",
    accentWord: "globally.",
    imageClassName: "origin-top object-contain object-top scale-[1.16] lg:scale-[1.22]",
    blurFillClassName: "origin-bottom object-contain object-bottom scale-[1.28] lg:scale-[1.34] blur-md opacity-45",
  },
];

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

        <div className="mx-auto max-w-6xl space-y-8">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#121212] text-white shadow-[0_32px_90px_-45px_rgba(0,0,0,0.55)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-stretch">
                <div className="relative min-h-[380px] sm:min-h-[500px] lg:min-h-[560px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_42%)]">
                  <div className="absolute inset-x-6 top-4 h-16 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute inset-x-5 bottom-0 top-4 sm:inset-x-8 lg:top-6">
                    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#1f1f1f] via-[#151515] to-[#0f0f0f]">
                      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-400/10 to-transparent" />
                      <Image
                        src={founder.image}
                        alt={`${founder.name} - Co Founder`}
                        fill
                        className={founder.imageClassName || "object-contain object-bottom scale-[1.08] lg:scale-[1.14]"}
                      />
                      {founder.blurFillClassName && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden">
                          <Image
                            src={founder.image}
                            alt=""
                            fill
                            aria-hidden="true"
                            className={founder.blurFillClassName}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/55 to-transparent" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#121212] via-[#121212]/55 to-transparent" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-end px-6 pb-8 pt-5 sm:px-10 sm:pb-10 sm:pt-7 lg:px-12 lg:pb-12">
                  <p className="text-[1.75rem] font-semibold text-white sm:text-[2rem] lg:text-[2.15rem]">
                    {founder.name}
                  </p>

                  <div className="mt-3 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/65">
                    Co Founder
                  </div>

                  <p className="mt-6 max-w-xl text-[1.45rem] font-medium leading-[1.12] tracking-tight text-white sm:text-[1.7rem] lg:text-[2.15rem]">
                    {founder.headline}
                  </p>

                  <p className="mt-5 max-w-lg text-[15px] leading-[1.75] text-white/78 sm:text-[0.98rem] lg:text-[1rem]">
                    {founder.supporting}
                  </p>

                  <div className="mt-8 rounded-[1.75rem] border border-white/8 bg-white/4 p-5 sm:p-6">
                    <h3 className="text-[1.65rem] font-semibold leading-tight text-white sm:text-[1.8rem] lg:text-[1.95rem]">
                      Why help{" "}
                      <span className="inline-block bg-gradient-to-r from-[#997CE1] via-[#E2B9E3] to-[#FA7BD6] bg-clip-text text-transparent font-bold">
                        {founder.accentWord}
                      </span>
                    </h3>
                    <p className="mt-4 text-sm leading-[1.8] text-white/72 sm:text-[0.96rem] lg:text-[0.98rem]">
                      {founder.detail}
                    </p>
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

export default AboutSection;
