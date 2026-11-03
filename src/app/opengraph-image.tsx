import { ImageResponse } from "next/og";

export const alt = "TAXI_MEX · Taxi seguro en la CDMX con tarifa cerrada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share image for every page that doesn't define its own. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          color: "#f6f4f2",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              background: "#ffc107",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M4 15h16v-4l-2.6-4.1a2 2 0 0 0-1.7-.9H8.3a2 2 0 0 0-1.7.9L4 11Z" fill="#111" />
              <rect x="9.2" y="2.4" width="5.6" height="2.6" rx="0.8" fill="#111" />
              <circle cx="7.8" cy="16.6" r="1.9" fill="#111" />
              <circle cx="16.2" cy="16.6" r="1.9" fill="#111" />
            </svg>
          </div>
          <div style={{ fontSize: 48, fontWeight: 800 }}>TAXI_MEX</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}>
            TAXI SEGURO
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1,
              color: "#ffc107",
            }}
          >
            EN LA CDMX
          </div>
          <div style={{ marginTop: 32, fontSize: 34, color: "#a3a3a8" }}>
            Tarifa cerrada · Conductores verificados · 24/7
          </div>
        </div>
      </div>
    ),
    size,
  );
}
