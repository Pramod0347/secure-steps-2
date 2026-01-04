"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/app/components/Select/Profile/Hero";
import Gallery from "@/app/components/Select/Profile/Gallery";
import Courses from "@/app/components/Select/Profile/Courses";
import StudentReviewCarousel from "@/app/components/Select/Profile/StudentsReview";
import {
  useUniversitySelectors,
  useUniversityActions,
  type UniversityInterface,
} from "@/store/universitystore";
import FAQ from "./FAQ";
import UniversityCareerOutcomes from "./UniversityCareer";
import AlumniSection from "./Alumini";
import CompaniesSection from "./CompaniesSection";

interface UniversityPageClientProps {
  slug: string;
}

// Loading skeleton component
const UniversityPageSkeleton = () => (
  <main className="min-h-screen w-full">
    <div className="w-full flex flex-col items-center justify-center space-y-8 p-4">
      {/* Hero skeleton */}
      <div className="w-full max-w-6xl h-64 md:h-80 lg:h-96 animate-pulse bg-gray-200 rounded-lg"></div>

      {/* Student reviews skeleton */}
      <div className="w-full max-w-6xl h-64 animate-pulse bg-gray-200 rounded-lg"></div>

      {/* Gallery skeleton */}
      <div className="w-full max-w-6xl h-96 animate-pulse bg-gray-200 rounded-lg"></div>

      {/* Courses skeleton */}
      <div className="w-full max-w-6xl h-96 animate-pulse bg-gray-200 rounded-lg"></div>
    </div>
  </main>
);

export default function UniversityPageClient({
  slug,
}: UniversityPageClientProps) {
  const router = useRouter();
  const [university, setUniversity] = useState<UniversityInterface | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { universities, universityDetails, hasHydrated } =
    useUniversitySelectors();
  const { fetchUniversityById, getUniversityById } = useUniversityActions();

  // Enhanced function to find university in different ways
  const findUniversityInStore = useCallback(
    (slug: string): UniversityInterface | null => {

      // Helper function to match university by different criteria
      const matchUniversity = (uni: UniversityInterface): boolean => {
        const matches = [
          uni.slug === slug,
          uni.id === slug,
          uni.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase(),
          uni.name.toLowerCase().replace(/[^a-z0-9]/g, "-") ===
            slug.toLowerCase(),
          uni.name.toLowerCase() === slug.toLowerCase().replace(/-/g, " "),
        ];

        return matches.some((match) => match);
      };

      // First, try to find in the main universities list (from cache)
      const foundInMain = universities.find(matchUniversity);
      if (foundInMain) {
        return foundInMain;
      }

      // Second, try to find in university details cache
      const foundInDetails =
        Object.values(universityDetails).find(matchUniversity);
      if (foundInDetails) {
        return foundInDetails;
      }

      // Third, try to get by ID directly (if slug is an ID)
      const foundById = getUniversityById(slug);
      if (foundById) {
        return foundById;
      }

      return null;
    },
    [universities, universityDetails, getUniversityById]
  );

  // Enhanced API fetch function with better error handling for slug-based queries
  const fetchUniversityFromAPI = useCallback(
    async (slug: string): Promise<UniversityInterface | null> => {
      try {

        // Try different API endpoints - PRIORITIZING SLUG-BASED QUERIES
        const endpoints = [
          `/api/universities?slug=${encodeURIComponent(slug)}`,
          // `/api/universities/${encodeURIComponent(slug)}`,
          `/api/universities?id=${encodeURIComponent(slug)}`,
        ];

        for (const endpoint of endpoints) {
          try {

            const response = await fetch(endpoint, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });


            if (response.ok) {
              const data = await response.json();

              // Handle different response formats
              let university: UniversityInterface | null = null;

              if (data.university) {
                university = data.university;
              } else if (
                data.universities &&
                Array.isArray(data.universities) &&
                data.universities.length > 0
              ) {
                university = data.universities[0];
              } else if (data.id) {
                university = data;
              }

              if (university && university.id) {
                return university;
              }
            } else if (response.status === 404) {
              continue; // Try next endpoint
            } else {
              continue; // Try next endpoint
            }
          } catch (endpointError) {
            continue; // Try next endpoint
          }
        }

        return null;
      } catch {
        return null;
      }
    },
    []
  );

  // Main effect to find and load university
  useEffect(() => {
    const loadUniversity = async () => {

      // Wait for store hydration
      if (!hasHydrated) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Step 1: Try to find in store first
        const foundUniversity = findUniversityInStore(slug);

        if (foundUniversity) {
          setUniversity(foundUniversity);
          setIsLoading(false);
          return;
        }

        // Step 2: Try using the store's fetchUniversityById method (now optimized for slugs)
        const storeResult = await fetchUniversityById(slug);

        if (storeResult) {
          setUniversity(storeResult);
          setIsLoading(false);
          return;
        }

        // Step 3: Try direct API call as fallback
        const apiResult = await fetchUniversityFromAPI(slug);

        if (apiResult) {
          setUniversity(apiResult);
          setIsLoading(false);
          return;
        }

        // Step 4: If still not found, set error
        setError("University not found");
      } catch {
        setError("Failed to load university details");
      } finally {
        setIsLoading(false);
      }
    };

    loadUniversity();
  }, [
    slug,
    hasHydrated,
    findUniversityInStore,
    fetchUniversityById,
    fetchUniversityFromAPI,
  ]);

  // Show loading skeleton while loading or before hydration
  if (!hasHydrated || isLoading) {
    return <UniversityPageSkeleton />;
  }

  // Show error state
  if (error || !university) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error === "University not found"
              ? "University Not Found"
              : "Error Loading University"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === "University not found"
              ? `The university "${slug}" could not be found. It may have been removed or the URL is incorrect.`
              : `There was a problem loading the university details: ${error}`}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/select")}
              className="block w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Universities
            </button>
          </div>
        </div>
      </div>
    );
  }

  type ActualCareerOutcomeFromAPI = {
    id: string;
    type: "SALARY_CHART" | "EMPLOYMENT_RATE_METER" | "COURSE_TIMELINE";
    universityId: string;
    salaryChartData?: Array<{
      id: string;
      sector: string;
      min: number;
      max: number;
      color?: string;
      percentage?: number;
      careerOutcomeId: string;
    }>;
    employmentRateMeter?: {
      id: string;
      targetRate: number;
      size: number;
      careerOutcomeId: string;
    };
    courseTimelineData?: Array<{
      id: string;
      course: string;
      careerOutcomeId: string;
    }>;
  };

  const careerOutcomeData =
    university.careerOutcomes &&
    Array.isArray(university.careerOutcomes) &&
    university.careerOutcomes.length > 0
      ? (university.careerOutcomes[0] as unknown as ActualCareerOutcomeFromAPI)
      : null;

  // Show university details
  return (
    <main className="min-h-screen w-screen">
      <div className="w-full flex flex-col items-center justify-center">
        <Suspense
          fallback={
            <div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg"></div>
          }
        >
          <Hero university={university} />
        </Suspense>

        <Suspense
          fallback={
            <div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg"></div>
          }
        >
          <StudentReviewCarousel university={university} />
        </Suspense>

        <Suspense
          fallback={
            <div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg"></div>
          }
        >
          {careerOutcomeData ? (
            <UniversityCareerOutcomes universityData={careerOutcomeData} />
          ) : (
            <UniversityCareerOutcomes universityData={null} />
          )}
        </Suspense>

        <Suspense>
          <AlumniSection />
        </Suspense>
        <CompaniesSection/>
        <Suspense
          fallback={
            <div className="w-full h-96 animate-pulse bg-gray-200 rounded-lg"></div>
          }
        >
          <Gallery university={university} />
        </Suspense>

        <Suspense
          fallback={
            <div className="w-full h-96 animate-pulse bg-gray-200 rounded-lg"></div>
          }
        >
          <FAQ faqData={university.faqs} />
        </Suspense>

        <Suspense
          fallback={
            <div className="w-full h-96 animate-pulse bg-gray-200 rounded-lg"></div>
          }
        >
          <Courses university={university} />
        </Suspense>
      </div>
    </main>
  );
}
