"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import CircleAnimation from "./CircleAnimation";
import avatars from "./Avatars";

interface CourseImage {
  src: string;
  alt: string;
}

interface InfiniteCarouselProps {
  images: CourseImage[];
  rotate: string;
  direction: "left" | "right";
  speed?: number; // Speed multiplier (default will be 2)
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  images,
  rotate,
  direction,
  speed = 2, // Default speed multiplier
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const container = containerRef.current;
    if (!scrollContainer || !container) return;

    const itemWidth = 416; // 400px width + 16px gap
    const totalWidth = itemWidth * images.length;

    // Start from negative total width for right direction
    let currentPosition = direction === "right" ? -totalWidth : 0;

    const animate = () => {
      if (direction === "left") {
        currentPosition -= speed; // Apply speed multiplier
        if (Math.abs(currentPosition) >= totalWidth) {
          currentPosition = 0;
        }
      } else {
        currentPosition += speed; // Apply speed multiplier
        if (currentPosition >= 0) {
          currentPosition = -totalWidth;
        }
      }

      container.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [direction, images.length, speed]); // Added speed to dependencies

  const quadImages = [...images, ...images, ...images, ...images];

  return (
    <div
      className="md:w-full md:overflow-x-hidden py-24  "
      style={{ transform: `rotate(${rotate})` }}
      ref={scrollRef}
    >
      <div
        ref={containerRef}
        className="flex gap-4 will-change-transform"
        style={{
          width: `${images.length * 416 * 4}px`,
          transform: `translate3d(${direction === "right" ? `-${images.length * 416}px` : '0'}, 0, 0)`,
        }}
      >
        {quadImages.map((image, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 md:w-[400px] md:h-[300px] w-[200px] h-[150px] rounded-2xl overflow-hidden"
          >
            <Image
              src={image.src || "/api/placeholder/400/300"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index < images.length * 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface CourseShowcaseProps {
  topImages: CourseImage[];
  bottomImages: CourseImage[];
  speed?: number; // Optional speed parameter for CourseShowcase
}

export const CourseShowcase: React.FC<CourseShowcaseProps> = ({
  topImages,
  bottomImages,
  speed = 5, // Default speed for both carousels
}) => {
  return (
    <div className="w-full mx-auto px-4 py-12 md:space-y-24 ">

      {/* Top course sliding */}
      {/* <div className="md:mb-32">
        <InfiniteCarousel 
          images={topImages} 
          rotate="-10deg" 
          direction="left"
          speed={speed} 
        />
      </div> */}

      {/* <div className="text-center space-y-2 relative z-10 my-10">
        <h2 className="text-[36px] md:text-6xl font-bold tracking-tight">
          Over 1000+ Course
        </h2>
        <p className="text-[36px] md:text-6xl font-bold tracking-tight">
          available <span className="text-red-500">to check</span>
        </p>
      </div> */}
      <CircleAnimation avatars={avatars} />


      {/* Bottom course sliding */}
      {/* <div className="md:mt-32">
        <InfiniteCarousel
          images={bottomImages}
          rotate="10deg"
          direction="right"
          speed={speed}
        />
      </div> */}
    </div>
  );
};