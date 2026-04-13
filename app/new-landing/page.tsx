'use client'

import React from "react";
import Cards from "@/app/components/Home/Cards/Cards";
import Test from "@/app/components/Home/Test";
import Hero from "@/app/components/Home/Hero";
import StickyScroll from "@/app/components/Home/StickyScroll/StickyScroll";
import CourseList from "@/app/components/Home/CourseShowcase/CourseList";
import AnimatedTopStudents from "@/app/components/Home/TopStudents/AnimatedTopStudents";
import InfiniteLogoCarousel from "@/app/components/Home/InfiniteScrollUniv";
import FAQ from "@/app/components/Home/FAQ/faq-section";

const NewLandingPage: React.FC = () => {
  return (
    <>
      <div className="w-screen flex flex-col items-center justify-center overflow-x-hidden gap-4 md:gap-10 lg:gap-14">
        <Hero />
        <Cards />
        <CourseList />
        <StickyScroll />
        <AnimatedTopStudents />
        <InfiniteLogoCarousel speed={30} gap={40} height={100} />
        <Test />
        <FAQ />
      </div>
    </>
  );
};

export default NewLandingPage;
