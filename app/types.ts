export type Work = {
  id: string;
  type: "external" | "internal";
  title: string;
  description: string | null;
  author_name: string | null;
  created_at: string;
  thumbnail_url: string | null;
  url: string | null;
  body_markdown: string | null;
  tags: string[] | null;
  is_author: boolean;
  short_id: string;              // ← 必須（内部生成作品の URL に使う）
  visibility?: "public" | "private"; // ← 作品ページで使う
  advice?: {
    description: string | null;
    tags: string | null;
    thumbnail: string | null;
    strengths: string | null;
    confusion: string | null;
  } | null;
};
