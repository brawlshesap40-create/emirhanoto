import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { TrustSection } from "@/components/site/trust-section";
import { CategoryShortcuts } from "@/components/site/category-shortcuts";
import { FeaturedVehiclesSection } from "@/components/vehicles/featured-vehicles-section";
import { BrandStrip } from "@/components/site/brand-strip";
import { ServicesSection } from "@/components/site/services-section";
import { FaqSection } from "@/components/site/faq-section";
import { buildOrganizationJsonLd, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} | ${siteConfig.slogan}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    ...buildOrganizationJsonLd(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
