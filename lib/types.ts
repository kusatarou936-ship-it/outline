// Work（作品）
export type WorkStatus = "prototype" | "beta" | "release";

export type Work = {
  id: string;
  user_id: string;
  title: string;
  catch: string;
  url: string;
  purpose: string;
  target: string;
  focus: string;
  status: WorkStatus;
  stack: string[];
  github: string | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  auto?: AutoMetrics; // 後で自動解析を入れる
};

// 自動解析（auto_metrics）
export type AutoMetrics = {
  performance: number | null;
  a11y: number | null;
  mobile: number | null;
  ssl: boolean | null;
  i18n: boolean | null;
  detected_stack: string[] | null;
};

// User（ユーザー）
export type User = {
  id: string;
  name: string;
  bio: string;
  links: string[];
};
