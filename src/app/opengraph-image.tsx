import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} - ${siteConfig.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Kucuk, onceden boyutlandirilmis bir kopya kullaniyoruz: satori/resvg
  // orijinal 960x1020'lik logo.png'yi "Input buffer contains unsupported
  // image format" hatasiyla reddediyordu.
  const logoData = await readFile(join(process.cwd(), "public", "og-logo.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          background: "#1F2D20",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={140} height={140} alt="" />
        <div style={{ display: "flex", marginTop: 40, fontSize: 64, fontWeight: 700 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 34,
            fontWeight: 600,
            color: "#a7003b",
          }}
        >
          {siteConfig.slogan}
        </div>
      </div>
    ),
    { ...size }
  );
}
