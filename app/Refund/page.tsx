"use client";

import React from "react";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 pt-20 md:pt-36 pb-16">
      <section className=" px-6 py-16">
        
        {/* Heading */}
        <h1 className="relative text-[32px] font-bold text-gray-900 w-fit mb-10">
          Refund & Cancellation Policy
          <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#9C1B3C]"></span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-[20px] font-semibold text-gray-700 mb-6">
          SECURE STEPS – REFUND & CANCELLATION POLICY
        </h2>

        <div className="space-y-10 leading-[1.85] text-[16px]">
          
          {/* 1. Non-Refundable Services */}
          <div>
            <h3 className="text-[18px] font-semibold text-gray-900 mb-3">1. Non-Refundable Services</h3>
            <p>
              All service fees paid to the Company are non-refundable in the event of a change in plans, 
              personal decisions, or any other circumstances on the part of the Client.
            </p>
          </div>

          {/* 2. Refund Eligibility */}
          <div>
            <h3 className="text-[18px] font-semibold text-gray-900 mb-3">2. Refund Eligibility</h3>
            <p>
              Refunds shall be issued only in cases of verified errors or duplicate payments received 
              by the Company within 6 to 7 working days.
            </p>
          </div>

          {/* 3. Session Rescheduling */}
          <div>
            <h3 className="text-[18px] font-semibold text-gray-900 mb-3">3. Session Rescheduling</h3>
            <p>
              One complimentary reschedule is provided. Further rescheduling may attract a fee or may not be permitted.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
