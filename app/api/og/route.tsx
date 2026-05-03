import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          padding: 80,
          background:
            "radial-gradient(circle at 12% 8%, rgba(174,189,157,0.45), transparent 45%), radial-gradient(circle at 92% 92%, rgba(217,154,138,0.35), transparent 45%), #fbf8f1",
          color: "#1f2018",
          fontFamily: "serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            fontSize: 56,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ fontWeight: 600 }}>Do</span>
          <span
            style={{
              fontWeight: 600,
              color: "#4a5e40",
              fontStyle: "italic",
            }}
          >
            Güd
          </span>
        </div>
        <p
          style={{
            fontSize: 64,
            lineHeight: 1.1,
            margin: 0,
            maxWidth: 900,
            fontStyle: "italic",
          }}
        >
          See yourself the way others actually see you.
        </p>
        <p
          style={{
            fontSize: 22,
            color: "#3a3b30",
            fontFamily: "sans-serif",
            margin: 0,
          }}
        >
          A reflection platform built on specific, honest affirmation.
        </p>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
