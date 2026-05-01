import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage({ params, searchParams }: any) {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  const tag = decodeURIComponent(params.name);
  const type = searchParams.type || "stack";

  const res = await fetch(
    `${API}/api/tag?tag=${encodeURIComponent(tag)}&type=${type}`,
    { cache: "no-store" }
  );

  const items = res.ok ? await res.json() : [];

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
        <div style={{ fontSize: 56, fontWeight: 600 }}>{tag}</div>
        <div style={{ fontSize: 32, opacity: 0.7 }}>
          {items.length} works
        </div>
      </div>
    ),
    size
  );
}
