import React from "react";
// import leftbg from "@/app/assets/leftbg.png";
// import leftbg2 from "@/app/assets/leftbg2.png";
import leftbg3 from "@/app/assets/leftbg3.png";
import leftbg4 from "@/app/assets/leftbg4.png";
import leftbg5 from "@/app/assets/leftbg5.png";
import leftbg6 from "@/app/assets/leftbg6.png";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import locationpng from "@/app/assets/location.png";
import Image from "next/image";

const Similar = () => {
  return (
    <div className=" ">
      <SimilarCard />
    </div>
  );
};

export default Similar;

const SimilarCard = () => {
  const data = [
    
    {
      image: leftbg3,
      title: "Tonga Villa",
      location: "1901 Thornridge Cir. Shiloh 81063",
      price: "$ 8K - $ 20K",
    },
    {
      image: leftbg4,
      title: "Tonga Villa",
      location: "1901 Thornridge Cir. Shiloh 81063",
      price: "$ 8K - $ 20K",
    },
    {
      image: leftbg5,
      title: "Tonga Villa",
      location: "1901 Thornridge Cir. Shiloh 81063",
      price: "$ 8K - $ 20K",
    },
    {
      image: leftbg6,
      title: "Tonga Villa",
      location: "1901 Thornridge Cir. Shiloh 81063",
      price: "$ 8K - $ 20K",
    },
    // Add the rest of your items here
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 18; // 3 rows x 6 columns
  const [currentPage] = useState(1);

  // const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic offset for centering
 


  return (
    <div className="relative md:scale-100 scale-75 py-10 pb-20 md:mt-40 w-screen">
      {/* Navigation Buttons */}

      
    </div>
  );
};
