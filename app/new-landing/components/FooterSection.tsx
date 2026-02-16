"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const FooterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">CourseSite</h3>
            <p className="text-gray-600 max-w-sm">
              Practical project-based courses that are easy to understand,
              straight to the point, and free of distractions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Benefits</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/courses"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">
              Join Our Newsletter
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
              />
              <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            CourseSite © 2025. All rights reserved.
          </p>

          {/* Scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
