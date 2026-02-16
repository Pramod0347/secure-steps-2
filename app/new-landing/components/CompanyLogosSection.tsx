"use client";

import React from "react";

const CompanyLogosSection = () => {
  const companies = [
    "Google",
    "Microsoft",
    "Apple",
    "Amazon",
    "Meta",
    "Netflix",
  ];

  return (
    <section className="py-10 sm:py-16 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-400 text-xs sm:text-sm mb-6 sm:mb-10 tracking-wider">
          Adopted by renowned enterprises such as
        </p>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-6 sm:mx-12 flex items-center justify-center"
              >
                <div className="text-lg sm:text-2xl font-bold text-gray-300 hover:text-gray-500 transition-colors cursor-pointer">
                  {company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogosSection;
