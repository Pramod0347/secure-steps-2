/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import previous from "@/app/assets/Previous.png";
import next from "@/app/assets/Next.png";
import MoneyPng from "@/app/assets/lenders/Money.png";
import Group from "@/app/assets/lenders/Group.png";

interface Loan {
  id: number;
  title: string;
  amount: number;
}

const LendersLoan = () => {
  
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    let isMounted = true;

    const fetchLoans = async () => {
      if (isLoading) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/lenders/loan?page=1&limit=10');
        
        if (!isMounted) return;
        
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        
        const data = await response.json();

        if (isMounted) {
          setLoans(Array.isArray(data) ? data : data.loans || []);
        
        }
      } catch (err) {
        console.error("Error fetching loans:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLoans();

    return () => {
      isMounted = false;
    };
  }, []);

  // Rest of the component remains unchanged
  const { totalPages, paginatedData } = useMemo(() => ({
    totalPages: Math.ceil(loans.length / itemsPerPage),
    paginatedData: loans.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }), [loans, currentPage, itemsPerPage]);

  const handlePrev = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handleLoanClick = useCallback((loanId: number) => {
    router.push(`/lenders/loan/${loanId}`);
  }, [router]);


  const PaginationDots = useMemo(() => (
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
  ), [currentPage, totalPages]);

  return (
    <div className="md:px-32 px-6 mb-20 pt-6 md:pt-32 flex flex-col gap-4 jakartha">
      <div className="justify-between md:items-center flex md:flex-row flex-col">
        <div>
          <h1 className="md:text-[40px] text-[32px] whitespace-nowrap font-bold">
            Top Loans
          </h1>
          <p className="text-[#BDBDBD] text-xs md:text-lg">
            Turpis facilisis tempor pulvinar in lobortis ornare magna.
          </p>
        </div>
        <div className="flex h-fit items-center justify-center gap-2 inter md:mt-2 text-[14px] md:text-[22px] bg-black w-fit mt-6 text-white rounded-xl px-6 py-2 md:py-1">
          <Image src={Group} className="w-4 md:w-6 h-fit" alt="" />
          <button>Compare</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 md:mt-0 mt-6 gap-10">
        {paginatedData.map((loan) => (
          <div
            key={loan.id}
            onClick={() => handleLoanClick(loan.id)}
            className="group overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer md:mt-20 rounded-[12px] relative flex w-[100%]"
          >
            <div className="flex-col items-start justify-start px-4 md:px-10 py-4 flex">
              <div className="relative items-start gap-4 justify-start flex">
                <Image
                  className="md:w-20 w-10 h-fit"
                  src={MoneyPng}
                  alt={loan.title}
                />
                <div className="flex flex-col items-start justify-center gap-2">
                  <h1 className="text-[34px] whitespace-nowrap lg:text-[25px] max-md:text-[18px] max-lg:text-[26px] max-xl:text-[30px] font-bold">
                    {loan.title}
                  </h1>
                  <p className="inter text-[16px] md:text-[30px] font-bold text-[#BF2D5D]">
                    ${loan.amount}
                  </p>
                  <div className="text-[14px] md:text-[22px] mt-1 md:mt-0 text-center bg-black w-fit text-white rounded-[19px] px-10 md:px-6 py-2 md:py-1">
                    Apply
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-10 mt-20">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={previous} className="w-8 h-full" alt="Previous" />
        </button>
        {PaginationDots}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={next} className="w-8 h-full" alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default LendersLoan;