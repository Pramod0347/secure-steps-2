import React, { useState } from "react";
import leftbg from "@/app/assets/lenders/Human1.png";
import leftbg2 from "@/app/assets/lenders/Human2.png";
import leftbg3 from "@/app/assets/lenders/Human3.png";
import leftbg4 from "@/app/assets/lenders/Human4.png";
import leftbg5 from "@/app/assets/lenders/Human5.png";
import leftbg6 from "@/app/assets/lenders/Human6.png";
import leftbg7 from "@/app/assets/lenders/Human3.png";
import leftbg8 from "@/app/assets/lenders/Human5.png";
import leftbg9 from "@/app/assets/lenders/Human6.png";
// import Pixel from "@/app/assets/groups/pixel.png";
// import peops from "@/app/assets/groups/peops.png";
// import { Link } from "react-router-dom";
import previous from "@/app/assets/Previous.png";
import next from "@/app/assets/Next.png";
import Pixel from "@/app/assets/lenders/Pixel.png";
import Image from "next/image";

const data = [
  {
    image: leftbg,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: leftbg2,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: leftbg3,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: leftbg4,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: leftbg5,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: leftbg6,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: leftbg7,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: leftbg8,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: leftbg9,
    title: "Tonga Villa",
    location:
      "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
];

const CommunityArticles: React.FC = () => {
  const itemsPerPage = 6; // 3 rows x 6 columns
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get paginated data
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for navigation
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className="grid mt-6 md:mt-24 md:px-20 px-4  grid-cols-1 md:grid-cols-2 gap-10 ">
        {paginatedData.map((item, index) => (
          <div
            key={index}
            className="px-2.5   h-fit relative py-2.5 overflow-hidden  border w-full flex-col md:flex-row flex gap-2 md:rounded-[28px] rounded-2xl    shadow-md "
          >
            <Image 
              className="md:w-1/2   md:scale-90 object-cover rounded-2xl "
              src={item.image}
              alt={item.title}
            />
            <div className=" px-3 py-8   mb-1   flex flex-col justify-between     ">
              <div className=" flex  items-center gap-4 justify-center">
                {/* <Image  src={Pixel} className=" rounded-[24px] w-10 h-full" alt="" /> */}
                <div className=" flex flex-col  items-start justify-center gap-4">
                  <div className=" flex items-center  gap-4">
                    <Image  src={Pixel} className=" w-6 md:w-1/6" alt="" />
                    <h1 className="  text-sm md:text-[15px] text-[#E50914] font-semibold">
                      Account Name
                    </h1>
                  </div>
                  <h1 className=" text-sm md:text-[15px] font-semibold">Article Title </h1>
                  <h2 className="  text-[#6D6D6D]  text-[10px] md:text-[14px]">
                    Limited edition of a custom game: Marry the Fire or die. Now
                    Available on <br /> Xbox.
                  </h2>
                </div>
              </div>

              <div className="  md:flex  hidden gap-2 ">
                <div className=" flex whitespace-nowrap gap-2 items-center justify-center">
                  <div className=" rounded-full px-2 py-2 bg-[#B81D24] w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16px"
                      height="16px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                  <h1 className=" text-[14px]">9.5k Upvotes</h1>
                </div>
                <div className=" flex whitespace-nowrap items-center gap-2 justify-center">
                  <div className=" px-2 py-2 rounded-full rotate-180 w-fit bg-[#909090]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16px"
                      height="16px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                  <h1 className=" text-[14px]">9.5k Upvotes</h1>
                </div>
              </div>

              {/* mobile upvote */}
              <div className=" mt-2 flex md:hidden   gap-2 ">
                <div className=" flex whitespace-nowrap gap-2 items-center justify-center">
                  <div className=" rounded-full px-2 py-2 bg-[#B81D24] w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10px"
                      height="10px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                  <h1 className=" text-xs md:text-[14px]">9.5k Upvotes</h1>
                </div>
                <div className=" flex whitespace-nowrap items-center gap-2 justify-center">
                  <div className=" px-2 py-2 rounded-full rotate-180 w-fit bg-[#909090]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10px"
                      height="10px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                  <h1 className=" text-xs md:text-[14px]">9.5k Upvotes</h1>
                </div>
              </div>

            </div>
            <h1 className=" absolute   bottom-3 text-[12px]   text-[#424242]  right-5">
              24 - 09 - 2024{" "}
            </h1>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-10 mt-20">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Image  src={previous} className="w-8 h-full" alt="Previous" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                currentPage === index + 1
                  ? "bg-black"
                  : "bg-[#EAEAEA] hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Image  src={next} className="w-8 h-full" alt="Next" />
        </button>
      </div>
    </>
  );
};

 

export default CommunityArticles;
