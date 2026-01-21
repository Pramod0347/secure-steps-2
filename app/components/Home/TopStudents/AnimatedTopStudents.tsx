import React from 'react';
import { OrbitingCirclesDemo } from './OrbitCircle';
import TopStudent from './TopStudent';
import { StatsSection } from '../CircleCards/StatsSection';

const AnimatedTopStudents: React.FC = () => {
  return (
    <div className="w-screen text-center flex flex-col items-center overflow-hidden">
      {/* Heading */}
      <h2 className="text-[16px] sm:text-[20px] md:text-3xl lg:text-4xl xl:text-5xl leading-[1.3] md:leading-[1.25] font-bold px-4">
        <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block font-bold">
          STUDENTS WHO TOOK A LEAP OF FAITH WITH SECURE
        </span>
      </h2>

      {/* Subtitle */}
      <p className="text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] mt-2 md:mt-3 px-4 md:px-0 text-gray-600">
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
