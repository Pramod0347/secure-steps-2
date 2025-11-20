import React from 'react';
import { OrbitingCirclesDemo } from './OrbitCircle';
import TopStudent from './TopStudent';
import { StatsSection } from '../CircleCards/StatsSection';

const AnimatedTopStudents: React.FC = () => {
  return (
    <div className="w-screen text-center flex flex-col items-center overflow-hidden ">
      {/* Heading */}
      <h2 className="text-[18px] leading-[22px] md:text-5xl md:leading-[60px] font-bold  ">
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
      <div className=" w-full flex justify-center">
        <StatsSection />
      </div>

      {/* Orbit Animation */}
      <div className=" w-full flex justify-center">
        <OrbitingCirclesDemo />
      </div>

    
        <TopStudent />
    
    </div>
  );
};

export default AnimatedTopStudents;
