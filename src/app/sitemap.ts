import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await db.query.vehicles.findMany({
    columns: { slug: true, updatedAt: true },
  });
  const rentalVehicles = await db.query.rentalVehicles.findMany({
    columns: { slug: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/araclarimiz`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/kiralama`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/iletisim`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `${siteConfig.siteUrl}/araclarimiz/${vehicle.slug}`,
    lastModified: vehicle.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const rentalVehicleRoutes: MetadataRoute.Sitemap = rentalVehicles.map((vehicle) => ({
    url: `${siteConfig.siteUrl}/kiralama/${vehicle.slug}`,
    lastModified: vehicle.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...vehicleRoutes, ...rentalVehicleRoutes];
}
