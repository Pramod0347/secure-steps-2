"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StickyScrollData from "./StickyScrollData";
import Logo from "@/app/assets/Home/LogoImg.png";
import HorizontalScrollingText from "../../ui/horizontalscrolling";
import RedBadge from "@/app/assets/Home/red_badge.svg";
import BlueBadge from "@/app/assets/Home/blue_badge.svg";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const StickyScroll = () => {
  const [active, setActive] = useState<string>("select");
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visibleSections = useRef<Set<string>>(new Set());
  const sectionCoveragePercentage = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Initialize with the first section
    if (StickyScrollData.length > 0) {
      visibleSections.current.add(StickyScrollData[0].id);
    }

    // GSAP Horizontal Sticky Animation
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          if (index === 0) {
            // First card stays in place
            gsap.set(ref, { x: 0, position: "sticky", left: 0, top: "0rem" });
          } else {
            // Other cards start from the right
            gsap.set(ref, { x: "100vw", position: "sticky", left: 0, top: "0rem" });
          }
          
          ScrollTrigger.create({
            trigger: ref,
            start: "top 50%",
            end: "bottom 90%", // Changed: Cards finish animation before section scrolls
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (index > 0) {
                // Ensure animation completes before section can scroll
                const progress = Math.min(self.progress * 1.5, 1); // Speed up animation completion
                gsap.to(ref, {
                  x: `${100 - (progress * 100)}vw`,
                  duration: 0.1,
                  ease: "power2.out",
                });
                
                // Only allow section scrolling after animation is complete
                if (progress >= 0.95) {
                  setActive(StickyScrollData[index].id);
                }
              } else {
                setActive(StickyScrollData[index].id);
              }
            },
            onEnter: () => {
              if (index === 0) {
                setActive(StickyScrollData[index].id);
              }
            },
          });
        }
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  interface ContentCardProps {
    cardId?: string;
    title: string;
    description?: string;
    variant: "blue" | "red";
    index: number;
    totalCards: number;
    tier?: string;
    price?: string;
    features?: { text: string }[];
    feature2?: { text: string }[];
  }

  function ContentCard({
    cardId,
    title,
    description,
    variant,
    index,
    totalCards,
    tier,
    price,
    features,
    feature2,
  }: ContentCardProps) {
    return (
      <div
        className={`w-[100%] overflow-hidden ${index < 4 ? "hidden md:block" : "hidden md:hidden"
          } rounded-[20px] ${variant === "blue"
            ? "bg-gradient-to-b from-[#5D4A9C] to-[#DA202E]"
            : "bg-gradient-to-b from-[#DA202E] to-[#5D4A9C]"
          } p-6 flex flex-col gap-4`}
      >
        <div className="space-y-2 mt-2">
          <h3
            className={`font-semibold text-white text-xl
          `}
          >
            {title}
          </h3>
          <p className="text-[12px] text-white/90">
            {cardId === "5 ways to prep" || "7 mistakes" ? description : ""}
          </p>
          {tier && <p className="text-sm text-white/90">{tier}</p>}
        </div>

        {price && (
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-white">₹</span>
            <span className="text-4xl font-bold text-white">{price}</span>
          </div>
        )}

        <div className="flex items-start gap-6">
          {features && (
            <div className="space-y-3 mt-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-white">{feature.text}</span>
                </div>
              ))}
            </div>
          )}
          {feature2 && (
            <div className="space-y-3 mt-3">
              {feature2.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-white">{feature.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const MobileContentCard = ({
    title,
    description,
    index,
    price,
    variant,
    features,
    feature2,
    id,
    tier
  }: {
    title: string;
    description?: string;
    index: number;
    variant: string;
    features?: { text: string }[];
    feature2?: { text: string }[];
    price?: string;
    id?: string;
    tier: string
  }) => {
    return (
      <div className="block md:hidden p-1 rounded-lg border border-gray-100 shadow-sm mb-1">
        <div className="flex items-center space-x-2">
          <div
            className={`flex-1 ${variant === "blue"
                ? "bg-gradient-to-b from-[#5D4A9C] to-[#DA202E]"
                : "bg-gradient-to-b from-[#DA202E] to-[#5D4A9C]"
              } px-2 py-1 rounded-lg `}
          >
            <div className="flex flex-row justify-between text-white relative">
              <div className="flex flex-col items-start gap-1">
                <p className="block text-[12px] w-[100%] font-bold md:bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent text-white">
                  {title}
                </p>
                {tier && <p className="text-[10px] text-white/90">{tier}</p>}
              </div>

              <p className="text-[10px] text-white">
                {price ? "₹" + price : ""}
              </p>
            </div>
            <span className="block text-[9px] font-extralight leading-3 text-white">
              {description}
            </span>

            <div className="flex items-start gap-2">
              {features && (
                <div className="space-y-3 mt-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-[9px] text-white">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {feature2 && (
                <div className="space-y-3 mt-3">
                  {feature2.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-[9px] text-white">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-1 w-24 h-0.5 bg-gradient-to-r from-[#DA202E] to-transparent"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ReactLenis root>
      <div className="min-h-screen -mb-5 pt-6 md:py-10 pb-0 md:pb-11 w-screen">
        <div className="flex flex-col items-center justify-center w-full mb-6 md:mb-10 gap-4 md:gap-6 px-4 md:px-8">
          <div className="text-xl md:text-4xl lg:text-5xl leading-tight font-extrabold text-center uppercase">
            <HorizontalScrollingText text="PRICING DESIGNED FOR AFFORDABILITY" />
          </div>
          <p className="text-sm md:text-lg lg:text-xl text-center leading-relaxed md:w-9/12 lg:w-7/12">
            We are offering an end-to-end solution that will help you secure
            success through every step of your journey.
          </p>
        </div>

        {StickyScrollData.map((item, index) => {
          const isActiveSection = active === item.id;
          const isSectionVisible = visibleSections.current.has(item.id);
          const coveragePercentage =
            sectionCoveragePercentage.current.get(item.id) || 0;

          return (
            <div
              key={item.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className="min-h-screen w-full flex items-center justify-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-b-xl md:rounded-[40px] min-h-[90vh] md:h-screen items-start justify-center mt-20 md:mt-24 w-full px-4 md:w-[90%] lg:w-[80%] mx-auto overflow-y-auto md:overflow-visible">
                <div className="relative h-full w-full md:w-[80%] order-1 md:order-1">
                  <div className="absolute inset-0">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.id}
                        width={500}
                        height={500}
                        className="h-[450px] md:h-[450px] lg:h-[550px] w-full md:w-[450px] object-cover rounded-[40px]"
                      />
                    </div>
                  </div>
                </div>

                <div className=" md:pl-5 h-full  md:h-[80%] w-full md:w-full md:-ml-20 2xl:-ml-40 relative order-1 md:order-2 mb-8 md:mb-0">
                  {/* Background gradient - Always visible but empty for inactive sections */}
                  <div
                    className={`absolute right-0 h-[350px] md:h-[450px] lg:h-[550px] w-full md:w-[450px] object-cover md:rounded-[40px] rounded-b-[40px] md:-mr-[30%] bg-white ${index % 2 === 0
                        ? "bg-gradient-to-l from-red-100 to-transparent"
                        : "bg-gradient-to-l from-violet-200 to-transparent"
                      }`}
                  ></div>

                  {item.id === "select" || item.id === "community" ? (
                    <></>
                  ) : (
                    <div className=" p-3 absolute  flex flex-row items-center gap-2 text-[12px] text-[#DA202E]">
                      <div className="w-1 h-8 ml-2 bg-gradient-to-b from-[#DA202E] to-[#3B367D] rounded-full"></div>
                      {index % 2 === 0
                        ? "*The Pricing does include the application fee"
                        : "*The Pricing does not include the application fee"}
                    </div>
                  )}

                  {/* Dynamically render badge based on card variant */}
                  <div className="absolute top-0 -right-32 md:flex items-center justify-center hidden">
                    <Image
                      src={index % 2 === 0 ? RedBadge : BlueBadge}
                      alt="badge"
                      className="relative w-[100px]"
                    />
                    <span className="absolute text-white text-[10px] text-center font-bold z-10 ">
                      {item.id === "select" && "BEST VALUE"}
                      {index === 1 && "POPULAR CHOICE"}
                      {index === 2 && "TOP PICK"}
                      {index === 3 && "HIGH DEMAND"}
                    </span>
                  </div>

                  {/* Modified: Always show content with proper opacity based on active state */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`py-2 px-2 mt-1 md:mt-3 relative space-y-1 md:space-y-3 2xl:space-y-4 ${!isActiveSection ? "opacity-70" : ""
                      }`}
                  >
                    <p
                      className={`text-[10px] leading-3 ${item.id === "connect" || item.id === "stay"
                          ? "mt-12"
                          : ""
                        } px-1 md:px-0 md:mt-10 md:text-[12px] 2xl:text-sm md:leading-relaxed font-normal relative`}
                    >
                      {item.description}
                    </p>

                    {/* First Card Pricing Tag */}
                    {item.id === "select" && (
                      <div className="bg-gradient-to-t text-center mx-auto from-[#DA202E] to-[#3B367D] px-3 py-2 rounded-lg w-[100px] md:w-[150px]">
                        <p className=" text-white text-base md:text-2xl md:font-bold">
                          ₹&#160;{item.price}
                        </p>
                      </div>
                    )}

                    {/* Modified: Always show content cards, removed shouldHideDetails condition */}
                    {item.contentCards && (
                      <div
                        className={`grid ${item.contentCards.map((content) =>
                          content.title === "Secure Support"
                            ? "grid-cols-1"
                            : "grid-cols-2 md:w-[120%]"
                        )} gap-3  md:gap-3 mb-4 md:mb-6 md:pr-0`}
                      >
                        {item.contentCards.map((card, idx) => (
                          <>
                            <ContentCard
                              key={card.id || idx}
                              {...card}
                              index={idx}
                              cardId={card.id}
                              totalCards={item.contentCards?.length || 0}
                            />
                            <MobileContentCard
                              key={`mobile-${idx}`}
                              description={card.description}
                              index={idx}
                              id={card.id}
                              tier={card.tier as string}
                              {...card}
                            />
                          </>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ReactLenis>
  );
};

export default StickyScroll;