import BrowseSection from "../components/Connect/Revamp/BrowseSection";
import ConnectStyles from "../components/Connect/Revamp/ConnectStyles";
import HeroSection from "../components/Connect/Revamp/HeroSection";
import HowSection from "../components/Connect/Revamp/HowSection";
import PricingSection from "../components/Connect/Revamp/PricingSection";
import ReviewsSection from "../components/Connect/Revamp/ReviewsSection";

export default function ConnectPage() {
  return (
    <main>
      <HeroSection />
      <HowSection />
      <ReviewsSection />
      <BrowseSection />
      <PricingSection />
      <ConnectStyles />
    </main>
  );
}
