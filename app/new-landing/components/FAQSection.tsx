"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Course Site?",
      answer:
        "Course Site is a comprehensive online learning platform offering practical, project-based courses in web development and design. We provide high-quality content that's easy to understand and apply.",
    },
    {
      question: "Do you have refund policy?",
      answer:
        "Our Purchases happen through Whop. Whop has its own refund policy, which you can find on their website. We recommend reviewing their policy before making a purchase.",
    },
    {
      question: "Is the community supportive?",
      answer:
        "Yes! Our community is incredibly supportive. You'll connect with like-minded learners, get help from instructors, and share your progress with others on the same journey.",
    },
    {
      question: "Are there live classes or just recorded content?",
      answer:
        "We primarily offer recorded content that you can access anytime. However, we also host live Q&A sessions and workshops for our premium members.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
            Faq Hub
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-6 sm:mb-8 px-2">
          Frequently Asked Questions!
        </h2>

        {/* Contact Prompt */}
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Still Have Questions?
          </h3>
          <Link
            href="/contact"
            className="text-purple-600 hover:text-purple-500 transition-colors text-sm sm:text-base"
          >
            Contact Us, We are happy to help you
          </Link>

          {/* Profile Avatars */}
          <div className="flex -space-x-3 mt-4 sm:mt-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center text-base sm:text-lg shadow-md">
                🙂
              </div>
            ))}
          </div>

          <button className="mt-4 sm:mt-6 group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 text-sm sm:text-base">
            Start Learning Now
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </button>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className={`rounded-2xl border transition-all duration-300 ${
                  openIndex === index
                    ? "bg-gray-50 border-gray-300"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-gray-900 font-semibold text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
