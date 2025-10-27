import React from "react";
import Image from "next/image";
import { Accommodation } from "@prisma/client";
// import StayBanner from "@/app/assets/HouseBanner.png";
// import three from "@/app/assets/3.png";
// import four from "@/app/assets/4.png";
// import five from "@/app/assets/5.png";
// import six from "@/app/assets/6.png";


// Details Component
const Detail: React.FC<{ accommodation: Accommodation }> = ({ accommodation }) => {
  return (
    <div className="flex flex-col md:px-20 gap-10 py-20 jakartha items-center justify-center">
      <div className="flex gap-4 items-center justify-center">
        {accommodation.images.slice(0, 4).map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Accommodation Image ${index + 1}`}
            width={300}
            height={224}
            className="rounded-md w-full h-24 md:h-56"
          />
        ))}
      </div>
      <h1 className="text-center md:text-base px-2 md:px-0 text-[10px] md:w-1/2">
        {accommodation.description}
      </h1>
    </div>
  );
};


export default Detail;

