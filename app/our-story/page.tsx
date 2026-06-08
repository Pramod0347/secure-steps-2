import React from "react";
import AboutSection from "@/app/new-landing/components/AboutSection";

export const metadata = {
  title: "Our Story - Secure Steps",
  description: "Learn more about the founders of Secure Steps and our mission to simplify career design.",
};

export default function OurStoryPage() {
  return (
    <div className="w-full pt-20 sm:pt-28 md:pt-32 pb-12 bg-white">
      <AboutSection flat={true} />
    </div>
  );
}
