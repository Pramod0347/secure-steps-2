"use client";

import {
  HeroSection,
  StatsSection,
  CompanyLogosSection,
  FeaturedCoursesSection,
  TestimonialsSection,
  KeyBenefitsSection,
  PricingSection,
  FAQSection,
  CourseTopicsSection,
  CommunitySection,
  FinalCTASection,
  InteractiveFeaturesSection,
  LeapOfFaithSection,
} from "./new-landing/components";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <CourseTopicsSection />
      <FinalCTASection />
      <InteractiveFeaturesSection />
      <StatsSection />
      <CompanyLogosSection />
      <FeaturedCoursesSection />
      <LeapOfFaithSection />
      <TestimonialsSection />
      <KeyBenefitsSection />
      <PricingSection />
      <CommunitySection />
      <FAQSection />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-14 sm:hidden bg-white/25 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)]"
      />
    </main>
  );
}
