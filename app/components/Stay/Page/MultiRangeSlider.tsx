"use client";
import React, { useState, useEffect, useRef } from "react";
import "./MultiRangeSlider.css";

interface DoubleScrollBarProps {
  min: number;
  max: number;
  step: number;
  className?: string;
  onChange?: (from: number, to: number) => void;
  handleSize?: number;
  defaultStart?: number;
  defaultEnd?: number;
}

export const DoubleScrollBar: React.FC<DoubleScrollBarProps> = ({
  min,
  max,
  step,
  className,
  onChange,
  handleSize,
  defaultStart = 4600,
  defaultEnd = 12000,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [inputFrom, setInputFrom] = useState(
    defaultStart >= min && defaultStart <= max ? defaultStart : min
  );
  const [inputTo, setInputTo] = useState(
    defaultEnd >= min && defaultEnd <= max ? defaultEnd : max
  );
  const sliderRef = useRef<HTMLSpanElement | null>(null);
  const thumbFromRef = useRef<HTMLDivElement | null>(null);
  const thumbToRef = useRef<HTMLDivElement | null>(null);

  // Dynamically adjust handle size and mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Adjust default values for mobile
  useEffect(() => {
    if (isMobile) {
      // Set more compact default range for mobile
      const mobileDefaultStart = min + (max - min) * 0.3;
      const mobileDefaultEnd = min + (max - min) * 0.7;
      
      setInputFrom(mobileDefaultStart);
      setInputTo(mobileDefaultEnd);
    }
  }, [isMobile, min, max]);

  useEffect(() => {
    if (sliderRef.current === null) return;

    if (inputFrom > inputTo) {
      setInputFrom(inputTo);
    }

    if (inputTo < inputFrom) {
      setInputTo(inputFrom);
    }

    const rangeWidth = ((inputTo - inputFrom) / (max - min)) * 100;
    const leftPosition = ((inputFrom - min) / (max - min)) * 100;

    sliderRef.current.style.left = `${leftPosition}%`;
    sliderRef.current.style.width = `${rangeWidth}%`;

    if (thumbFromRef.current) {
      thumbFromRef.current.style.left = `${leftPosition}%`;
    }

    if (thumbToRef.current) {
      thumbToRef.current.style.left = `${leftPosition + rangeWidth}%`;
    }

    if (onChange) {
      onChange(inputFrom, inputTo);
    }
  }, [inputFrom, inputTo, min, max, onChange]);

  // Determine handle size based on screen size
  const dynamicHandleSize = isMobile 
    ? 16   // Smaller handle for mobile 
    : handleSize || 24;  // Default or provided handle size

  return (
    <div className={`text-[10px] md:text-[14px] rangedContainer ${className}`}>
      <div>
        <div className="range-slider">
          <span className="range-selected" ref={sliderRef}></span>
        </div>
        <div className="range-input">
          <input
            type="range"
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value > inputTo) {
                setInputFrom(inputTo);
              } else {
                setInputFrom(value);
              }
            }}
            min={min}
            max={max}
            step={step}
            value={inputFrom}
            onInput={(e) => setInputFrom(parseFloat(e.currentTarget.value))}
            style={
              { "--handle-size": `${dynamicHandleSize}px` } as React.CSSProperties
            }
          />
          <input
            type="range"
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value < inputFrom) {
                setInputTo(inputFrom);
              } else {
                setInputTo(value);
              }
            }}
            min={min}
            max={max}
            step={step}
            value={inputTo}
            onInput={(e) => setInputTo(parseFloat(e.currentTarget.value))}
            style={
              { "--handle-size": `${dynamicHandleSize}px` } as React.CSSProperties
            }
          />
          <div
            id="tooltipMin"
            className="absolute -ml-3 top-[1rem] bg-[#E50914] text-white rounded-full px-2 py-1 shadow-lg text-[10px] md:text-[14px]"
            style={{ left: "0%" }}
            ref={thumbFromRef}
          >
            $ {inputFrom}
          </div>
          <div
            id="tooltipMax"
            className="absolute -ml-3 top-[1rem] bg-[#E50914] text-white rounded-full px-2 py-1 shadow-lg text-[10px] md:text-[14px]"
            style={{ left: "100%" }}
            ref={thumbToRef}
          >
            $ {inputTo}
          </div>
        </div>
      </div>
    </div>
  );
};