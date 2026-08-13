import { Hero } from "@/components/site/hero";
import { TrustSection } from "@/components/site/trust-section";
import { FeaturedVehiclesSection } from "@/components/vehicles/featured-vehicles-section";
import { BrandStrip } from "@/components/site/brand-strip";
import { ServicesSection } from "@/components/site/services-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <FeaturedVehiclesSection />
      <BrandStrip />
      <ServicesSection />
    </>
  );
}
