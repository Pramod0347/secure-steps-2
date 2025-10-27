import React from 'react';
import Image from 'next/image';
import { FaGlobe } from 'react-icons/fa';
import { IoIosArrowDropleftCircle as LeftArrowIcon } from "react-icons/io";
import { IoIosArrowDropright as RightArrowIcon } from "react-icons/io";
import { FaArrowRight as RightArrowIcon2 } from "react-icons/fa";
import { GoDotFill as DarkDotIcon } from "react-icons/go";
import { GoDot as LightDotIcon } from "react-icons/go";

const cardData = [
  {
    id: 1,
    name: "Sandeep",
    followers: "10k followers",
    time: "1d",
    description:
      "How about adding some information about this post here, eh? Maybe a nice SEO-optimized caption? Get your social media manager onboard!",
    profile: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
    caption: "This is where your article's caption goes. Check it out!",
    link: "ourarticle.io",
  },
  {
    id: 2,
    name: "Sandeep",
    followers: "10k followers",
    time: "1d",
    description:
      "How about adding some information about this post here, eh? Maybe a nice SEO-optimized caption? Get your social media manager onboard!",
    profile: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    caption: "This is where your article's caption goes. Check it out!",
    link: "ourarticle.io",
  },
  {
    id: 3,
    name: "Sandeep",
    followers: "10k followers",
    time: "1d",
    description:
      "How about adding some information about this post here, eh? Maybe a nice SEO-optimized caption? Get your social media manager onboard!",
    profile: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    caption: "This is where your article's caption goes. Check it out!",
    link: "ourarticle.io",
  },
];

const ActivityCards = () => {
  return (
    <div className="mx-auto md:px-4 px-2 py-2 w-screen jakartha">
      <div className="flex flex-row md:items-center text-start justify-start md:justify-between mb-6">
        <h2 className="md:text-[33px] text-[24px] font-semibold px-20">Activity</h2>
        <div className="md:flex flex-row items-center hidden mr-[5%]">
          <LeftArrowIcon className="w-[30px] h-[30px] text-gray-300 cursor-pointer" />
          <RightArrowIcon className="w-[30px] h-[30px] text-gray-400 cursor-pointer" />
        </div>
      </div>

      <div className="md:flex grid md:grid-cols-3 md:gap-0 gap-4 grid-cols-2 md:w-[90%] justify-between mx-auto scrollbar-hide ">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="md:w-[30%] border cursor-pointer bg-white hover:shadow-lg rounded-lg flex-shrink-0"
          >
            <div className="flex items-center p-3">
              <Image 
                src={card.profile}
                alt="User Avatar"
                className="md:w-[49px] w-[40px] md:h-[49px] mr-3"
                width={49}
                height={49}
              />
              <div>
                <p className="font-semibold text-xs md:text-[14px]">{card.name}</p>
                <p className="md:text-[13px] text-[10px] text-gray-500">{card.followers}</p>
                <div className="md:text-[12px] text-[10px] text-gray-500 flex items-center">
                  <p>{card.time}</p>
                  <FaGlobe className="ml-2 text-gray-400" />
                </div>
              </div>
            </div>

            <p className="text-gray-800 text-xs md:text-[14px] px-3">{card.description}</p>

            <Image 
              src={card.image}
              alt={card.caption}
              className="w-full md:h-[190px] object-cover mt-[3%]"
              width={605}
              height={190}
            />

            <div className="bg-[#EEF3F8] p-3 mb-3">
              <p className="text-gray-800 text-xs md:text-base font-[600]">{card.caption}</p>
              <a
                href={`https://${card.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 text-sm my-[1%] hover:underline"
              >
                {card.link}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center mx-auto justify-center mt-[4%]">
        <DarkDotIcon />
        <LightDotIcon />
        <LightDotIcon />
        <LightDotIcon />
        <LightDotIcon />
      </div>

      <hr className="w-[70%] mx-auto my-[1%]" />

      <div className="flex gap-2 mb-[1%] w-full items-center justify-center text-[#18181899]">
        <h1>Show all details</h1>
        <RightArrowIcon2 />
      </div>
    </div>
  );
};

export default ActivityCards;
