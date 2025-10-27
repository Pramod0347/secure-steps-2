/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import work from "@/app/assets/workspace.png";
import parking from "@/app/assets/parkingarea.png";
import wifi from "@/app/assets/wifi.png";
import flash from "@/app/assets/flash.png";
import dumbble from "@/app/assets/dumbell.png";
import dots from "@/app/assets/dots.png";

interface FeaturesProps {
  amenities: string[];
}

const Features: React.FC<FeaturesProps> = ({ amenities }) => {
  // Map API amenity strings to our icon assets and display names
  const amenityConfig: { [key: string]: { icon: any; displayName: string } } = {
    "Private Workspace": { icon: work, displayName: "Private Workspace" },
    "Parking": { icon: parking, displayName: "Parking Area" },
    "WiFi": { icon: wifi, displayName: "High-Speed Wi-Fi" },
    "Power Backup": { icon: flash, displayName: "Power Backup" },
    "Gym": { icon: dumbble, displayName: "Gym and Fitness" },
  };

  // Transform amenities into display data
  const displayAmenities = amenities.map(amenity => {
    const config = amenityConfig[amenity] || { icon: dots, displayName: amenity };
    return {
      title: config.displayName,
      img: config.icon,
    };
  });

  // If we have less than 6 items, add "Other Service" to maintain grid layout
  while (displayAmenities.length < 6) {
    displayAmenities.push({
      title: "Other Service",
      img: dots,
    });
  }

  // Take only the first 6 items to match the original layout
  const displayItems = displayAmenities.slice(0, 6);

  return (
    <div className="flex md:flex-row flex-col items-center w-screen justify-between px-4 md:px-28 jakartha">
      <div className="flex flex-col gap-4 md:gap-8">
        <h1 className="md:text-[40px] font-semibold text-[32px] leading-[44px] md:leading-[50px]">
          We do our <span className="text-[#E50914]">Best</span> <br />{" "}
          facilities provide you
        </h1>
        <h2 className="text-[#797A7B] text-xs md:text-[16px]">
          Enjoy top-notch amenities that make your <br /> stay comfortable and
          convenient.
        </h2>
        <button className="px-4 py-3 md:scale-100 scale-90 hover:shadow-xl float-left rounded-full bg-[#1B1B1B] text-white">
          Contact Now
        </button>
      </div>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 md:mt-0 mt-10 gap-4 justify-center">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="border hover:shadow-xl rounded-lg cursor-pointer md:px-10 md:py-16 p-10 flex flex-col items-center gap-2"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={40}
                height={40}
                className="md:w-10 w-[24px]"
              />
              <h1 className="text-[#1B1B1B] whitespace-nowrap text-[12px] md:text-[18px] md:font-semibold">
                {item.title}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;