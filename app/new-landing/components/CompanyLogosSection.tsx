"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

const R2_BASE = "https://pub-1ed7e98a27564218aec0343ef05fbd57.r2.dev";

const CompanyLogosSection = () => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const universities = [
    { name: "SKEMA Business School", short: "SKEMA", color: "from-blue-600 to-blue-800", logo: `${R2_BASE}/skema_business_school_logo.png` },
    { name: "UCL", short: "UCL", color: "from-purple-600 to-purple-800", logo: `${R2_BASE}/ucl_logo.png` },
    { name: "NYIT", short: "NYIT", color: "from-blue-500 to-indigo-700", logo: `${R2_BASE}/nyit_logo.png` },
    { name: "Warwick Business School", short: "Warwick", color: "from-purple-700 to-purple-900", logo: `${R2_BASE}/warwick_logo.png` },
    { name: "Toronto Metropolitan University", short: "TMU", color: "from-blue-600 to-blue-900", logo: `${R2_BASE}/tmu_logo.png` },
    { name: "Monash University", short: "Monash", color: "from-gray-700 to-gray-900", logo: `${R2_BASE}/monash_university.png` },
    { name: "James Cook University", short: "JCU", color: "from-yellow-500 to-yellow-700", logo: `${R2_BASE}/james_cook.png` },
    { name: "SP Jain", short: "SP Jain", color: "from-red-600 to-red-800", logo: `${R2_BASE}/sp_jain.png` },
    { name: "Johns Hopkins University", short: "Johns Hopkins", color: "from-blue-700 to-blue-900", logo: `${R2_BASE}/johns_hopkins.png` },
    { name: "Queen Mary University of London", short: "QMUL", color: "from-red-700 to-red-900", logo: `${R2_BASE}/qmul_logo.png` },
    { name: "Kings College London", short: "KCL", color: "from-red-600 to-red-800", logo: `${R2_BASE}/hku_kings_logo.png` },
    { name: "Heriot-Watt University", short: "Heriot Watt", color: "from-blue-800 to-indigo-900", logo: `${R2_BASE}/heriot_watt_university_logo.png` },
  ];

  return (
    <>
      {/* Universities Marquee Section */}
      <section className="brand-section-bg py-10 sm:py-16 border-y border-gray-100 bg-transparent overflow-hidden">
        <div className="w-full">
          <div className="text-center mb-6 sm:mb-10 px-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm">
              <Building2 className="w-4 h-4 text-purple-500" />
              Our University Network
            </span>
            <p className="mt-3 max-w-xl mx-auto text-center text-gray-700 text-base sm:text-lg font-semibold leading-snug px-3 sm:px-0">
              Some renowned universities where Secure students study
            </p>
          </div>

          {/* Marquee Container */}
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10" />
            
            <div className="flex animate-marquee whitespace-nowrap">
              {[...universities, ...universities].map((uni, index) => (
                <div
                  key={index}
                  className="inline-flex items-center justify-center mx-3 sm:mx-4 w-24 h-14 sm:w-28 sm:h-16 rounded-xl bg-gray-50 border border-gray-200 transition-colors flex-shrink-0"
                  title={uni.name}
                  aria-label={uni.name}
                >
                  {uni.logo && !imgErrors[`${uni.short}-${index}`] ? (
                    <div className="w-20 h-10 sm:w-24 sm:h-12 rounded-md overflow-hidden flex-shrink-0 relative bg-white">
                      <Image
                        src={uni.logo}
                        alt={uni.name}
                        fill
                        className="object-contain p-0.5"
                        onError={() => setImgErrors(prev => ({ ...prev, [`${uni.short}-${index}`]: true }))}
                      />
                    </div>
                  ) : (
                    <div className={`w-20 h-10 sm:w-24 sm:h-12 rounded-md bg-gradient-to-br ${uni.color} flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0`}>
                      {uni.short.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CompanyLogosSection;
