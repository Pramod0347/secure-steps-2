import LenderBanner from "@/app/assets/lenders/LenderBanner.png";
import { FaSearch as SearchIcon } from "react-icons/fa";
import { FiFilter as FilterIcon } from "react-icons/fi";

const Hero = () => {
  return (
    <div
      className="relative h-screen jakartha w-screen bg-cover overflow-x-hidden bg-left flex items-center md:bg-center text-white"
      style={{
        backgroundImage: `url(${LenderBanner.src})`,
      }}
    >
      <div className="flex flex-col absolute md:left-auto md:bottom-auto bottom-10 md:right-0 md:px-32 gap-10 mt-18">
        <div className="h-full flex-col gap-4 flex">
          <h1 className="md:text-[90px] hidden md:block font-bold text-6xl md:leading-[87px]">
            We are here to help <br /> you Achieve your <br /> dreams
          </h1>
        </div>
        <div className="gap-4 flex flex-col  md:ml-0 ml-2 md:items-stretch items-end md:flex-row mt-[4%]">
          {/* search bar */}
          <div className="relative text-black  2xl:w-[605px] 2xl:h-[68px] bg-white rounded-full overflow-hidden pl-4 flex flex-row items-center justify-between">
            <input
              className="lg:w-[450px] w-[240px] font-[500] pl-5 md:text-[21px] outline-none h-[50px]"
              placeholder="Search Loans"
            />
            <div className="text-white bg-[#BE243C] w-[38px] h-[38px] rounded-[50%] flex items-center justify-center md:mr-2 mr-2 cursor-pointer">
              <SearchIcon className="text-[21px]" />
            </div>
          </div>
          {/* Filter btn */}
          <div className="flex gap-1 cursor-pointer items-center w-[140px] md:py-0 py-2 justify-center rounded-full text-[21px] bg-black text-white">
            <FilterIcon />
            <p>Filter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;