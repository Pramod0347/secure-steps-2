import React from 'react'
import { OrbitingCirclesDemo } from './OrbitCircle';
import TopStudent from './TopStudent';
import { StatsSection } from '../CircleCards/StatsSection';

const AnimatedTopStudents: React.FC = () => {
  return (
    <div className='w-screen text-center'>
      <h2 className="text-[20px] leading-[25.2px] md:text-5xl font-bold uppercase px-2">
        <span className='bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block'>
          Students&#160;
        </span>
        who took a leap of faith with
        <span className='bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block'>
        &#160;secure
        </span>
      </h2>
      <p className='text-[12px] px-6 md:px-0 md:text-[16px]'>(Now with clarity in their favourite university/country/career path)</p>
      <StatsSection />
      <OrbitingCirclesDemo />
      <TopStudent />
    </div>
  )
}

export default AnimatedTopStudents;