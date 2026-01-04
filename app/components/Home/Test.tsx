"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import TestImage from "@/app/assets/Home/Testimonial-Men.png";
import { StudentOne, StudentTwo, StudentThree, StudentFour, StudentFive, StudentSix } from "@/app/assets/Home/Testimonials_Img";
import Quote from "@/app/assets/Home/Quotes.png";

const TestiCard = ({
  faded,
  image,
  name,
  content,
  role
}: {
  faded?: boolean;
  name: string | undefined
  image: StaticImageData;
  content: string;
  role?: string
}) => {
  return (
    <div
      className={`p-4 transition-opacity duration-300 ${faded ? "opacity-50" : "opacity-100"}   `}
    >
      <div className="flex flex-col md:flex-row relative overflow-hidden bg-white md:w-[750px] w-full mx-auto rounded-[15px]" style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)" }}>
        {/* Left side with image */}
        <div className="relative flex-[0.7] hidden md:block">
          <div className="absolute inset-0 z-10" />
          <Image
            src={image || TestImage}
            className="h-full w-full object-cover z-[99999] relative"
            width={400}
            height={500}
            alt="Testimonial"
          />
        </div>

        {/* Right side with content */}
        <div className="flex-1 p-2 md:p-4">
          <Image
            src={image || TestImage}
            className="h-[120px] md:hidden w-[120px] mx-auto object-cover z-[99999] relative "
            width={400}
            height={500}
            alt="Testimonial"
          />

          {/* Quote mark */}
          <div className="flex justify-start mb-1 mt-2 md:mt-10 md:-ml-1 w-[13px] md:w-[30px]">
            <Image src={Quote} alt="Quote" width={30} height={30} />
          </div>

          {/* Testimonial content */}
          <div className="relative z-10">
            <p className="md:text-[16px] text-[9px] leading-3 md:h-[260px] text-black mb-4 md:mb-8 w-full md:leading-6 justify-normal max-h-[300px] overflow-y-auto">
              {content}
            </p>

            {/* Author info */}
            <div className="mb-2 md:mb-0">
              <h3 className="md:text-xl text-[12px] font-semibold text-gray-900 md:mb-1">
                {name}
              </h3>
              <p className="text-gray-500 text-[10px] md:text-[16px]">{role}</p>
            </div>
          </div>

          <div className="bg-gradient-to-tl from-red-500 to-white blur-[60px] h-[35%] w-[30%] absolute bottom-0 right-0">
          </div>
        </div>
      </div>
    </div>
  );
};

const Test = () => {
  const testimonials = [
    {
      image: StudentOne,
      content:
        "My journey to move to the UK was a rollercoaster ride, to say the least. Thanks to Secure Steps, every bump on the road was easy to overcome. They alleviated all my travel anxieties and helped me settle down without any hassle. From admission to housing, opening  bank accounts to being a source of emotional support, I could always rely on them. Secure Steps not only provided exceptional assistance, but their professionalism and dedication were truly commendable.",
      name: "Anjali",
      role: "Now an Entrepreneur"
    },
    {
      image: StudentTwo,
      content:
        "I had the pleasure of working with Secure Steps in securing a home in Manchester. From the outset, they not only helped me find the perfect home but also guided me through every step of the process with remarkable expertise and dedication.Their professionalism, knowledge, and genuine care made the entire experience smooth and stress-free. I highly recommend Secure Steps Ltd services to anyone seeking a home anywhere in the UK. Thank you for your exceptional support!",
      name: "Sneha Suresh",
      role: "Now a Professor"
    },
    {
      image: StudentThree,
      content:
        "I had a fantastic experience with secure steps. I stayed at my friend's house during my initial days because I couldn't find an accommodation in London. I had insisted that I needed a place to stay immediately. They set up a few viewings and finalised on a beautiful 2 bed apartment in Oxford Street within a week's time. I can't thank them enough for making the entire process stress free for me!.",
      name: "Zohab",
      role: "Now a Business Owner"
    },
    {
      image: StudentFour,
      content:
        "A group of six boys and I from India moved to London together to pursue our master's degree. Finding a house that could accommodate all of us was nearly impossible from India.Secure Steps fulfilled this request with just one phone call. A massive four-bedroom house was reserved for us. They greeted us at the airport with the house keys and drove us straight to our new home.What could bring greater joy than securing a home even before flying?",
      name: "Akshay",
      role: "Now a Data Analyst"
    },
    {
      image: StudentFive,
      content:
        "Secure Steps took every aspect of my requests into consideration.From helping me secure my admission at Kingston University to finding a very reasonable private accommodation, they truly played a huge role. They don't just leave you alone once you fly out, they guide you and answer every little question until you've fully settled.Thank you, Secure Steps!",
      name: "Alan Thomas",
      role: "Now a Devops Engineer"
    },
    {
      image: StudentSix,
      content:
        "Moving to the UK for my master's was easy, but bringing my family of five with me was stressful. Finding a house as an immigrant family was no joke, especially proving we had enough funds to afford a property. No landlords believed in us. When this gave me anxiety, Secure Steps stepped in, booking viewings and handling all discussions with landlords on our behalf.Thanks to them, we are now living in an independent house in Portsmouth, and we couldn't ask for more.Thank you, Secure Steps!",
      name: "Diana",
      role: "Now a Student"
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  // Get transform position for each card
  const getCardPosition = (index: number) => {
    const isActive = index === activeIndex;
    const isLeft = index === (activeIndex - 1 + testimonials.length) % testimonials.length;
    const isRight = index === (activeIndex + 1) % testimonials.length;

    if (isMobile) {
      if (isActive) return { x: 0, scale: 1, opacity: 1 };
      if (isLeft) return { x: -80, scale: 0.75, opacity: 0.5 };
      if (isRight) return { x: 80, scale: 0.75, opacity: 0.5 };
    } else {
      if (isActive) return { x: 0, scale: 1, opacity: 1 };
      if (isLeft) return { x: -750, scale: 0.85, opacity: 0.6 };
      if (isRight) return { x: 750, scale: 0.85, opacity: 0.6 };
    }
    return { x: 0, scale: 0, opacity: 0 };
  };

  return (
    <div className="flex w-screen min-h-[500px] md:min-h-[600px] lg:min-h-[700px] items-center flex-col overflow-hidden py-8 md:py-12">
      {/* Content */}
      <div className="relative z-10 w-full">
        <h1 className="text-[18px] sm:text-[22px] text-center leading-[1.3] md:text-3xl lg:text-4xl xl:text-5xl mb-6 md:mb-10 uppercase md:font-semibold font-bold">
          <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block font-bold">Testimonials</span>
        </h1>

        {/* Carousel */}
        <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center">
          <div className="relative flex items-center justify-center w-full h-full">
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex;
              const isLeft = index === (activeIndex - 1 + testimonials.length) % testimonials.length;
              const isRight = index === (activeIndex + 1) % testimonials.length;
              
              // Only render the three visible cards
              if (!isActive && !isLeft && !isRight) return null;
              
              const position = getCardPosition(index);

              return (
                <motion.div
                  key={index}
                  className={`absolute ${isActive ? "z-30" : "z-20"}`}
                  initial={false}
                  animate={{
                    x: position.x,
                    scale: position.scale,
                    opacity: position.opacity,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: isMobile ? "280px" : "auto",
                  }}
                >
                  <TestiCard
                    image={testimonial.image}
                    content={testimonial.content}
                    name={testimonial.name}
                    role={testimonial.role}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;