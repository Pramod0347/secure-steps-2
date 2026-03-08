"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Clock, ExternalLink } from "lucide-react";

interface Course {
  id: string;
  name: string;
  description?: string;
  fees?: string;
  duration?: string;
  degreeType?: string;
  ieltsScore?: string;
  websiteLink?: string;
  university: {
    id: string;
    name: string;
    logoUrl?: string;
  };
}

const FeaturedCoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Gradient colors for cards
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-500",
    "from-rose-500 to-pink-500",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/universities/featured-courses');
        if (res.ok) {
          const data: Course[] = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fallback static data if no courses from DB
  const fallbackCourses: Course[] = [
    {
      id: "1",
      name: "MSc International Business",
      description: "A comprehensive program covering global business strategies, cross-cultural management, and international finance.",
      fees: "€18,500",
      duration: "12 Months",
      degreeType: "PG Degree",
      ieltsScore: "6.5",
      websiteLink: "https://neoma-bs.com",
      university: { id: "1", name: "NEOMA Business School", logoUrl: "" }
    },
    {
      id: "2", 
      name: "MBA Full-Time",
      description: "Transform your career with our globally recognized MBA program featuring real-world consulting projects.",
      fees: "£47,500",
      duration: "12 Months",
      degreeType: "PG Degree",
      ieltsScore: "7.0",
      websiteLink: "https://www.wbs.ac.uk",
      university: { id: "2", name: "Warwick Business School", logoUrl: "" }
    },
    {
      id: "3",
      name: "MS Computer Science",
      description: "Advance your tech career with cutting-edge curriculum in AI, machine learning, and software engineering.",
      fees: "$26,640",
      duration: "24 Months",
      degreeType: "PG Degree",
      ieltsScore: "6.5",
      websiteLink: "https://www.pnw.edu",
      university: { id: "3", name: "Purdue University Northwest", logoUrl: "" }
    },
  ];

  const displayCourses = courses.length > 0 ? courses : fallbackCourses;

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm">
            <GraduationCap className="w-4 h-4 text-purple-500" />
            In Demand Programs
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
          Programs with highest ROI
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10 sm:mb-16 text-sm sm:text-base px-2">
          Every program is selected based on employability, market demand, and
          long-term career scalability.
        </p>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {displayCourses.slice(0, 6).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link 
                  href={course.websiteLink || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 h-full">
                    {/* Course Banner */}
                    <div
                      className={`h-32 sm:h-40 bg-gradient-to-br ${gradients[index % gradients.length]} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/10" />
                      {/* University badge */}
                      <div className="absolute top-4 left-4 right-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-gray-900 text-xs font-medium shadow-sm">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold">
                            {course.university.name.charAt(0)}
                          </div>
                          {course.university.name}
                        </span>
                      </div>
                      {/* External link icon */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-white/90 rounded-full">
                          <ExternalLink className="w-4 h-4 text-gray-700" />
                        </div>
                      </div>
                      {/* Degree type badge */}
                      <div className="absolute bottom-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 text-xs font-medium">
                          {course.degreeType || "PG Degree"}
                        </span>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {course.name}
                      </h3>

                      {course.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                      )}

                      {/* Course Details */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {course.duration && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </span>
                        )}
                        {course.fees && (
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            {course.fees}
                          </span>
                        )}
                        {course.ieltsScore && (
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                            IELTS: {course.ieltsScore}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
                        View Program Details
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/select"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore All Programs
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;
