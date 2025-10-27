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
      className={`p-4 transition-opacity duration-300 ${faded ? "opacity-50" : "opacity-100"}`}
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

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  // Function to determine positions for mobile view
  const getMobilePosition = (index:any, activeIndex:any, totalItems:any) => {
    const isActive = index === activeIndex;
    const isLeft = index === (activeIndex - 1 + totalItems) % totalItems;
    const isRight = index === (activeIndex + 1) % totalItems;
    
    if (isActive) return 0;
    if (isLeft) return -70;
    if (isRight) return 70;
    return 0;
  };

  return (
    <div className="flex w-screen md:h-[90vh] h-[65vh] items-center flex-col overflow-hidden">
      {/* Content */}
      <div className="relative z-10 w-full">
        <h1 className="text-[20px] text-center leading-[25.2px] md:text-5xl my-10 md:my-0 uppercase md:font-semibold font-[800] ">
          <p className="text-center bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block font-bold">Testimonials</p>
        </h1>

        {/* Carousel */}
        <div className="relative w-full md:h-[350px] h-[400px] -mt-10 md:mt-20 flex items-center justify-center">
          <div className="relative flex items-center justify-center w-full">
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex;
              const isLeft = index === (activeIndex - 1 + testimonials.length) % testimonials.length;
              const isRight = index === (activeIndex + 1) % testimonials.length;
              
              // Only render the three visible cards
              if (!isActive && !isLeft && !isRight) return null;
              
              const mobileX = getMobilePosition(index, activeIndex, testimonials.length);

              return (
                <motion.div
                  key={index}
                  className={`absolute transition-all duration-500 ease-in-out ${
                    isActive ? "z-30 md:scale-105 scale-100" : 
                    "z-20 md:scale-90 scale-75 opacity-60"
                  }`}
                  style={{
                    transform: `translateX(${window.innerWidth >= 768 ? (isActive ? 0 : isLeft ? -800 : 800) : mobileX}px) ${isActive ? "scale(1)" : "scale(0.75)"}`,
                    width: window.innerWidth >= 768 ? "auto" : "260px",
                  }}
                >
                  <div className={window.innerWidth < 768 ? "max-w-[260px]" : ""}>
                    <TestiCard
                      image={testimonial.image}
                      content={testimonial.content}
                      name={testimonial.name}
                      role={testimonial.role}
                    />
                  </div>
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