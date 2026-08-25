import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Araç fotoğrafları artık aynı origin'deki /uploads/* altında sunucu
// diskinden servis ediliyor, next/image bunun için ekstra remotePatterns
// gerektirmiyor. brand-strip.tsx ise external marka logolarını plain <img>
// (next/image değil) ile render ediyor, bu yüzden carlogos.org için ayrı
// bir img-src izni gerekiyor.
// The /iletisim page embeds a Google Maps iframe, so frame-src allows that
// one external origin. Next.js injects its own inline hydration/RSC
// bootstrap scripts with no nonce here, so script-src/style-src need
// 'unsafe-inline' (see Next's CSP guide, "Without Nonces" section) — a
// nonce-based strict CSP would require dynamic rendering on every page,
// which conflicts with the ISR work planned for the catalog pages.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://www.carlogos.org;
  font-src 'self' data:;
  connect-src 'self';
  frame-src 'self' https://www.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      // Araç/kiralama formlarında sınırsız sayıda fotoğraf eklenebilsin diye
      // varsayılan 1mb server action gövde limitini yükseltiyoruz.
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=15552000; includeSubDomains",
                },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;
