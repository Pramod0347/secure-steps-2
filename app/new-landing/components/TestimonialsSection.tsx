"use client";

import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import Image from "next/image";

interface Testimonial {
  id: number;
  quote: string;
  highlight?: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  bgColor: string;
}

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(1);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "The attention to detail is outstanding. Clean transitions are professional. Every product page is beautifully executed.",
      highlight: "professional",
      name: "Daniel Brooks",
      role: "UX Lead",
      company: "TechFlow",
      avatar: "/testimonials/student1.jpg",
      bgColor: "from-purple-100 to-purple-200",
    },
    {
      id: 2,
      quote: "It feels cinematic and never distracting. Clear, professional. Every product page runs beautifully even with complex animations.",
      highlight: "professional",
      name: "Marcus L",
      role: "UX Lead",
      company: "DesignCo",
      avatar: "/testimonials/student2.jpg",
      bgColor: "from-blue-100 to-cyan-100",
    },
    {
      id: 3,
      quote: "Secure Steps helped me find the perfect university. The counselling sessions were incredibly insightful and I am extremely impressed with their guidance and support.",
      highlight: "extremely impressed",
      name: "Ananya Sharma",
      role: "MS Computer Science",
      company: "University of Birmingham",
      avatar: "/testimonials/student3.jpg",
      bgColor: "from-amber-50 to-yellow-100",
    },
    {
      id: 4,
      quote: "They transformed our entire approach from start to finish. The attention to our vision perfectly exceeded what we imagined.",
      highlight: "exceeded",
      name: "Sneha Thompson",
      role: "Product Lead",
      company: "InnovateTech",
      avatar: "/testimonials/student4.jpg",
      bgColor: "from-green-100 to-emerald-100",
    },
    {
      id: 5,
      quote: "The personality assessments and career mapping completely changed my perspective. I went from confused to confident about my future.",
      highlight: "confused to confident",
      name: "Rahul Verma",
      role: "MBA Finance",
      company: "Warwick Business School",
      avatar: "/testimonials/student5.jpg",
      bgColor: "from-rose-100 to-pink-100",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const normalizedDiff = ((diff + testimonials.length) % testimonials.length);
    const adjustedDiff = normalizedDiff > testimonials.length / 2 ? normalizedDiff - testimonials.length : normalizedDiff;
    
    if (adjustedDiff === 0) {
      // Center card
      return {
        x: 0,
        scale: 1,
        zIndex: 30,
        opacity: 1,
        rotateY: 0,
        filter: "blur(0px)",
      };
    } else if (adjustedDiff === -1) {
      // Left card
      return {
        x: -320,
        scale: 0.85,
        zIndex: 20,
        opacity: 0.7,
        rotateY: 15,
        filter: "blur(2px)",
      };
    } else if (adjustedDiff === 1) {
      // Right card
      return {
        x: 320,
        scale: 0.85,
        zIndex: 20,
        opacity: 0.7,
        rotateY: -15,
        filter: "blur(2px)",
      };
    } else if (adjustedDiff === -2) {
      // Far left card
      return {
        x: -560,
        scale: 0.7,
        zIndex: 10,
        opacity: 0.4,
        rotateY: 25,
        filter: "blur(4px)",
      };
    } else if (adjustedDiff === 2) {
      // Far right card
      return {
        x: 560,
        scale: 0.7,
        zIndex: 10,
        opacity: 0.4,
        rotateY: -25,
        filter: "blur(4px)",
      };
    } else {
      // Hidden cards
      return {
        x: adjustedDiff < 0 ? -700 : 700,
        scale: 0.5,
        zIndex: 0,
        opacity: 0,
        rotateY: adjustedDiff < 0 ? 30 : -30,
        filter: "blur(6px)",
      };
    }
  };

  const renderHighlightedQuote = (quote: string, highlight?: string) => {
    if (!highlight) return quote;
    const parts = quote.split(highlight);
    if (parts.length < 2) return quote;
    return (
      <>
        {parts[0]}
        <span className="bg-yellow-300 px-1 rounded">
          {highlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-gray-100 to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
            Testimonials
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
          Our students feedback
        </h2>

        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 sm:mb-16 text-sm sm:text-base px-2">
          Explore how our counselling sessions, personality assessments, and career mapping 
          help students design not just a degree, but a life they truly want.
        </p>
      </div>

      {/* 3D Carousel Container */}
      <div 
        className="relative h-[450px] sm:h-[350px] lg:h-[450px] flex items-center justify-center touch-pan-y" 
        style={{ perspective: "1200px" }}
      >
        {/* Cards */}
        <motion.div 
          className="relative w-full max-w-[450px] lg:max-w-[520px] h-[300px] sm:h-[350px] lg:h-[420px]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {testimonials.map((testimonial, index) => {
            const style = getCardStyle(index);
            return (
              <motion.div
                key={testimonial.id}
                className="absolute top-0 left-1/2 w-[340px] sm:w-[420px] lg:w-[480px] cursor-grab active:cursor-grabbing"
                initial={false}
                animate={{
                  x: style.x,
                  scale: style.scale,
                  zIndex: style.zIndex,
                  opacity: style.opacity,
                  rotateY: style.rotateY,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{
                  marginLeft: "-170px",
                  transformStyle: "preserve-3d",
                  filter: style.filter,
                }}
                onClick={() => setCurrentIndex(index)}
              >
                <div className={`rounded-3xl bg-gradient-to-br ${testimonial.bgColor} p-6 sm:p-8 lg:p-10 shadow-xl h-full`}>
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg 
                      className="w-10 h-10 lg:w-12 lg:h-12 text-indigo-900" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                    </svg>
                  </div>

                  {/* Quote */}
                  <p className="text-gray-800 text-base sm:text-lg lg:text-xl leading-relaxed mb-8">
                    &ldquo;{renderHighlightedQuote(testimonial.quote, testimonial.highlight)}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-white shadow-md">
                      {testimonial.avatar ? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    
                    {/* Verified badge */}
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <div>
                      <div className="text-gray-900 font-semibold text-sm sm:text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        {testimonial.role} {testimonial.company && `· ${testimonial.company}`}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-gray-900 w-8" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
