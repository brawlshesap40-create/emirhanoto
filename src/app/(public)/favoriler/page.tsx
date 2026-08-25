import type { Metadata } from "next";
import { FavoritesPageClient } from "@/components/site/favorites-page-client";

export const metadata: Metadata = {
  title: "Favorilerim",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
