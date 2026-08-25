import { Hero } from "@/components/site/hero";
import { TrustSection } from "@/components/site/trust-section";
import { CategoryShortcuts } from "@/components/site/category-shortcuts";
import { FeaturedVehiclesSection } from "@/components/vehicles/featured-vehicles-section";
import { BrandStrip } from "@/components/site/brand-strip";
import { ServicesSection } from "@/components/site/services-section";
import { FaqSection } from "@/components/site/faq-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <CategoryShortcuts />
      <FeaturedVehiclesSection />
      <BrandStrip />
      <ServicesSection />
      <FaqSection />
    </>
  );
}
