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
};

export default nextConfig;
