import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const prompt = await db.prompt.findUnique({
    where: { id },
    include: { author: { select: { name: true, username: true } } },
  });

  const question = prompt?.question ?? "See yourself the way others actually see you.";
  const author = prompt?.author?.name ?? "Do Güd";
  const username = prompt?.author?.username;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 12% 8%, rgba(174,189,157,0.45), transparent 45%), radial-gradient(circle at 92% 92%, rgba(217,154,138,0.35), transparent 45%), #fbf8f1",
          color: "#1f2018",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            fontSize: 36,
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8d8e7f",
              fontFamily: "sans-serif",
              margin: 0,
            }}
          >
            {author} is asking
          </p>
          <p
            style={{
              fontSize: 64,
              lineHeight: 1.1,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            “{question}”
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "sans-serif",
            fontSize: 22,
            color: "#3a3b30",
          }}
        >
          <span>
            {username ? `@${username}` : "do-gud.vercel.app"}
          </span>
          <span style={{ color: "#6e8761" }}>
            see yourself the way others see you
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
