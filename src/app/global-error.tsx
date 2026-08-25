"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[global-error]", error);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#16211a",
          color: "#f5f5f5",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#a7003b",
              marginBottom: 12,
            }}
          >
            Beklenmedik Hata
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>
            Sayfa yüklenirken bir sorun oluştu
          </h1>
          <p style={{ fontSize: 14, color: "#c7c7c7", lineHeight: 1.6, margin: "0 0 24px" }}>
            Bu durum kaydedildi. Lütfen tekrar deneyin; sorun devam ederse bizimle iletişime
            geçin.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#a7003b",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
