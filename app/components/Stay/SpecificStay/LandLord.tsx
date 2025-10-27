import React from "react";
import Image from "next/image";
import leftqoute from "@/app/assets/leftqoute.png";
import rightqoute from "@/app/assets/rightqoute.png";
import allu from "@/app/assets/Allu.png";
import type { Landlord } from "./type";



// Landlord Component (renamed from Alumni)
const LandlordComponent: React.FC<{ landlord: Landlord }> = ({ landlord }) => {
  return (
    <div className="w-screen">
      <div className="bg-[#FAFAFA] md:pb-0 pb-6 relative flex-col-reverse md:flex-row flex w-[90%] md:w-[85%] mt-40 rounded-2xl mx-auto items-center justify-between">
        <div className="flex items-center w-full justify-center">
          <div className="flex flex-col md:items-start gap-8 md:mt-0 mt-10">
            <div className="flex gap-2 md:px-0 px-2">
              <Image src={leftqoute} alt="Left Quote" width={24} height={24} className="h-fit md:w-6 w-[16px]" />
              <h1 className="md:text-2xl text-sm text-[#57595A] font-sans">
                RentBro made it so easy to find a great place! The filters{" "}
                <br className="hidden md:block" /> and verified listings saved me a lot of time.
              </h1>
              <Image src={rightqoute} alt="Right Quote" width={24} height={24} className="h-fit w-[16px] mt-12 md:mt-10 md:w-6" />
            </div>

            <div className="flex ml-8 md:flex-row flex-col items-center justify-between gap-4 md:gap-14">
              <div className="md:text-left text-center">
                <h1 className="font-semibold text-[16px] md:text-2xl text-[#1C1C1C]">
                  {landlord.name}
                </h1>
                <h4 className="text-[#57595A] md:text-base text-[12px]">
                  {landlord.isLandlordVerified ? 'Verified Landlord' : 'Landlord'}
                </h4>
              </div>
              <div className="flex md:gap-14 gap-4 text-center">
                <div className="bg-black text-white md:text-base text-xs rounded-full flex items-center px-6 md:px-10 py-2.5 md:py-3">
                  Message
                </div>
                <div className="bg-black text-white md:text-base text-xs whitespace-nowrap flex items-center rounded-full px-6 md:px-10 py-2.5 md:py-3">
                  View Profile
                </div>
              </div>
            </div>
          </div>
        </div>
        <Image
          src={landlord.avatarUrl || allu}
          alt="Landlord"
          width={400}
          height={400}
          className="md:w-1/4 md:rounded-none rounded-[16px] w-full"
        />
      </div>
    </div>
  );
};


export default LandlordComponent;