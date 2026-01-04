"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";

// Last Three Card
import rec2 from "@/app/assets/Home/BudgetCal_Img.jpg";
import rec1 from "@/app/assets/Home/LoanImg.jpg";
import rec3 from "@/app/assets/Home/DocuCheckImg.jpeg";

import { motion, AnimatePresence } from "framer-motion";
import TiltedCard from "../../ui/titlecard";
import { SOPImg, LORImg, GuideImg } from "@/app/assets/Home";
import UnisImg from "@/app/assets/Home/UNIS.png";

import UnisImg_Ob from "@/app/assets/Home/UNIS_OBJECT.png";
import CardObjectImg1 from "@/app/assets/Home/The Ultimate Guide_Object.png";
import CardObjectImg2 from "@/app/assets/Home/SOP_OBJECT.png";
import CardObjectImg3 from "@/app/assets/Home/LOR_OBJECT.png";
import CostEstimatorPage from "../CostEstimator/page";
import Link from "next/link";

const Cards = () => {
  const [cursorText, setCursorText] = useState("");
  const [cursorColor, setCursorColor] = useState({ bg: "", text: "" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isPopupOpen]);

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleCardClick = (index: number) => {
    setSelectedCard(index);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCard(null);
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const handleCardHover = (index: number) => {
    switch (index) {
      case 1:
        setCursorText("Ultimate Guide");
        setCursorColor({ bg: "#BE243C", text: "#FFFFFF" });
        break;
      case 2:
        setCursorText("SOP");
        setCursorColor({ bg: "#3B367D", text: "#FFFFFF" });
        break;
      case 3:
        setCursorText("LOR");
        setCursorColor({ bg: "#22344F", text: "#FFFFFF" });
        break;
      default:
        setCursorText("");
        setCursorColor({ bg: "", text: "" });
    }
  };

  const CardWithAnimation = ({
    image,
    title,
    description,
    showAnimation = false,
    animationClass,
  }: {
    image: StaticImageData;
    title: string;
    description: React.ReactNode;
    showAnimation?: boolean;
    animationClass?: string;
  }) => (
    <div className="flex flex-col md:flex-row md:gap-4 lg:gap-6 bg-[#F6F6F6] rounded-[10px] md:rounded-[24px] p-4 md:p-5 items-start md:items-center relative h-full">
      <div className="w-[58px] h-[58px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] xl:w-[150px] xl:h-[150px] relative mb-2 md:mb-0 flex-shrink-0">
        {showAnimation && (
          <div
            className={`absolute inset-[-3px] rounded-full ${animationClass}`}
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, #E50914 300deg, #E50914 360deg)`,
            }}
          />
        )}
        <div className="relative w-full h-full z-10 rounded-full overflow-hidden border-2 outline-1 outline-[#F6F6F6] border-[#F6F6F6]">
          <Image
            className="object-cover rounded-full w-full h-full"
            src={image || "/placeholder.svg"}
            alt={title}
          />
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-[#B81D24] text-[12px] md:text-[16px] lg:text-[18px] xl:text-[21px] font-bold">
          {title}
        </h1>
        <p className="text-[#22344F] text-[10px] md:text-[14px] lg:text-[16px] xl:text-[17px] font-normal leading-relaxed text-justify max-w-[330px]">
          {description}
        </p>
      </div>
    </div>
  );

  const Popup = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedOptions.length !== 1 && selectedOptions.length !== 3) {
        return; // Don't submit if the selection is invalid
      }
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        handleClosePopup();
      }, 3000);
    };

    const handleCheckboxChange = (option: string) => {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    };

    return (
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClosePopup}
            />
            <motion.div
              className="bg-white p-4 md:p-6 lg:p-8 flex flex-col w-[90%] max-w-md rounded-2xl shadow-xl relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#BE243C]">
                  Get Resources
                </h2>
                <button
                  onClick={handleClosePopup}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    className="flex flex-col items-center justify-center h-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-16 h-16 border-4 border-[#BE243C] border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                ) : isSubmitted ? (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center h-40"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <svg
                      className="w-16 h-16 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <motion.p
                      className="mt-4 text-lg font-semibold text-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      We'll reach you soon!
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BE243C]"
                          placeholder="name@company.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BE243C]"
                          placeholder="123-456-7890"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Choose Your Resources
                        </label>
                        <div className="space-y-2">
                          {[
                            "Ultimate Guide",
                            "Statement of Purpose",
                            "Letter of Recommendation",
                            "Loan Eligibility",
                            "Abroad Cost Estimator",
                            "DocuCheck",
                          ].map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-[#BE243C]"
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                              />
                              <span className="ml-2 text-gray-700">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {selectedOptions.length === 2 && (
                        <p className="text-sm text-red-500">
                          Please select either 1 or 3 options.
                        </p>
                      )}
                      <motion.button
                        type="submit"
                        className={`w-full px-6 py-3 text-white rounded-full font-medium transition-colors duration-200 ${
                          selectedOptions.length === 1 ||
                          selectedOptions.length === 3
                            ? "bg-[#BE243C] hover:bg-[#A61F35]"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        whileHover={
                          selectedOptions.length === 1 ||
                          selectedOptions.length === 3
                            ? { scale: 1.05 }
                            : {}
                        }
                        whileTap={
                          selectedOptions.length === 1 ||
                          selectedOptions.length === 3
                            ? { scale: 0.95 }
                            : {}
                        }
                        disabled={
                          selectedOptions.length !== 1 &&
                          selectedOptions.length !== 3
                        }
                      >
                        Submit
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <>
      {/* MOBILE VERSION */}
      <div className="w-full overflow-x-hidden md:hidden px-4 py-4">
        <div
          className="flex flex-col items-center justify-around w-full h-full"
          onMouseMove={handleMouseMove}
        >
          {cursorText && (
            <motion.div
              className="fixed text-sm font-bold px-2 py-1 rounded pointer-events-none z-50"
              style={{
                left: mousePosition.x + 10,
                top: mousePosition.y + 10,
                backgroundColor: cursorColor.bg,
                color: cursorColor.text,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {cursorText}
            </motion.div>
          )}
          <div
            className={`w-full items-center gap-5 flex-col justify-center flex ${
              isPopupOpen ? "blur-sm" : ""
            }`}
          >
            {/* Mobile Title */}
            <div className="text-center w-full mb-3">
              <h1 className="text-[18px] sm:text-[20px] font-bold leading-tight text-gray-900">
                Tools that decide your admit in your desired university
              </h1>
              <p className="text-[14px] sm:text-[16px] font-semibold flex flex-row items-center justify-center gap-1 mt-2">
                <span className="text-xs sm:text-sm font-normal text-gray-600">
                  Now At
                </span>
                <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent font-bold">
                  FREE OF COST
                </span>
              </p>
            </div>

            {/* Mobile Cards Grid - 2x2 layout */}
            <div className="w-full grid grid-cols-2 gap-3">
              {/* University Image Card */}
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={UnisImg || "/placeholder.svg"}
                  alt="Curated Universities"
                  width={420}
                  height={520}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 1 - Ultimate Guide */}
              <div
                className="aspect-[3/4] bg-[#f5f5f5] rounded-2xl overflow-hidden cursor-pointer relative shadow-md"
                onClick={() => handleCardClick(1)}
              >
                <Image
                  src={CardObjectImg1 || "/placeholder.svg"}
                  alt="The Ultimate Guide"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
                  <p className="text-[8px] text-gray-500 font-medium tracking-wider">
                    SECURE STEPS
                  </p>
                  <h2 className="font-bold text-[12px] text-gray-900">
                    The Ultimate Guide
                  </h2>
                  <p className="text-[9px] leading-tight text-gray-600 mt-0.5">
                    Solutions to 8000 plus questions (includes what every newbie needs to know about moving abroad)
                  </p>
                </div>
              </div>

              {/* Card 2 - SOP */}
              <div
                className="aspect-[3/4] bg-[#f5f5f5] rounded-2xl overflow-hidden cursor-pointer relative shadow-md"
                onClick={() => handleCardClick(2)}
              >
                <Image
                  src={CardObjectImg2 || "/placeholder.svg"}
                  alt="Statement of Purpose"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
                  <p className="text-[8px] text-gray-500 font-medium tracking-wider">
                    SECURE STEPS
                  </p>
                  <h2 className="font-bold text-[12px] text-gray-900">
                    Statement of Purpose
                  </h2>
                  <p className="text-[9px] leading-tight text-gray-600 mt-0.5">
                    We interviewed 456 universities and curated free templates for you.
                  </p>
                </div>
              </div>

              {/* Card 3 - LOR */}
              <div
                className="aspect-[3/4] bg-[#f5f5f5] rounded-2xl overflow-hidden cursor-pointer relative shadow-md"
                onClick={() => handleCardClick(3)}
              >
                <Image
                  src={CardObjectImg3 || "/placeholder.svg"}
                  alt="Letter of Recommendation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
                  <p className="text-[8px] text-gray-500 font-medium tracking-wider">
                    SECURE STEPS
                  </p>
                  <h2 className="font-bold text-[12px] text-gray-900">
                    Letter of Recommendation
                  </h2>
                  <p className="text-[9px] leading-tight text-gray-600 mt-0.5">
                    Get a template for every aspect with professional LOR examples.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Cards - Loan, Cost Estimator, DocuCheck */}
            <div className="w-full flex flex-col gap-3 mt-2">
              {/* Card 1 - Loan */}
              <div className="w-full">
                <CardWithAnimation
                  image={rec1}
                  title="Loan Eligibility"
                  description="Collateral free loans at just 8.5% in just a click."
                  showAnimation={true}
                  animationClass="animate-spin-ease-out-1"
                />
              </div>

              {/* Card 2 - Cost Estimator */}
              <Link
                href="/CostEstimator"
                className="block w-full hover:scale-[1.01] transition-transform"
              >
                <CardWithAnimation
                  image={rec2}
                  title="Cost Estimator"
                  description="Includes university fee, living & miscellaneous expense"
                  showAnimation={true}
                  animationClass="animate-spin-ease-out-2"
                />
              </Link>

              {/* Card 3 - DocuCheck */}
              <div className="w-full">
                <CardWithAnimation
                  image={rec3}
                  title="DocuCheck"
                  description="Verify Your Study Abroad Readiness!"
                  showAnimation={true}
                  animationClass="animate-spin-ease-out-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VERSION FROM SECOND FILE - EXACT COPY */}
      <section className="w-full min-w-full relative box-border overflow-x-hidden hidden md:block">
        <div
          className="w-screen flex py-6 md:py-12 lg:py-16 flex-col items-center gap-4 md:gap-6 justify-around"
          style={{
            width: "100vw",
            maxWidth: "100%",
            WebkitBoxSizing: "border-box",
            MozBoxSizing: "border-box",
            boxSizing: "border-box",
          }}
          onMouseMove={handleMouseMove}
        >
          {cursorText && (
            <motion.div
              className="fixed text-sm font-bold px-2 py-1 rounded pointer-events-none z-50"
              style={{
                left: mousePosition.x + 10,
                top: mousePosition.y + 10,
                backgroundColor: cursorColor.bg,
                color: cursorColor.text,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {cursorText}
            </motion.div>
          )}
          <div
            className={`w-full px-4 sm:px-6 md:px-8 lg:px-12 mx-auto flex flex-col items-center gap-4 md:gap-6 justify-center ${
              isPopupOpen ? "blur-sm" : ""
            }`}
          >
            <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
              {/* Left side image - takes 4 columns on desktop */}
              <div
                className="md:col-span-4 rounded-[30px] overflow-hidden"
                style={{ height: "fit-content", maxHeight: "600px" }}
              >
                <div className="relative" style={{ aspectRatio: "3.6/4" }}>
                  <Image
                    src={UnisImg_Ob || "/placeholder.svg"}
                    alt="University Selection Tool"
                    className="w-full h-full object-cover"
                    style={{ objectFit: "cover" }}
                    width={500}
                    height={567}
                  />
                  <div className="flex flex-col gap-1 text-white absolute bottom-0 left-0 right-0 pb-5 px-4 py-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <p className="text-xs">Secure steps</p>
                    <h2 className="font-semibold  md:text-base">
                      Curated Ideal Universities
                    </h2>
                    <p className="text-xs leading-tight md:w-[60%]">
                      Answer 6 Question in under 60 seconds, explore 600+
                      universities, and get your perfect 6. ALL BY YOURSELF!
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side content - takes 8 columns on desktop */}
              <div className="col-span-1 md:col-span-8 flex flex-col gap-4 md:gap-6 h-full">
                {/* Title section */}
                <h1 className="font-extrabold text-center text-[18px] md:text-[22px] lg:text-[26px] xl:text-[28px]">
                  Tools that decide your admit in your desired university
                  <p className="md:text-[22px] lg:text-[28px] xl:text-[32px] font-extrabold flex flex-row items-center justify-center">
                    <span className="text-xs md:text-sm lg:text-base font-normal lowercase text-black">
                      <span className="uppercase">N</span>ow&#160;
                      <span className="uppercase">A</span>t&#160;
                    </span>
                    <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block">
                      FREE OF COST
                    </span>
                  </p>
                </h1>

                {/* Cards grid - 3 columns on desktop */}
                <div className="grid grid-cols-3 gap-4 md:gap-6 w-full ">
                  {/* Desktop cards */}
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="w-full rounded-[12px] overflow-hidden cursor-pointer relative"
                      style={{ aspectRatio: "3/4" }}
                      onMouseEnter={() => handleCardHover(index)}
                      onMouseLeave={() => handleCardHover(0)}
                      onClick={() => handleCardClick(index)}
                    >
                      {/* Direct image implementation instead of TiltedCard for better control */}
                      <div className="w-full h-full bg-[#d3d3d3]">
                        <Image
                          src={
                            index === 1
                              ? GuideImg.src
                              : index === 2
                              ? SOPImg.src
                              : LORImg.src
                          }
                          alt={
                            index === 1
                              ? "The Ultimate Guide"
                              : index === 2
                              ? "Statement of Purpose"
                              : "Letter of Recommendation"
                          }
                          className="w-full h-full object-contain"
                          width={500}
                          height={700}
                          priority
                        />
                      </div>
                      {/* Text overlay only visible on medium screens, hidden on large screens */}
                      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white/80 md:block lg:hidden">
                        <p className="text-xs text-black font-light">
                          SECURE STEPS
                        </p>
                        <h2 className="font-semibold text-sm text-black">
                          {index === 1
                            ? "The Ultimate Guide"
                            : index === 2
                            ? "Statement of Purpose"
                            : "Letter of Recommendation"}
                        </h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-6 md:mt-10 ">
              <CardWithAnimation
                image={rec1}
                title="Loan Eligibility"
                description="Collateral free loans at just 8.5% in just a click."
                showAnimation={true}
                animationClass="animate-spin-ease-out-1"
              />
              {/* 👇 Wrap Cost Estimator Card with a Link */}
              <Link
                href="/CostEstimator"
                className="block hover:scale-[1.02] transition-transform"
              >
                <CardWithAnimation
                  image={rec2}
                  title="Cost Estimator"
                  description="Includes university fee, living & miscellaneous expense"
                  showAnimation={true}
                  animationClass="animate-spin-ease-out-2"
                />
              </Link>
              {/* <CostEstimatorPage/> */}
              <CardWithAnimation
                image={rec3}
                title="DocuCheck"
                description="Verify Your Study Abroad Readiness!"
                showAnimation={true}
                animationClass="animate-spin-ease-out-3"
              />
            </div>
          </div>
        </div>
      </section>
      <Popup />
    </>
  );
};

export default Cards;
