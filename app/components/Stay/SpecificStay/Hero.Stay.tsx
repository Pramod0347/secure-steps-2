import React from "react";
// import StayBanner from "@/app/assets/HouseBanner.png";
import { Accommodation } from "@prisma/client";



// Hero Component
const Hero: React.FC<{ accommodation: Accommodation }> = ({ accommodation }) => {
  return (
    <div
      className="relative h-screen jakartha w-screen bg-cover flex items-end md:pb-0 pb-24 md:items-center bg-center text-white"
      style={{ backgroundImage: `url(${accommodation.banner})` }}
    >
      <div className="flex flex-col px-6 md:px-32 gap-20 md:mt-28">
        <div className="h-full flex-col gap-4 flex">
          <h1 className="md:text-[100px] font-bold text-[54px] leading-[64px] md:leading-[126px]">
            {accommodation.title.split(' ').map((word, index) => (
              <React.Fragment key={index}>
                {word}<br />
              </React.Fragment>
            ))}
          </h1>
        </div>

        <div className="text-xs md:text-[15px] font-semibold text-center flex tracking-wide gap-2 md:gap-4 absolute bottom-10 md:right-12">
          <p className="w-20 cursor-pointer hover:scale-105 transition-all border rounded-full border-[#4342428e] bg-black/20 backdrop-blur-sm py-3 md:w-32">
            {accommodation.bedrooms} {accommodation.bedrooms === 1 ? 'Bed' : 'Beds'}
          </p>
          <p className="w-20 cursor-pointer hover:scale-105 transition-all border rounded-full border-[#4342428e] bg-black/20 backdrop-blur-sm py-3 md:w-32">
            {accommodation.bedrooms * 2} Guests
          </p>
          <p className="w-20 cursor-pointer hover:scale-105 transition-all border rounded-full border-[#4342428e] bg-black/20 backdrop-blur-sm py-3 md:w-32">
            {accommodation.bathrooms} {accommodation.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;