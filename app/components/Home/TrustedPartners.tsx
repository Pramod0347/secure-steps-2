import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
// import ArizonUniv from "@/app/assets/Home/univ-arizona.png";
// import BrunelUniv from "@/app/assets/Home/univ-brunel.png";
// import GreenUniv from "@/app/assets/Home/univ-greenwich.png";
// import QueenUniv from "@/app/assets/Home/univ-queen-University.png";
import { Univ1,Univ2,Univ3,Univ4,Univ5 } from "@/app/assets/Home/University";

import { StaticImageData } from "next/image";

interface PartnerCardProps {
  image: { src: StaticImageData; alt: string };
  faded?: boolean;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ image, faded = false }) => {
  return (
    <div
      className={`transition-opacity duration-300 ${
        faded ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="relative h-48 w-32 md:h-64 md:w-64">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

const TrustedPartnersCarousel = () => {
  const partners = [
    { src: Univ1, alt: "Univ1" },
    { src: Univ2, alt: "Univ2" },
    { src: Univ3, alt: "Univ3" },
    { src: Univ4, alt: "Univ4" },
    { src: Univ5, alt: "Univ5" },
    
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % partners.length);
  }, [partners.length]);

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="w-full text-center mx-auto px-4  ">
      <h2 className="md:text-[32px] text-[20px] font-bold uppercase">
      Universities that await your application
      </h2>
      <p>You name it, We have it</p>
      <div className="relative w-full h-[130px] md:h-[250px] flex items-center justify-center overflow-hidden">
        <div className="relative flex items-center justify-center w-full">
          {partners.map((partner, index) => {
            const isActive = index === activeIndex;
            const isLeft = index === (activeIndex - 1 + partners.length) % partners.length;
            const isSecondLeft = index === (activeIndex - 2 + partners.length) % partners.length;
            const isRight = index === (activeIndex + 1) % partners.length;
            const isSecondRight = index === (activeIndex + 2) % partners.length;

            // Only show cards that should be visible based on screen size
            const isVisible = isMobile
              ? (isActive || isLeft || isRight)
              : (isActive || isLeft || isSecondLeft || isRight || isSecondRight);

            if (!isVisible) return null;

            // Calculate position and visibility
            let position = 0;
            if (isLeft) position = -1;
            else if (isSecondLeft) position = -2;
            else if (isRight) position = 1;
            else if (isSecondRight) position = 2;

            return (
              <motion.div
                key={index}
                className={`absolute transition-all duration-500 ease-in-out ${
                  isActive
                    ? "z-10 scale-125"
                    : "z-5 scale-75 opacity-60"
                }`}
                style={{
                  transform: `translateX(${position * 500}px)`,
                  opacity: isActive ? 1 : 
                          (isLeft || isRight) ? 0.6 : 
                          (isSecondLeft || isSecondRight) ? 0.3 : 0,
                  display: isVisible ? 'block' : 'none'
                }}
              >
                <PartnerCard
                  image={partner}
                  faded={!isActive}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustedPartnersCarousel;