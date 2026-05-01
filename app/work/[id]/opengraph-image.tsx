import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage({ params }: any) {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  const res = await fetch(`${API}/api/work/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "black",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
          }}
        >
          Work Not Found
        </div>
      ),
      size
    );
  }

  const work = await res.json();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "black",
          color: "white",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 600 }}>{work.title}</div>
        <div style={{ fontSize: 32, opacity: 0.7 }}>{work.catch}</div>
      </div>
    ),
    size
  );
}
