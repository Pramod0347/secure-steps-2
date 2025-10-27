import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radiusX?: number;
  radiusY?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
  shape?: "circle" | "ellipse";
  verticalStretch?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radiusX = 160,
  radiusY,
  path = true,
  iconSize = 30,
  speed = 1,
  shape = "ellipse",
  verticalStretch = 1,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const effectiveRadiusY = radiusY ?? (shape === "ellipse" ? radiusX * verticalStretch : radiusX);

  // Updated keyframes to ensure emojis stay on the path
  const orbitKeyframes = useMemo(() => {
    return `
      @keyframes orbit {
        0% {
          transform: rotate(0deg) translateX(${radiusX}px) rotate(0deg);
        }
        100% {
          transform: rotate(360deg) translateX(${radiusX}px) rotate(-360deg);
        }
      }
    `;
  }, [radiusX]);

  return (
    <div className="w-full overflow-hidden">
      <div
        className={cn("relative mx-auto transform-gpu", className)}
        style={{
          width: `${radiusX * 2}px`,
          height: `${effectiveRadiusY * 2}px`,
          transform: shape === "ellipse" ? `scaleY(${verticalStretch})` : undefined,
          maxWidth: "100vw",
          transformOrigin: "center center",
        }}
        {...props}
      >
        {path && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            className="pointer-events-none absolute z-[99999] inset-0 size-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <ellipse
              className="stroke-black/10 stroke-2 dark:stroke-white/10"
              cx="50%"
              cy="50%"
              rx={radiusX}
              ry={shape === "ellipse" ? radiusX : effectiveRadiusY}
              fill="none"
            />
          </svg>
        )}
        <style>{orbitKeyframes}</style>
        {React.Children.map(children, (child, index) => {
          
          return (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: iconSize,
                height: iconSize,
                animation: `orbit ${calculatedDuration}s linear ${
                  reverse ? "reverse" : "normal"
                } infinite`,
                animationDelay: `${
                  -calculatedDuration * (index / React.Children.count(children))
                }s`,
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}