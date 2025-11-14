"use client";
import React from "react";

export default function CompaniesPage() {
  const companies = [
    // TOP 2
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      alt: "Google",
      style: "top-[12%] left-[28%] rotate-2",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      alt: "Microsoft",
      style: "top-[12%] right-[25%] -rotate-2",
    },

    // BOTTOM 3
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
      alt: "Tesla",
      style: "bottom-[12%] left-[5%] rotate-1",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      alt: "Apple",
      style: "bottom-[12%] left-1/3 -translate-x-1/2",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
      alt: "Facebook",
      style: "bottom-[12%] right-[5%] -rotate-1",
    },
  ];

  return (
    <main className="relative flex flex-col items-center justify-center h-[420px] md:h-[480px] overflow-hidden">
      {/* Title */}
      <h2 className="text-base md:text-lg font-semibold text-center z-10 mb-6">
        Companies students are working in
      </h2>

      {/* Company Logos */}
      <div className="absolute inset-0 flex items-center justify-center">
        {companies.map((company, index) => (
          <div
            key={index}
            className={`absolute w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-500 ${company.style} float-anim`}
          >
            <div className="p-2 flex items-center justify-center h-full w-full">
              <img
                src={company.src}
                alt={company.alt}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .float-anim {
          animation: float 4.5s ease-in-out infinite;
        }

        .float-anim:nth-child(2) {
          animation-delay: 0.8s;
        }
        .float-anim:nth-child(3) {
          animation-delay: 1.6s;
        }
        .float-anim:nth-child(4) {
          animation-delay: 2.4s;
        }
        .float-anim:nth-child(5) {
          animation-delay: 3.2s;
        }
      `}</style>
    </main>
  );
}
