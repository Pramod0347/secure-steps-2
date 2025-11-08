import React from 'react';
import { OrbitingCirclesDemo } from './OrbitCircle';
import TopStudent from './TopStudent';
import { StatsSection } from '../CircleCards/StatsSection';

const AnimatedTopStudents: React.FC = () => {
  return (
    <div className="w-screen text-center flex flex-col items-center overflow-hidden">
      {/* Heading */}
      <h2 className="text-[18px] leading-[22px] md:text-5xl md:leading-[60px] font-bold uppercase mt-4 md:mt-10">
        <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block">
          Students&#160;
        </span>
        who took a leap of faith with
        <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block">
          &#160;secure
        </span>
      </h2>

      {/* Subtitle */}
      <p className="text-[12px] md:text-[16px] mt-1 md:mt-3 px-6 md:px-0">
        (Now with clarity in their favourite university/country/career path)
      </p>

      {/* Stats Section */}
      <div className="mt-4 md:mt-8 w-full flex justify-center">
        <StatsSection />
      </div>

      {/* Orbit Animation */}
      <div className="mt-4 md:mt-12 w-full flex justify-center">
        <OrbitingCirclesDemo />
      </div>

      {/* Top Students */}
      <div className="mt-4 md:mt-16 mb-6 md:mb-12 w-full flex justify-center">
        <TopStudent />
      </div>
    </div>
  );
};

export default AnimatedTopStudents;
