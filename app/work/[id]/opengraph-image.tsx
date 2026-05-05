import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase";

export const runtime = "edge";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: work } = await supabase
    .from("works")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!work) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "black",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          作品が見つかりません
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

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
          position: "relative",
          fontSize: 64,
          fontWeight: 600,
          padding: "40px",
        }}
      >
        {work.thumbnail_url && (
          <img
            src={work.thumbnail_url}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.25,
            }}
          />
        )}

        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "80%",
          }}
        >
          {work.title ?? "作品"}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

// ★★★ これが無いとビルドは絶対通らない ★★★
export default function OpengraphImage() {
  return null;
}
