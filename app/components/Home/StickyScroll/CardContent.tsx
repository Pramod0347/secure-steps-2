"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import RedBadge from "@/app/assets/Home/red_badge.svg";
import BlueBadge from "@/app/assets/Home/blue_badge.svg";
import ContentCard from "./ContentCard";
import MobileContentCard from "./MobileContentCard";

interface CardContentProps {
  item: any;
  isActive: boolean;
  index: number;
}

const CardContent = ({ item, isActive, index }: CardContentProps) => {
  return (
<motion.div
  className="bg-white rounded-[40px] h-[90vh] w-full grid grid-cols-1 md:grid-cols-2 relative overflow-hidden p-4 md:p-10"
  initial={{ opacity: 0, y: 100 }}
  animate={{
    opacity: isActive ? 1 : 0.3,
    y: isActive ? 0 : 80
  }}
  transition={{
    duration: 0.6,
    ease: "easeOut"
  }}
>

      {/* LEFT — IMAGE */}
      <div className="flex items-center justify-center">
        <Image
          src={item.image}
          alt={item.id}
          width={500}
          height={600}
          className="rounded-[35px] object-cover h-[450px] md:h-[550px]"
        />
      </div>

      {/* RIGHT — CONTENT */}
      <div className="relative w-full md:pl-6 flex flex-col">
        <p className="mt-6 md:mt-12 text-[12px] md:text-[14px] leading-relaxed">
          {item.description}
        </p>

        {item.id === "select" && (
          <div className="bg-gradient-to-t from-[#DA202E] to-[#3B367D] px-3 py-2 rounded-lg w-[120px] mt-3">
            <p className="text-center text-white text-xl font-bold">
              ₹{item.price}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
          {item.contentCards?.map((card: any, idx: number) => (
            <>
              <ContentCard key={idx} {...card} index={idx} />
              <MobileContentCard key={`m-${idx}`} {...card} index={idx} />
            </>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CardContent;
