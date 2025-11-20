"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  text: string;
}

interface ContentCardProps {
  cardId?: string;
  title: string;
  description?: string;
  variant: "blue" | "red";
  index: number;
  tier?: string;
  price?: string;
  features?: Feature[];
  feature2?: Feature[];
  isActive?: boolean;
}

export default function ContentCard({
  cardId,
  title,
  description,
  variant,
  index,
  tier,
  price,
  features,
  feature2,
  isActive,
}: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 120 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`hidden md:block w-full rounded-2xl overflow-hidden p-6
        ${variant === "blue"
          ? "bg-gradient-to-b from-[#5D4A9C] to-[#DA202E]"
          : "bg-gradient-to-b from-[#DA202E] to-[#5D4A9C]"}
      `}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/90">{description}</p>
        {tier && <p className="text-sm text-white/80">{tier}</p>}
      </div>

      {price && (
        <div className="flex items-baseline gap-1 mt-3">
          <span className="text-3xl font-bold text-white">₹</span>
          <span className="text-4xl font-bold text-white">{price}</span>
        </div>
      )}

      <div className="flex gap-6 mt-4">
        {/* Feature Column 1 */}
        {features && (
          <div className="space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-white">{feature.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Feature Column 2 */}
        {feature2 && (
          <div className="space-y-3">
            {feature2.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-white">{feature.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
