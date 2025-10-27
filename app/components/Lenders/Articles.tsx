import React from "react";
import { useState } from "react";
import leftbg from "@/app/assets/lenders/Human1.png";
import leftbg2 from "@/app/assets/lenders/Human2.png";
import leftbg3 from "@/app/assets/lenders/Human3.png";
import leftbg4 from "@/app/assets/lenders/Human4.png";
import leftbg5 from "@/app/assets/lenders/Human5.png";
import leftbg6 from "@/app/assets/lenders/Human6.png";
import leftbg7 from "@/app/assets/lenders/Human3.png";
import leftbg8 from "@/app/assets/lenders/Human5.png";
import leftbg9 from "@/app/assets/lenders/Human6.png";
import previous from "@/app/assets/Previous.png";
import Pixel from "@/app/assets/lenders/Pixel.png";
import next from "@/app/assets/Next.png";
import Link from "next/link";
import Image from "next/image";


const LenderArticleData = [
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

const LendersArticle: React.FC = () => {
  const itemsPerPage = 6; // 3 rows x 6 columns
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(LenderArticleData.length / itemsPerPage);

  // Get paginated data
  const paginatedData = LenderArticleData.slice(
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
    <div className="px-32 mb-20 pt-32 flex flex-col gap-4 jakartha">
      <div>
        <h1 className="text-[40px] font-bold">Top Articles</h1>
        <p className="text-[#BDBDBD] text-lg">
          Turpis facilisis tempor pulvinar in lobortis ornare magna.
        </p>
      </div>
      
      <div className="grid mt-20 grid-cols-2 gap-12">
        {paginatedData.map((item, index) => (
          <div
            key={index}
            className="px-4 py-8 w-[104%] overflow-hidden rounded-2xl border shadow-xl "
          >
            <Link href={`/stay/${index}`} className="   flex gap-4">
              <Image 
                className="w-[50%] rounded-2xl"
                src={item.image}
                alt={item.title}
              />
              <div className=" flex flex-col justify-between   py-4   ">
                <div className=" flex  items-center    gap-4">
                  <Image  src={Pixel} className=" w-8 h-full" alt="" />
                  <h1 className=" text-[15px] text-[#E50914] font-semibold">
                    Account Name
                  </h1>
                </div>
                <h1 className="text-lg font-bold">{item.title}</h1>
                <p className="flex text-[14px] items-center ">
                  {item.location}
                </p>
                <div className=" flex gap-2 -ml-2  scale-95">
                  <div className=" flex whitespace-nowrap gap-1 items-center justify-center">
                    <div className=" rounded-full px-2 py-2 bg-[#B81D24] w-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
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
                  <div className=" flex whitespace-nowrap items-center gap-1 justify-center">
                    <div className=" px-2 py-2 rounded-full rotate-180 w-fit bg-[#909090]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
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
              </div>
            </Link>
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
    </div>
  );
};

export default LendersArticle;