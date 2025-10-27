import React, { useState } from "react";
import { PricingPlan } from "./type";


// Price Component
const Price: React.FC<{ pricingPlans: PricingPlan[] }> = ({ pricingPlans }) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const displayPlans = pricingPlans.map(plan => ({
    title: plan.type,
    price: billingCycle === "monthly" ? plan.price : plan.price * 12,
    period: billingCycle === "monthly" ? "month" : "year"
  }));

  return (
    <div className="w-screen">
      <div className="jakartha flex mt-28 flex-col gap-14 py-14 rounded-2xl items-center justify-center border-2 md:w-[80%] mx-auto w-[75%] border-[#B81D24]">
        <div className="text-lg">
          <button
            className={`rounded-md px-4 py-1 ${billingCycle === "monthly" ? "bg-[#F6F6F6]" : ""}`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`rounded-md px-4 py-1 ${billingCycle === "yearly" ? "bg-[#F6F6F6]" : ""}`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
          </button>
        </div>
        <div className="flex md:flex-row flex-col md:px-0 px-4 w-full justify-center gap-6 md:gap-10">
          {displayPlans.map((plan, index) => (
            <div
              key={index}
              className={`
                text-[#1C1C1C] 
                ${index === 0 ? "pl-5 pr-24" : index === 1 ? "pl-5 pr-24" : "pl-6 pr-24"}
                md:py-8 py-4 rounded-lg border-[#D2D3D3] border
              `}
            >
              <h1 className={`${index === 2 ? "font-medium text-md" : "text-lg"}`}>
                {plan.title}
              </h1>
              <h2 className="text-4xl whitespace-nowrap font-bold">
                ₹ {plan.price} <span className="text-xs font-normal">/ {plan.period}</span>
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Price;

