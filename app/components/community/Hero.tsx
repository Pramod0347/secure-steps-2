
import { FaSearch as SearchIcon } from "react-icons/fa";
import { FiFilter as FilterIcon } from "react-icons/fi";

// Asset Imports
import LenderBanner from "@/app/assets/groups/banner.png";

// Hero Section Component
const Hero: React.FC = () => {
  return (
    <div
      className="relative h-screen jakartha w-screen bg-cover bg-left items-end md:pb-0 pb-10  flex md:items-center md:bg-center text-white"
      style={{ backgroundImage: `url(${LenderBanner.src})` }}
    >
      <div className="flex flex-col px-4 md:px-32 gap-6 md:gap-20 mt-28">
        <div className="h-full flex-col gap-4 flex">
          <h1 className="md:text-[90px] font-bold text-[40px] leading-[44px] md:leading-[87px]">
            Explore and <br />
            connect <br /> with all.
          </h1>
        </div>

        <div className=" flex-col md:flex-row gap-4 flex">
          {/* search bar */}
          <div className="relative text-black 2xl:w-[605px] 2xl:h-[68px] bg-white rounded-full overflow-hidden pl-4 flex flex-row items-center justify-between">
            <input
              className="lg:w-[450px] w-full bg-white text-[#6F6F6F] font-[500] pl-5  text-[21px] outline-none h-[50px]"
              placeholder="Search Groups"
            />
            <div className="text-white bg-[#BE243C] md:w-[38px] md:h-[38px] w-[36px] h-[30px] rounded-[50%] flex items-center justify-center mr-4 cursor-pointer">
              <SearchIcon className="md:text-[21px]" />
            </div>
          </div>
          {/* Filter btn */}
          <div className="flex gap-1 md:py-0  py-2 cursor-pointer items-center w-[140px] justify-center rounded-full text-[21px]
           bg-black text-white">
            <FilterIcon />
            <p>Filter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;