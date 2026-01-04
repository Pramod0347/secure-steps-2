"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StatCircleProps {
  number: string;
  label: string;
}

export function StatCircle({ number, label }: StatCircleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-2 mt-6 md:mt-10 mb-4 md:mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative cursor-pointer text-center w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] xl:w-[200px] xl:h-[200px] flex flex-col items-center justify-center rounded-full transition-shadow duration-200",
          isHovered
            ? "shadow-lg border border-red-500"
            : "shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)]"
        )}
      >
        <span className="text-[10px] sm:text-[12px] md:text-[28px] lg:text-[36px] xl:text-[44px] font-semibold">{number}</span>
      <span className="text-[7px] sm:text-[9px] md:text-[12px] lg:text-[14px] xl:text-[16px] px-1">{label}</span>
      </div>
    </div>
  );
}