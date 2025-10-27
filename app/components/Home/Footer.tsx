'use client'
import React from "react";
import footer from "@/app/assets/footerBanner.png";
import logo from "@/app/assets/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  // Hide footer on specific routes
  if (pathname === "/auth/signin" || pathname === "/auth/signup" || pathname === "/quizform" || pathname === "/select/add-university" || pathname === "/select/drag-&-drop" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="md:h-[400px] w-full text-[#F5F5F1]   bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${footer.src})` }}>
      <div
        className="w-full flex md:px-28 px-6  items-center"

      >
        <div className=" flex flex-col md:flex-row my-10   w-full gap-7 md:gap-5     items-start">
          <div className=" flex flex-row  items-center w-full md:flex-col justify-between md:gap-4 md:items-start">
            {/* logo */}
            <Image src={logo} className="w-[100px] h-[22px]  md:w-[175px] md:h-[40px]" alt="" />

            {/* Small screen Arrow */}
            <button className=" bg-[#303030] w-[41px] h-[41px]  rounded-full px-3 py-3 md:hidden block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4    -rotate-90"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* large screen Input box */}
            <div className=" hidden md:block mt-3">
              <p className="text-[16px] leading-[21.34px]  md:text-2xl mb-2 text-[#F5F5F1]">
                Subscribe to our <br /> newsletter
              </p>
              <div className=" flex w-full">
                <input
                  type="text"
                  className="text-[12px] leading-[15.2px] md:text-lg  w-72  pb-2 outline-none  placeholder-[#868684]  bg-transparent border-b border-b-[#2d2c2c]"
                  placeholder="Email address"
                />
                <button className=" bg-[#303030]  rounded-full px-3 py-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* App routes */}
          <div className="grid grid-cols-2  gap-4 md:flex md:flex-row xl:grid-cols-4   md:gap-2 w-[100%] justify-between">
            <div className="   flex flex-col md:gap-4 gap-4  text-[14px] text-[#909090]">
              <h1 className="  text-[#F5F5F1] text-[16px]  md:text-xl">Inside Prohouse</h1>
              <p>Terms and Conditions</p>
              <p>Privacy Policy</p>
              <p>Cancellation Policy</p>
              <p>Guest Rules</p>
              <p>Reservation Guide</p>
            </div>
            <div className="   flex flex-col md:gap-4 gap-4 text-[14px] text-[#909090]">
              <h1 className="  text-[#F5F5F1]  text-[16px]  md:text-xl">About</h1>
              <p>Our Story</p>
              <p>Contact with İndie</p>
              <p>Blog</p>
              <p>F.A.Q</p>
            </div>
            {/* <div className="  flex flex-col md:gap-4 gap-4 text-[14px] text-[#909090]">
            <h1 className="  text-[#F5F5F1]  text-[16px]  md:text-xl">Best Homies</h1>
            <p>Sample</p>
            <p>Sample</p>
            <p>Sample</p>
            <p>Sample</p>
          </div> */}
            <button className=" bg-[#303030] w-[50px] h-[50px] text-center  rounded-full p-3  hidden md:flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4    -rotate-90"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Small screen news letter */}
          <div className=" block md:hidden">
            <p className="text-[16px] leading-[21.34px] font-[400]  md:text-2xl mb-2 text-[#F5F5F1]">
              Subscribe to our <br /> newsletter
            </p>
            <div className=" flex w-[80%]">
              <input
                type="text"
                className="text-[12px] leading-[15.2px] md:text-lg  w-72  pb-2 outline-none  placeholder-[#868684]  bg-transparent border-b border-b-[#2d2c2c]"
                placeholder="Email address"
              />
              <button className="bg-[#303030] w-[41px] h-[41px]  rounded-full px-3 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div>
            {/*large screen copy right */}
            <span className="block md:hidden text-[14px] mb-10 my-5  font-semibold leading-[22px]">
              Copyright © 2022. All rights reserved.
            </span>
          </div>
        </div>
      </div>

      <hr className="hidden md:block w-[90%] bg-[#303030] border border-[#303030] mx-auto" />

      <div className="hidden md:flex flex-row justify-between items-center px-28 mt-10 gap-[32%] w-full ">
        <span className="hidden md:block text-[14px] font-medium leading-[22px]">
          Designed & Developed by TIC Global
        </span>
        <span className="hidden md:block text-[14px] font-medium leading-[22px]">
          All rights reserved by Secure steps
        </span>
      </div>
    </div>

  );
};

export default Footer;