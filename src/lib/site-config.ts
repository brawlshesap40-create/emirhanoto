const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

if (process.env.NODE_ENV === "production" && siteUrl.includes("localhost")) {
  // Sitemap, canonical ve OG URL'leri buradan turetiliyor; production'da
  // localhost sizmisse tum bu baglantilar bozuk olur.
  console.error(
    "[site-config] NEXT_PUBLIC_SITE_URL production'da localhost olarak ayarli. " +
      "Yayin ortaminda gercek alan adinizi ayarlayin."
  );
}

export const siteConfig = {
  siteUrl,
  name: "Emirhan Otomotiv",
  slogan: "Güvenle Al, Sat, Kirala",
  description:
    "36 yıllık tecrübemizle İstanbul Bağcılar'da güvenilir araç alım satımında yanınızdayız.",
  phoneDisplay: "0555 993 71 17",
  phoneHref: "tel:+905559937117",
  whatsappNumber: "905559937117",
  email: "emirhan_otomotiv@hotmail.com",
  address: "Bağcılar, İstanbul",
  workingHours: "09:00 - 18:00",
  mapsUrl: "https://share.google/egeE5HdjIiUBUcFGU",
  yearsOfExperience: 36,
};

export function buildWhatsAppUrl(message: string) {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${siteConfig.whatsappNumber}?${params.toString()}`;
}

export function buildOrganizationJsonLd() {
  return {
    "@type": "AutomotiveBusiness",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    telephone: siteConfig.phoneHref.replace("tel:", ""),
    email: siteConfig.email,
    image: `${siteConfig.siteUrl}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bağcılar",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    openingHours: `Mo-Su ${siteConfig.workingHours}`,
  };
}
