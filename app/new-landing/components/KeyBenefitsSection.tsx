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
        "Get the best Experience knowing that our Courses are built by Professionals.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Completion Certificate",
      description:
        "Receive a Completion Award from our Team to enhance your motivation.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Instant Chat Help",
      description:
        "Have questions? Reach out for a quick chat—here for you 24/7.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Lifetime Membership",
      description:
        "With Just One Payment, you'll get Permanent Access to the Course.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Access to Community",
      description:
        "Join Our Private Community to Connect with Like-Minded Individuals.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Download for Offline Use",
      description:
        "Our courses can be downloaded, so you can watch them anytime, anywhere.",
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
          Key Benefits of Courses
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10 sm:mb-16 text-sm sm:text-base px-2">
          Explore the incredible advantages of enrolling in our courses and
          enhancing your skills for the ultimate career success.
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
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200 p-5 sm:p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Background Gradient */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.gradient} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`}
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
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefitsSection;
