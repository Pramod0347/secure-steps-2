import React from 'react'
import Script from 'next/script'
import Hero from '@/app/components/Stay/Page/Hero'
import PropertiesPage from '../components/Stay/Demo/Stay';

const page = () => {
  return (
    <div className="   w-full flex flex-col items-center justify-center">
      <div
        id="root-ul"
        className='mt-20'
        data-widgetId="69e87c9494665da59163183f"
        data-city="london"
        data-primaryColor="#111"
        data-fontColor="#333"
        data-iconColor="#111"
      />
      <Script src="https://d3hk5c2fo9op52.cloudfront.net/widget.js" strategy="afterInteractive" />
      {/* <Hero />
      {/* <Results /> */}
      {/* <ComingSoon/> */}
      {/* <PropertiesPage/> */}
    </div>
  )
}

export default page;
