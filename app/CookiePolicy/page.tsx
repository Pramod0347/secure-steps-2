"use client";

import React from "react";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 pt-28 md:pt-36 pb-16">
      <section className=" px-6 py-16">

        {/* Main Heading */}
        <h1 className="relative text-[32px] font-bold text-gray-900 w-fit mb-12">
          Cookie Policy & Disclaimer
          <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#9C1B3C]"></span>
        </h1>

        {/* Cookie Policy */}
        <div className="mb-14">
          <h2 className="text-[22px] font-semibold text-gray-900 mb-3">
            Cookie Policy
          </h2>
          <p className="text-[16px] leading-[1.85]">
            Secure Steps uses cookies to identify user preferences, improve
            website performance, understand visitor behaviour, analyse traffic,
            and personalise services. Cookies may include essential, performance,
            analytics, and advertising cookies.
          </p>

          <p className="text-[16px] leading-[1.85] mt-3">
            Users may disable cookies via browser settings; however, doing so may
            affect the Website’s functionality.
          </p>
        </div>

        {/* Disclaimer */}
        <div>
          <h2 className="text-[22px] font-semibold text-gray-900 mb-3">
            Disclaimer
          </h2>
          <p className="text-[16px] leading-[1.85]">
            Secure Steps is an educational advisory organisation. All guidance
            is provided based on experience and general best practices. Secure
            Steps does not guarantee any admission, visa approval, scholarship
            grant, loan approval, job placement, or immigration outcome. All
            decisions are made exclusively by universities, consulates, embassies,
            and independent bodies.
          </p>

          <p className="text-[16px] leading-[1.85] mt-3">
            Secure Steps is not responsible for losses arising from inaccurate
            information provided by the user, delays caused by third parties,
            changes in government policies, or external system failures.
          </p>
        </div>

      </section>
    </main>
  );
}
