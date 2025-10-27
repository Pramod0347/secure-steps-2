import React from 'react'
import Hero from '@/app/components/Stay/Page/Hero'
import Results from '@/app/components/Stay/Page/Results'
import ComingSoon from '@/components/ui/comingsoon';
import PropertiesPage from '../components/Stay/Demo/Stay';

const page = () => {
  return (
    <div className="   w-full flex flex-col items-center justify-center">
      <Hero />
      {/* <Results /> */}
      {/* <ComingSoon/> */}
      <PropertiesPage/>
    </div>
  )
}

export default page;