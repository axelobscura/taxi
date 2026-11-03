import { ImageResponse } from "next/og";
import CarIcon from "@/components/CarIcon";

export const alt = "TAXI-MEX · Taxi seguro en la CDMX con tarifa cerrada";
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
            <CarIcon size={60} />
          </div>
          <div style={{ fontSize: 48, fontWeight: 800 }}>TAXI-MEX</div>
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
