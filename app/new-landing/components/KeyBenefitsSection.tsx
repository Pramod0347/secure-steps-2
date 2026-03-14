"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  MessageCircle,
  Crown,
  Download,
  Briefcase,
} from "lucide-react";

const KeyBenefitsSection = () => {
  const benefits = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Built by Professionals",
      description:
        "Guaranteed best experience, as all your roadmaps and career trajectories are only suggested by industry professionals.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "6 Months Knowledge Transfer",
      description:
        "We don\u2019t just talk to you once and make an application \u2014 it\u2019s a continuous period of knowledge, insights on your future, and helping you acquire multiple skills.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Instant Chat Help",
      description:
        "Have questions? Reach out for a quick chat, typical reply within 10\u201315 mins.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "A Lifetime Membership",
      description:
        "Once a member, always a member of Secure. Reach out to us for any questions on the next phase of your life and get access to unlimited resources on our platform.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Better Together Community",
      description:
        "One problem, multiple perspectives, quicker solution \u2014 join our broadcast channel to receive continuous updates on student life. There are like-minded individuals you can connect with.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Completion Certificate",
      description:
        "Receive a verified completion certificate from our team to boost your profile and enhance your motivation.",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
            Benefits
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 sm:mb-6 px-2">
          Key Benefits of Secure&apos;s What&apos;s Next
        </h2>

        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 sm:mb-16 text-sm sm:text-base px-2">
          Explore the incredible advantages of enrolling in our packages and see how enhancing
          your skills with different perspectives can lead to ultimate career success.
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group h-full"
            >
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200 p-5 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {/* Background Gradient */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.gradient} opacity-10 blur-3xl transition-opacity`}
                />

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${benefit.gradient} mb-4 sm:mb-6 text-white`}
                >
                  {benefit.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base flex-1">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefitsSection;
