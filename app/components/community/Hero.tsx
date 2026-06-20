
import { motion } from "framer-motion";
import Link from "next/link";
import { FaSearch as SearchIcon } from "react-icons/fa";

// Asset Imports
import LenderBanner from "@/app/assets/groups/banner.png";

const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/LMR90Zvq4PMLvsTZZqCiGx";

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
            <div className="text-white bg-gradient-to-r from-[#997CE1] via-[#E2B9E3] to-[#FA7BD6] md:w-[38px] md:h-[38px] w-[36px] h-[30px] rounded-[50%] flex items-center justify-center mr-4 cursor-pointer">
              <SearchIcon className="md:text-[21px]" />
            </div>
          </div>
          {/* Community CTA */}
          <Link
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex w-[70%] items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 md:w-[240px] md:py-4 md:text-[21px]"
          >
            Join our community
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
