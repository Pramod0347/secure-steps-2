"use client";

import {
  HeroSection,
  StatsSection,
  CompanyLogosSection,
  FeaturedCoursesSection,
  TestimonialsSection,
  KeyBenefitsSection,
  PricingSection,
  AboutSection,
  FAQSection,
  CourseTopicsSection,
  CommunitySection,
  FinalCTASection,
  InteractiveFeaturesSection,
  LeapOfFaithSection,
} from "./components";

export default function NewLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <AboutSection />
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
    </main>
  );
}
