import type { Metadata } from "next";
import { ComparePageClient } from "@/components/vehicles/compare-page-client";

export const metadata: Metadata = {
  title: "Araçları Karşılaştır",
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return <ComparePageClient />;
}
