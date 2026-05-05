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
  short_id: string;
  visibility: "public" | "private" | "unlisted";  // ← これ
  advice?: {
    description: string | null;
    tags: string | null;
    thumbnail: string | null;
    strengths: string | null;
    confusion: string | null;
  } | null;
};

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  reply_to: string | null;
  replies: Comment[];   // ← これが必要
};
