"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import StickyScrollData from "./StickyScrollData";
import HorizontalScrollingText from "../../ui/horizontalscrolling";
import RedBadge from "@/app/assets/Home/red_badge.svg";
import BlueBadge from "@/app/assets/Home/blue_badge.svg";

const StickyScroll = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Desktop Content Card
  function ContentCard({
    title,
    description,
    variant,
    price,
    features,
    feature2,
  }: {
    title: string;
    description?: string;
    variant: "blue" | "red";
    price?: string;
    features?: { text: string }[];
    feature2?: { text: string }[];
  }) {
    return (
      <div
        className={`w-full overflow-hidden hidden md:flex flex-col rounded-2xl ${
          variant === "blue"
            ? "bg-gradient-to-br from-[#5D4A9C] to-[#DA202E]"
            : "bg-gradient-to-br from-[#DA202E] to-[#5D4A9C]"
        } p-4 lg:p-5`}
      >
        <h3 className="font-semibold text-white text-sm lg:text-base">
          {title}
        </h3>
        {description && (
          <p className="text-[10px] lg:text-xs text-white/80 mt-1 leading-relaxed">
            {description}
          </p>
        )}
        {price && (
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-lg font-bold text-white">₹</span>
            <span className="text-2xl lg:text-3xl font-bold text-white">{price}</span>
          </div>
        )}
        {(features || feature2) && (
          <div className="flex gap-4 mt-3">
            {features && (
              <div className="space-y-1.5">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[10px] lg:text-xs text-white">{feature.text}</span>
                  </div>
                ))}
              </div>
            )}
            {feature2 && (
              <div className="space-y-1.5">
                {feature2.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[10px] lg:text-xs text-white">{feature.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Mobile Content Card
  const MobileContentCard = ({
    title,
    description,
    price,
    variant,
    features,
    feature2,
    tier,
  }: {
    title: string;
    description?: string;
    variant: string;
    features?: { text: string }[];
    feature2?: { text: string }[];
    price?: string;
    tier?: string;
  }) => {
    return (
      <div className="block md:hidden rounded-xl overflow-hidden shadow-sm">
        <div
          className={`${
            variant === "blue"
              ? "bg-gradient-to-br from-[#5D4A9C] to-[#DA202E]"
              : "bg-gradient-to-br from-[#DA202E] to-[#5D4A9C]"
          } px-3 py-3`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] font-semibold text-white">{title}</p>
              {tier && <p className="text-[10px] text-white/80 mt-0.5">{tier}</p>}
            </div>
            {price && (
              <p className="text-xs text-white font-medium">₹{price}</p>
            )}
          </div>
          {description && (
            <p className="text-[10px] text-white/80 mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
          {(features || feature2) && (
            <div className="flex gap-3 mt-2">
              {features && (
                <div className="space-y-1.5">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-[9px] text-white">{feature.text}</span>
                    </div>
                  ))}
                </div>
              )}
              {feature2 && (
                <div className="space-y-1.5">
                  {feature2.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-[9px] text-white">{feature.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col items-center justify-center w-full py-6 md:py-10 gap-3 md:gap-4 px-4">
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight font-extrabold text-center uppercase">
          <HorizontalScrollingText text="PRICING DESIGNED FOR AFFORDABILITY" />
        </div>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-center leading-relaxed max-w-2xl text-gray-600">
          We are offering an end-to-end solution that will help you secure
          success through every step of your journey.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="space-y-4 md:space-y-6 pb-6 md:pb-10">
        {StickyScrollData.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={item.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full px-4 md:px-6 lg:px-8"
            >
              <div
                className={`relative mx-auto max-w-6xl rounded-2xl md:rounded-3xl overflow-hidden ${
                  isEven ? "bg-gradient-to-br from-white to-red-50/70" : "bg-gradient-to-br from-white to-violet-50/70"
                } shadow-lg`}
              >
                {/* Badge - positioned on the card, not the content */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
                  <div className="relative">
                    <Image
                      src={isEven ? RedBadge : BlueBadge}
                      alt="badge"
                      className="w-14 md:w-16 lg:w-20"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[6px] md:text-[7px] lg:text-[8px] text-center font-bold px-1">
                      {item.id === "select" && "BEST VALUE"}
                      {index === 1 && "POPULAR CHOICE"}
                      {index === 2 && "TOP PICK"}
                      {index === 3 && "HIGH DEMAND"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image Section */}
                  <div className={`relative ${!isEven ? "md:order-2" : ""}`}>
                    <div className="p-3 md:p-5 lg:p-6">
                      <div className="aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/5] relative rounded-xl md:rounded-2xl overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.id}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`relative p-4 md:p-5 lg:p-6 flex flex-col justify-center ${!isEven ? "md:order-1" : ""}`}>
                    {/* Pricing Note */}
                    {item.id !== "select" && item.id !== "community" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-0.5 h-5 bg-gradient-to-b from-[#DA202E] to-[#3B367D] rounded-full"></div>
                        <p className="text-[9px] md:text-[10px] text-[#DA202E]">
                          {isEven
                            ? "*Pricing includes application fee"
                            : "*Pricing excludes application fee"}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-[11px] md:text-xs lg:text-sm text-gray-600 leading-relaxed mb-3 pr-14 md:pr-16">
                      {item.description}
                    </p>

                    {/* Price Tag for Select */}
                    {item.id === "select" && item.price && (
                      <div className="inline-block bg-gradient-to-r from-[#3B367D] to-[#DA202E] px-4 py-1.5 rounded-lg mb-3 w-fit">
                        <p className="text-white text-base md:text-lg lg:text-xl font-bold">
                          ₹ {item.price}
                        </p>
                      </div>
                    )}

                    {/* Content Cards */}
                    {item.contentCards && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.contentCards.map((card, idx) => (
                          <React.Fragment key={card.id || idx}>
                            <ContentCard {...card} />
                            <MobileContentCard
                              title={card.title}
                              description={card.description}
                              variant={card.variant}
                              price={card.price}
                              features={card.features}
                              feature2={card.feature2}
                              tier={card.tier}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StickyScroll;
