"use client";
import React, { useEffect, useState } from "react";
import bannerImg from "@/app/assets/4.png";
import previous from "@/app/assets/Previous.png";
import next from "@/app/assets/Next.png";
import locationpng from "@/app/assets/location.png";
import Link from "next/link";
import Image from "next/image";
import { IoIosHeartEmpty as EmptyHeartIcon } from "react-icons/io";
import { IoIosHeart as ActiveHeartIcon } from "react-icons/io";
import { motion } from "framer-motion"
import { useAuth } from "@/app/context/AuthContext";

interface Accommodation {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
  banner: string;
  pricingPlans: { price: number }[];
}

const Results: React.FC = () => {

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, isAuthenticated } = useAuth();
  const [likedItems, setLikedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchAccommodations();
  }, [currentPage]);

  const fetchAccommodations = async () => {
    try {
      const NextUrl = process.env.NEXTAUTH_URL;
      const response = await fetch(`${NextUrl}/api/accommodations`);
      if (!response.ok) {
        throw new Error('Failed to fetch accommodations');
      }

      const data = await response.json();

      setAccommodations(data.accommodations);
      console.log("dataAccomodation :", data.accommodations);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
    }
  };

  const handleToggleLike = async (accommodationId: string) => {
    if (!isAuthenticated) {
      // Handle unauthenticated user (e.g., show login prompt)
      return;
    }

    try {
      const NextUrl = process.env.NEXTAUTH_URL;
      const method = likedItems.includes(accommodationId) ? 'DELETE' : 'POST';
      const response = await fetch(`${NextUrl}/api/accommodations/like?id=${accommodationId}`, {
        method,
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      setLikedItems(prev =>
        prev.includes(accommodationId)
          ? prev.filter(id => id !== accommodationId)
          : [...prev, accommodationId]
      );
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="md:px-32 p-5 md:mb-20  md:pt-32 w-full pt-[84px] flex flex-col gap-4 jakartha">

      <div className=" flex flex-row items-center justify-between">
        <div>
          <h1 className="md:text-[40px] text-[32px] leading-[40px] font-bold">Top Houses</h1>
          <p className="text-[#BDBDBD] md:text-lg text-[16px] leading-[19px]">
            Turpis facilisis tempor pulvinar in lobortis ornare magna.
          </p>
        </div>

        {isAuthenticated && user?.role === "ADMIN" && (
          <Link href="/stay/add-stay" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Add Stay
          </Link>
        )}

      </div>


      <div className="grid grid-cols-2  w-full md:grid-cols-3 md:gap-10 gap-6">
        {accommodations.map((item) => (
          <div
            key={item.id}
            className="group shadow-xl cursor-pointer md:mt-20 mt-5 mb-8 rounded-3xl relative flex items-center justify-center"
          >
            <Link href={`/stay/${item.id}`} className="flex flex-col justify-center items-center">
              <div
                className="absolute top-4 right-3 w-[24px] h-[25px] md:w-[50px] md:h-[47px] flex items-center justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleLike(item.id);
                }}
              >
                <motion.div whileTap={{ scale: 0.6 }} className="w-full h-full bg-white/25 bg-opacity-70 rounded-full shadow-lg backdrop-blur-lg flex items-center justify-center">
                  {likedItems.includes(item.id) ? (
                    <ActiveHeartIcon className="md:w-[24px] text-[#B81D24] md:h-[24px] w-[12px] h-[12px]" />
                  ) : (
                    <EmptyHeartIcon className="md:w-[24px] text-white md:h-[24px] w-[12px] h-[12px]" />
                  )}
                </motion.div>
              </div>

              <Image className="w-full rounded-[17px] h-[350px] md:h-[450px] lg:h-[450px] " src={bannerImg} alt={item.title} width={600} height={500} />

              <div className="group-hover:scale-105 transition-all bg-white flex flex-col items-start justify-center gap-2 shadow-md md:px-4 px-2 w-[90%] md:w-[80%] py-2 md:rounded-[8px] rounded-[3px] absolute -bottom-10">
                <h1 className="md:text-lg text-[10px] font-bold">{item.title}</h1>
                <p className="flex md:text-[12px] text-[8px] items-center">
                  <Image
                    className="md:w-4 md:h-auto w-[10px] h-[10px] md:mr-2 mr-[2px]"
                    src={locationpng}
                    alt="Location"
                  />
                  {`${item.address}, ${item.city}, ${item.country}`}
                </p>
                <p className="inter md:text-[14px] text-[8px] font-bold text-[#B81D24]">
                  {`$ ${item.pricingPlans[0]?.price || 'N/A'}`}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-10 mt-20">
        {/* Left Arrow */}
        <button
          onClick={handlePrev} disabled={currentPage === 1} className={`${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={previous} className="md:w-8 md:h-full w-[17.3px] h-[17.3px]" alt="Previous" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              onClick={() => handlePageClick(index + 1)}
              className={`md:w-3 md:h-3 w-[6.50px] h-[6.50px] rounded-full cursor-pointer ${currentPage === index + 1 ? "bg-black" : "bg-[#EAEAEA] hover:bg-gray-500"
                }`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext} disabled={currentPage === totalPages} className={`${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={next} className="md:w-8 md:h-full w-[17.3px] h-[17.3px]" alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default Results;