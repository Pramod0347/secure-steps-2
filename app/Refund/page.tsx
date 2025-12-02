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
          
          {/* 1. Refund Eligibility */}
          <div>
            <h3 className="text-[18px] font-semibold text-gray-900 mb-3">1. Refund Eligibility</h3>
            <p>
              Refunds may only be requested by emailing 
              <span className="font-semibold text-[#9C1B3C]"> info@securesteps.co.in</span>.
              Refunds are issued only if requested within 24 hours of payment AND if no counselling,
              document review, or preparatory work has commenced.
            </p>
          </div>

          {/* 2. Non-Refundable Scenarios */}
          <div>
            <h3 className="text-[18px] font-semibold text-gray-900 mb-3">2. Non-Refundable Scenarios</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Missed or delayed sessions</li>
              <li>Change of mind after service initiation</li>
              <li>User-caused delays</li>
              <li>Completed document reviews</li>
              <li>Any work already allocated to counsellors/editors</li>
            </ul>
          </div>

          {/* 3. Duplicate & Technical Refunds */}
          <div>
            <h3 className="text-[18px] font-semibold text-gray-900 mb-3">3. Duplicate & Technical Refunds</h3>
            <p>
              Gateway-related errors or duplicate payments are fully refunded after verification.
            </p>
          </div>

          {/* 4. Timeline */}
          <div>
            <h3 className="text-[18px] font-semibold text-gray-900 mb-3">4. Timeline</h3>
            <p>
              Refunds are processed within 5–7 business days.
            </p>
          </div>

          {/* 5. Session Rescheduling */}
          <div>
            <h3 className="text-[18px] font-semibold text-gray-900 mb-3">5. Session Rescheduling</h3>
            <p>
              One complimentary reschedule is provided. Further rescheduling may attract a fee or may not be permitted.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
