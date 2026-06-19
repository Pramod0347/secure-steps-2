"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    imageClassName: "object-contain object-center scale-[1.02] sm:scale-[1.06] lg:scale-[1.1]",
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
    imageClassName: "origin-top object-contain object-top scale-[1.08] sm:scale-[1.12] lg:scale-[1.18]",
  },
];

const FounderScrollCard = ({
  children,
  flat = false,
}: {
  children: React.ReactNode;
  flat?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    flat ? [1, 1, 1] : (isMobile ? [0.94, 1, 0.97] : [0.92, 1, 0.985])
  );
  // Keep the entrance tilt, but let the card settle flat while it is in view.
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.18, 1],
    flat ? [0, 0, 0] : [14, 0, 0]
  );
  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    flat ? [0, 0, 0] : [56, 0, -32]
  );

  return (
    <div ref={containerRef} className="relative [perspective:1200px]">
      <motion.div
        style={{
          rotateX,
          scale,
          y: translateY,
          transformStyle: flat ? undefined : "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const AboutSection = ({ flat = false }: { flat?: boolean }) => {
  const profileCard = (founder: (typeof founders)[number], index: number) => (
    <FounderScrollCard key={founder.name} flat={flat}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        viewport={{ once: true, amount: 0.2 }}
        className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#faf6ff_0%,#f0e4fd_34%,#f6e5f5_66%,#f9f1ff_100%)] text-slate-900 shadow-[0_32px_90px_-45px_rgba(156,132,196,0.22)] sm:rounded-[2.5rem]"
      >
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[380px] p-5 sm:min-h-[500px] sm:p-6 lg:min-h-[560px] lg:p-8">
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_60px_-35px_rgba(119,87,179,0.18)]">
              <div className="absolute inset-0 bg-white" />
              <div className="absolute inset-0">
                <Image
                  src={founder.image}
                  alt=""
                  fill
                  quality={90}
                  aria-hidden="true"
                  className={
                    founder.imageClassName ??
                    "object-contain object-center scale-[1.02] sm:scale-[1.06] lg:scale-[1.1]"
                  }
                  style={{
                    filter: "blur(18px)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, transparent 58%, black 100%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, transparent 58%, black 100%)",
                  }}
                />
              </div>
              <div className="absolute inset-0">
                <Image
                  src={founder.image}
                  alt={`${founder.name} - Co Founder`}
                  fill
                  priority
                  quality={95}
                  className={
                    founder.imageClassName ??
                    "object-contain object-center scale-[1.02] sm:scale-[1.06] lg:scale-[1.1]"
                  }
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 74%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 74%, transparent 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-12 lg:py-16 lg:text-left">
            <div className="max-w-xl">
              <p className="text-[1.75rem] font-semibold tracking-tight text-slate-900 sm:text-[2rem] lg:text-[2.15rem]">
                {founder.name}
              </p>

              <div className="mt-3 inline-flex items-center rounded-full border border-white/45 bg-white/45 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-700 backdrop-blur-sm">
                Co Founder
              </div>

              <p className="mt-8 text-[1.5rem] font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-[1.8rem] lg:text-[2.1rem]">
                {founder.headline}
              </p>

              <p className="mt-5 text-[15px] leading-[1.85] text-slate-700 sm:text-[0.98rem] lg:text-[1rem]">
                {founder.supporting}
              </p>

              <div className="mt-8 rounded-[1.75rem] border border-white/45 bg-white/40 p-5 text-left backdrop-blur-sm sm:p-6">
                <h3 className="text-[1.5rem] font-semibold leading-tight text-slate-900 sm:text-[1.65rem] lg:text-[1.8rem]">
                  Why help{" "}
                  <span className="inline-block bg-gradient-to-r from-[#997CE1] via-[#E2B9E3] to-[#FA7BD6] bg-clip-text font-bold text-transparent">
                    {founder.accentWord}
                  </span>
                </h3>
                <p className="mt-4 text-sm leading-[1.8] text-slate-700 sm:text-[0.96rem] lg:text-[0.98rem]">
                  {founder.detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </FounderScrollCard>
  );

  return (
    <section className="brand-section-bg py-12 sm:py-16 lg:py-24" style={{ fontFamily: "var(--font-inter)" }}>
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
          {founders.map((founder, index) => profileCard(founder, index))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
