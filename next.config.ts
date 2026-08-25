import type { NextConfig } from "next";

const LOCAL_MINIO_PATTERN = {
  protocol: "http" as const,
  hostname: "localhost",
  port: "9000",
  pathname: "/emirhanoto/**",
};

function s3PublicUrlPattern() {
  const publicUrl = process.env.S3_PUBLIC_URL;
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: `${url.pathname === "/" ? "" : url.pathname}/**`,
    };
  } catch {
    return null;
  }
}

const remotePattern = s3PublicUrlPattern();

const UNSPLASH_PATTERN = {
  protocol: "https" as const,
  hostname: "images.unsplash.com",
};

const isDev = process.env.NODE_ENV === "development";

// next/image serves optimized images through the same-origin /_next/image
// proxy, so the browser never fetches S3/MinIO/Unsplash URLs directly —
// but brand-strip.tsx renders external brand-logo images via plain <img>
// tags (not next/image), so carlogos.org needs an explicit img-src entry.
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
  images: {
    remotePatterns: [
      ...(remotePattern && remotePattern.hostname !== "localhost"
        ? [remotePattern]
        : [LOCAL_MINIO_PATTERN]),
      UNSPLASH_PATTERN,
    ],
  },
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
