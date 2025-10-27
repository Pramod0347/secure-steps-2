import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight as RightArrowIcon } from "react-icons/fa";

const data = [
  {
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Tonga Villa",
    location: "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Tonga Villa",
    location: "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Tonga Villa",
    location: "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Tonga Villa",
    location: "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Tonga Villa",
    location: "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
  {
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Tonga Villa",
    location: "Limited edition of a custom game: Marry the Fire or die. Now Available on Xbox.",
    price: "$ 8K - $ 20K",
  },
];

const TopArticles = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentIndex + 2 < data.length) {
      setCurrentIndex(currentIndex + 1);
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: (containerRef.current.clientWidth / 2) * (currentIndex + 1),
          behavior: 'smooth'
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: (containerRef.current.clientWidth / 2) * (currentIndex - 1),
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="relative w-full jakartha bg-[#f4f4f4] py-[6rem] mb-[-14rem]">
      <div className="ml-[6%]">
        <p className="md:text-[33px] text-[24px] font-[700]">Top Articles</p>
        <p className="text-[12px] md:text-[18px] font-[400] text-gray-400">Turpis facilisis tempor pulvinar in lobortis ornare magna.</p>
      </div>

      <div
        ref={containerRef}
        className="flex gap-4 md:h-[70vh] py-[4%] md:mt-0 mt-4 overflow-x-auto scroll-smooth no-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 md:w-[605px] w-[250px] md:h-[298px] md:px-4 md:py-8 rounded-2xl scroll-snap-align-start"
            style={{
              scrollSnapAlign: 'center',
              boxShadow: "2px 5px 5px 2px lightgray"
            }}
          >
            <Link href={`/stay/${index}`} className="flex gap-4 md:flex-row flex-col relative">
              <Image 
                className="md:w-[50%] p-1 rounded-2xl"
                src={item.image}
                alt={item.title}
                width={300}
                height={200}
              />
              <div className="md:gap-0 gap-2 flex flex-col px-3 justify-between py-4">
                <div className="flex items-center gap-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    className="w-[30px] h-[30px] object-cover rounded-full"
                    alt="Profile Picture"
                    width={30}
                    height={30}
                  />
                  <h1 className="text-sm md:text-[15px] text-[#E50914] font-semibold">
                    Account Name
                  </h1>
                </div>
                <h1 className="md:text-lg text-sm font-bold">{item.title}</h1>
                <p className="flex text-[10px] md:text-[14px] items-center">{item.location}</p>
                <div className="md:flex gap-2 hidden -ml-2 scale-95">
                  <div className="flex whitespace-nowrap gap-1 items-center justify-center">
                    <div className="rounded-full px-2 py-2 bg-[#B81D24] w-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        className=""
                      >
                        <path
                          d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                          fill="white"
                        ></path>
                      </svg>
                    </div>
                    <h1 className="text-[14px]">9.5k Upvotes</h1>
                  </div>
                  <div className="flex whitespace-nowrap items-center gap-1 justify-center">
                    <div className="px-2 py-2 rounded-full rotate-180 w-fit bg-[#909090]">
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
                    <h1 className="text-[14px]">9.5k Upvotes</h1>
                  </div>
                </div>

                <div className="flex md:hidden gap-2 -ml-2 scale-95">
                  <div className="flex whitespace-nowrap gap-1 items-center justify-center">
                    <div className="rounded-full px-2 py-2 bg-[#B81D24] w-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8px"
                        height="8px"
                        viewBox="0 0 24 24"
                        className=""
                      >
                        <path
                          d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                          fill="white"
                        ></path>
                      </svg>
                    </div>
                    <h1 className="text-xs md:text-[14px]">9.5k Upvotes</h1>
                  </div>
                  <div className="flex whitespace-nowrap items-center gap-1 justify-center">
                    <div className="px-2 py-2 rounded-full rotate-180 w-fit bg-[#909090]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8px"
                        height="8px"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                          fill="white"
                        ></path>
                      </svg>
                    </div>
                    <h1 className="text-xs md:text-[14px]">9.5k Upvotes</h1>
                  </div>
                </div>
              </div>

              <div className="absolute text-gray-400 text-[10px] bottom-[-5%] right-0">
                <p>27-09-2024</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-10 my-20">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <RightArrowIcon className="w-8 h-8 scale-x-[-1] text-gray-400 cursor-pointer" />
        </button>

        <div className="flex items-center gap-3">
          {Array.from({ length: Math.ceil(data.length / 2) }).map((_, index) => (
            <span
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                if (containerRef.current) {
                  containerRef.current.scrollTo({
                    left: (containerRef.current.clientWidth / 2) * index,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                currentIndex === index
                  ? "bg-black"
                  : "bg-[#EAEAEA] hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex + 2 >= data.length}
          className={`${currentIndex + 2 >= data.length ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <RightArrowIcon className="w-8 h-8 text-gray-400 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default TopArticles;
