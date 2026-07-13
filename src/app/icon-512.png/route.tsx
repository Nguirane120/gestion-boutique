import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const SIZE = 512;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10b981",
          fontSize: SIZE * 0.5,
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        K
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
