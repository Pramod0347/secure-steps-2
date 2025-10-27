'use client'
import React from "react";
import Hero from "../components/community/Hero";
// import CommunityContent from "../components/community/CommunityContent";
import ComingSoon from "@/components/ui/comingsoon";
import BlogList from "../components/community/Blog/BlogList";
const page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Hero />
      {/* <CommunityContent /> */}
      {/* <ComingSoon/> */}
      <BlogList/>
    </div>
  );
};

export default page;
