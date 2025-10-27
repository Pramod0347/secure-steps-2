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
      className="flex flex-col items-center gap-2  w-screen mt-32 mb-10 md:mb-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative cursor-pointer text-center w-[80px] h-[80px] md:w-[200px] md:h-[200px] flex flex-col items-center justify-center rounded-full transition-shadow duration-200",
          isHovered
            ? "shadow-lg border border-red-500"
            : "shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)]"
        )}
      >
        <span className="md:text-[44px] text-[12px] font-semibold">{number}</span>
      <span className="text-[10px] px-1 md:text-[16px]">{label}</span>
      </div>
    </div>
  );
}