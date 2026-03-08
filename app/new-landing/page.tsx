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
} from "./components";

export default function NewLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <StatsSection />
      <FinalCTASection />
      <InteractiveFeaturesSection />
      <CompanyLogosSection />
      <FeaturedCoursesSection />
      <TestimonialsSection />
      <KeyBenefitsSection />
      <PricingSection />
      <AboutSection />
      <FAQSection />
      <CourseTopicsSection />
      <CommunitySection />
    </main>
  );
}
