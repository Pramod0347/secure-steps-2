"use client"

import Image from "next/image"
import { FaSearch as SearchIcon } from "react-icons/fa"
import { FiFilter as FilterIcon } from "react-icons/fi"
import Groupimage from "@/app/assets/Connect/Group.png"

const Hero = () => {
  return (
    <div className="relative h-screen w-screen bg-gradient-to-b from-[#88b6fa] to-[#ffffff] flex items-center px-4 md:px-10 bg-center text-white">
      <div className="flex flex-col md:px-32 gap-10 md:mt-0 mt-10 w-full jakartha">
        <div className="flex md:flex-row flex-col w-full items-center justify-between md:ml-0 -ml-4 -mt-20 gap-4">
          <h1 className="md:text-[78px] font-bold text-4xl md:leading-[80px]">
            Connecting <br /> with others <br /> brings growth
          </h1>
          <Image
            src={Groupimage || "/placeholder.svg"}
            className="md:w-1/3 lg:w-1/3 sm:w-1/3"
            alt="Group of people connecting"
          />
        </div>

        {/* Search container - positioned absolutely but not fixed */}
        <div className="absolute bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 md:left-[55%] w-[90%] md:w-[60%] max-w-[600px]">
          <div className="flex flex-col md:flex-row gap-3 items-center w-full">
            {/* Search bar */}
            <div className="relative text-black border border-[#6F6F6F] bg-white w-full md:flex-1 rounded-full overflow-hidden pl-2 md:pl-4 flex flex-row items-center justify-between">
              <input
                className="w-full bg-transparent text-[#6F6F6F] font-[500] pl-2 md:pl-5 text-[14px] md:text-[21px] outline-none py-2.5 md:py-3"
                placeholder="Search Connects"
              />
              {/* Fixed search icon container with proper aspect ratio */}
              <div className="text-white bg-[#BE243C] flex-shrink-0 w-[30px] h-[30px] md:w-[38px] md:h-[38px] rounded-full flex items-center justify-center mr-2 md:mr-4 cursor-pointer">
                {/* Fixed icon size to prevent stretching */}
                <SearchIcon className="text-[14px] md:text-[18px]" />
              </div>
            </div>

            {/* Filter button */}
            <div className="flex gap-1 cursor-pointer items-center py-2 w-full md:w-[140px] justify-center rounded-full text-[14px] md:text-[21px] bg-black text-white">
              <FilterIcon className="text-[14px] md:text-[18px]" />
              <p>Filter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero