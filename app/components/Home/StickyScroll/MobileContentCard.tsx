"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  text: string;
}

interface MobileContentCardProps {
  title: string;
  description?: string;
  variant: string;
  price?: string;
  tier?: string;
  features?: Feature[];
  feature2?: Feature[];
  isActive?: boolean;
}

export default function MobileContentCard({
  title,
  description,
  price,
  variant,
  tier,
  features,
  feature2,
  isActive,
}: MobileContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 120 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="md:hidden rounded-lg border border-gray-200 shadow-sm p-2 my-1"
    >
      <div
        className={`rounded-lg p-3 ${variant === "blue"
          ? "bg-gradient-to-b from-[#5D4A9C] to-[#DA202E]"
          : "bg-gradient-to-b from-[#DA202E] to-[#5D4A9C]"
          }`}
      >
        <div className="flex justify-between text-white">
          <div>
            <p className="text-xs font-bold">{title}</p>
            {tier && <p className="text-[10px] text-white/90">{tier}</p>}
          </div>
          {price && <p className="text-xs font-bold">₹{price}</p>}
        </div>

        <p className="text-[10px] text-white mt-1">{description}</p>

        <div className="flex gap-4 mt-2">
          {/* Column 1 */}
          {features && (
            <div className="space-y-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-white/10 rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-[9px] text-white">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Column 2 */}
          {feature2 && (
            <div className="space-y-2">
              {feature2.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-white/10 rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-[9px] text-white">{feature.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
