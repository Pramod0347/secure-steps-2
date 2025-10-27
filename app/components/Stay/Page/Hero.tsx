import React from "react";
import StayBanner from "@/app/assets/stayBanner.png";
import Doller from "@/app/assets/dollar.png";
import houseStay from "@/app/assets/houseStay.png";
import doimage from "@/app/assets/do.png";
import blockimage from "@/app/assets/block.png";
import { DoubleScrollBar } from "./MultiRangeSlider";
import Image from "next/image";
// import { Select, Option } from "@material-tailwind/react";
const Hero = () => {
  return (
    <div
      className="relative h-screen   jakartha w-screen md:bg-cover bg-cover  flex flex-col md:items-start justify-center items-center bg-center text-white"
      style={{ backgroundImage: `url(${StayBanner.src})` }}
    >
      <div className=" flex flex-col  mt-14 gap-2        md:px-32 md:gap-20 md:mt-28">
        <div className=" h-full px-10 md:px-0 mt-20    flex-col gap-4 flex">
          <h1 className="md:text-[68px] text-[36px] font-bold md:leading-[74px] leading-[43px]">
            Find your best <br />
            Cozy Stay.
          </h1>
          <p className="md:text-base text-[12px] leading-[16.7px]  tracking-wide font-normal">
            Find the best places around you at the <br /> cheapest and
            affordable prices.
          </p>
        </div>


        <div className="gap-10 md:w-fit w-[358px] md:mt-0 -mt-10 mx-auto bg-black/25 bg-opacity-70 rounded-xl   md:scale-100 scale-[0.8]  shadow-lg p-3 md:px-8 py-6  flex  backdrop-blur-lg">
          <div className=" flex flex-col items-start md:items-center  justify-between gap-3">
            <div className="flex md:flex-row flex-col md:items-center items-start justify-between gap-4">

              {/* Small Screen - Location Input */}
              <input
                type="text"
                placeholder="Your desired location goes here"
                className="md:w-[30rem] md:h-auto w-[319px] text-xs md:text-base h-[40px] bg-[#F4F4F4] block md:hidden rounded-full px-6 py-2.5 shadow-md text-gray-700 font-medium focus:outline-none"
              />

              {/* Dropdown for Rent */}
              <div className="flex items-center gap-2 bg-[#F4F4F4] rounded-full pl-4 pr-8 py-1 shadow-md">
                <Image src={Doller} alt="" className="w-[16px] h-[16px]" />
                <select
                  className="appearance-none md:w-full h-[40px] pr-8 pl-2 py-2 cursor-pointer 
                   bg-transparent text-gray-700 text-[14px] md:text-[16px] font-medium 
                   outline-none  rounded"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0rem center',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option className="hover:bg-gray-500 px-4 py-2">
                    Rent
                  </option>
                  <option className="hover:bg-gray-500 px-4 py-2">
                    Buy
                  </option>
                </select>
              </div>

              {/* Small screen - Price range */}
              <div className="text-black block md:hidden">
                <p className="text-sm  jakartha text-black font-[400] opacity-70 mb-1 ml-2 whitespace-nowrap">
                  Price Range{" "}
                </p>
                <div className="flex items-center gap-2 bg-[#F4F4F4] rounded-full pl-6 pr-8 py-1 shadow-md">
                  <Image src={doimage} alt="" className="w-[16px] h-[16px] " />
                  <select className=" pr-7 pl-2 appearance-none  py-2 cursor-pointer bg-transparent text-gray-700 md:text-[16px] text-[12px] font-medium outline-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0rem center',
                      backgroundSize: '1.5rem'
                    }}
                  >
                    <option className=" hover:!bg-gray-500 !px-4 !py-2">
                      USD
                    </option>
                    <option className="!px-4 hover:!bg-gray-500 !py-2">
                      RUP
                    </option>
                  </select>
                </div>
              </div>

              {/* Small screen - Range Slider with Dual Tooltips */}
              <div className="md:hidden block my-5">
                <DoubleScrollBar min={500} max={1000} step={0} />
              </div>

              {/*Large screen - Location Input */}
              <input
                type="text"
                placeholder="Your desired location goes here"
                className="w-[30rem] bg-[#F4F4F4]  hidden md:block   rounded-full px-6 py-2.5 shadow-md text-gray-700 font-medium focus:outline-none"
              />

              <div className="flex flex-row">
                <div className="flex flex-col gap-5 mr-5">
                  {/* Dropdown for House Type */}
                  <div className="flex items-center gap-2 bg-[#F4F4F4] rounded-full pl-4 pr-6 py-1 shadow-md">
                    <Image src={houseStay} alt="" className="w-[16px] h-[16px]" />
                    <select className="appearance-none md:w-full md:pr-4 pl-2 py-2 cursor-pointer 
                   bg-transparent text-gray-700 text-[14px] md:text-[16px] font-medium 
                   outline-none  rounded"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0rem center',
                        backgroundSize: '1.5rem'
                      }}
                    >
                      <option className=" hover:!bg-gray-500 !px-4 !py-2">
                        House
                      </option>
                      <option className="!px-4 hover:!bg-gray-500 !py-2">
                        Apartment
                      </option>
                      <option className="!px-4 hover:!bg-gray-500 !py-2">
                        Condo
                      </option>
                    </select>
                  </div>

                  {/* small screen - Rooms */}
                  <div className="flex md:hidden items-center gap-2 bg-[#F4F4F4] rounded-full pl-4 md:pr-8 p-3 py-1 shadow-md">
                    <Image src={blockimage} alt="" className="w-[16px] h-[16px] md:h-5" />
                    <select className=" pr-7 pl-2 appearance-none  py-2 cursor-pointer bg-transparent text-gray-700 text-[14px] md:text-[16px] font-medium outline-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0rem center',
                        backgroundSize: '1.5rem'
                      }}
                    >
                      <option className=" hover:!bg-gray-500 !px-4 !py-2">
                        2 Rooms
                      </option>
                      <option className="!px-4 hover:!bg-gray-500 !py-2">
                        RUP
                      </option>
                    </select>
                  </div>
                </div>
                <div className="border-l-2 md:hidden pl-6 flex flex-col gap-3">
                  {/* Result Count */}
                  <div className="text-center text-white">
                    <p className="text-xl font-bold">563</p>
                    <p className=" opacity-65">Results</p>
                  </div>

                  {/* Search Button */}
                  <button className="bg-black text-white rounded-full px-6 py-2 shadow-md">
                    Search
                  </button>
                </div>
              </div>

            </div>

            {/* Dropdown for Rooms */}
            <div className="flex md:flex-row flex-col items-center justify-between gap-4">

              {/*Large screen - Rooms Dropdown */}
              <div className="text-black md:block hidden">
                <p className="text-sm  jakartha text-white font-bold opacity-70 mb-1 ml-2 whitespace-nowrap">
                  Price Range{" "}
                </p>
                <div className="flex items-center gap-2 bg-[#F4F4F4] rounded-full pl-6 pr-8 py-1 shadow-md">
                  <Image src={doimage} alt="" className="w-[16px] h-[16px]" />
                  <select className=" pr-7 pl-2 appearance-none  py-2 cursor-pointer bg-transparent text-gray-700 text-[16px] font-medium outline-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0rem center',
                      backgroundSize: '1.5rem'
                    }}
                  >
                    <option className=" hover:!bg-gray-500 !px-4 !py-2">
                      USD
                    </option>
                    <option className="!px-4 hover:!bg-gray-500 !py-2">
                      RUP
                    </option>
                  </select>
                </div>
              </div>

              {/* Large screen - Range Slider with Dual Tooltips */}
              <div className="md:block hidden">
                <DoubleScrollBar min={1000} max={20000} step={0} />
              </div>

              {/* small screen - Rooms */}
              <div className="md:flex hidden items-center gap-2 bg-[#F4F4F4] rounded-full pl-4 md:pr-8 p-3 py-1 shadow-md">
                <Image src={blockimage} alt="" className="w-[16px] h-[16px] " />
                <select className=" pr-7 pl-2 appearance-none  py-2 cursor-pointer bg-transparent text-gray-700 text-[14px] md:text-[16px] font-medium outline-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0rem center',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option className=" hover:!bg-gray-500 !px-4 !py-2">
                    2 Rooms
                  </option>
                  <option className="!px-4 hover:!bg-gray-500 !py-2">
                    RUP
                  </option>
                </select>
              </div>


            </div>
          </div>
          <div className="border-l-2 hidden md:flex pl-6 flex-col gap-3">
            {/* Result Count */}
            <div className="text-center text-white">
              <p className="text-xl font-bold">563</p>
              <p className=" opacity-65">Results</p>
            </div>

            {/* Search Button */}
            <button className="bg-black text-white rounded-full px-6 py-2 shadow-md">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
