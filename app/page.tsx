'use client'

import React from "react";
import Cards from "@/app/components/Home/Cards/Cards";
// import WhyUs from "@/app/components/Home/WhyUs";
import StudyAb from "@/app/components/Home/StudyAb";
import Test from "@/app/components/Home/Test";
import Hero from "@/app/components/Home/Hero";
import StickyScroll from "./components/Home/StickyScroll/StickyScroll";
// import ScrollAnimation from "./components/Home/ScrollAnimation";
import CourseList from "./components/Home/CourseShowcase/CourseList";
import TrustedPartnersCarousel from "./components/Home/TrustedPartners";
import AnimatedTopStudents from "./components/Home/TopStudents/AnimatedTopStudents";
import { StatsSection } from "./components/Home/CircleCards/StatsSection";
// import NewHero from "./components/Home/NewHero";
import InfiniteLogoCarousel from "./components/Home/InfiniteScrollUniv";
import FAQ from "./components/Home/FAQ/faq-section";

const Page: React.FC = () => {
  return (
    <>
      <div className="w-screen flex flex-col items-center justify-center overflow-x-hidden gap-4 md:gap-10 lg:gap-14">

        <Hero />
        {/* <NewHero /> */}
        <Cards />
        {/* <WhyUs /> */}
        <CourseList />
        <StickyScroll />
        {/* <ScrollAnimation/> */}
        {/* <StudyAb /> */}
        <AnimatedTopStudents />
        {/* <TrustedPartnersCarousel/> */}
        <InfiniteLogoCarousel speed={30} gap={40} height={100} />
        <Test />
        <FAQ/>
        {/* test */}
      </div>
    </>
  );
  
};

export default Page;
