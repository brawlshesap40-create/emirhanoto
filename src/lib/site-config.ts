export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
