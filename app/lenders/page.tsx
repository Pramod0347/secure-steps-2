'use client'

import React, { useState } from 'react'
import Hero from "@/app/components/Lenders/Hero";
import ComingSoon from '@/components/ui/comingsoon';
// import LenderBody from '../components/Lenders/page/LenderBody';

const Page = () => {
    const [activeSection, setActiveSection] = useState<'loans' | 'articles'>('loans');
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden">

      <Hero />
      {/* <LenderBody 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      /> */}
      <ComingSoon/>

    </div>
  )
}

export default Page