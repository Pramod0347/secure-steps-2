"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter Plan",
      price: "₹1,497",
      subtitle: "One session only",
      features: [
        "One to one counselling",
        "45 mins of Clarity",
        "Unleashing your potentials",
        "Live chat support",
      ],
      highlight: "",
      popular: false,
      gradient: "from-gray-500 to-gray-600",
    },
    {
      name: "Pro Plan",
      price: "₹29,997",
      subtitle: "Start to End",
      features: [
        "One to one counselling",
        "What’s next action plan",
        "Prism test",
        "Portfolio",
        "ATS Reviewed CV",
        "2 Ivy leagues & 3 tier 2 applications",
        "Live chat support",
      ],
      highlight: "Goodies worth ₹6,499",
      popular: true,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Ultra premium",
      price: "₹48,567",
      subtitle: "Start to Above & Beyond",
      features: [
        "One to one counselling",
        "What’s next action plan",
        "Prism test",
        "Portfolio",
        "ATS Reviewed CV",
        "5 Ivy leagues",
        "Live chat support",
        "60 min connect with industry professional",
      ],
      highlight: "Goodies worth ₹14,999",
      popular: false,
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <section className="brand-section-bg py-12 sm:py-16 lg:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-3 px-2">
          Join our exclusive What&apos;s next CLUB
        </h2>

        <p className="text-center text-gray-700 text-lg sm:text-2xl mb-6 sm:mb-8">
          Opted by 162 students
        </p>

        {/* Trust Badge */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-10 sm:mb-16 px-2">
          <span className="text-gray-600 text-xs sm:text-sm">Trusted by 7k+ students</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-gray-600 text-sm">4.8/5</span>
          <span className="text-gray-400 text-sm">54 Reviews</span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium z-10">
                  Popular Plan
                </div>
              )}

              <div
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 sm:p-8 h-full ${
                  plan.popular
                    ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                    : "bg-white border-gray-200"
                } hover:shadow-xl transition-all duration-300 text-left flex flex-col`}
              >
                {/* Plan Name */}
                <div className="text-gray-500 text-sm mb-4">{plan.name}</div>

                {/* Price */}
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">{plan.price}</div>

                <div className="text-gray-500 text-base mb-8">{plan.subtitle}</div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 leading-relaxed">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {plan.highlight && (
                    <p className="text-gray-500 text-sm mb-6">{plan.highlight}</p>
                  )}

                  <button
                    className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
