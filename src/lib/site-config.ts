export const siteConfig = {
  name: "Emirhan Otomotiv",
  slogan: "Çift Kabinde Öncü",
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
