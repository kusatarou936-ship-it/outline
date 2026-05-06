import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      name: "sb",
      lifetime: 60 * 60 * 24 * 7,
      domain: process.env.NEXT_PUBLIC_SITE_DOMAIN,
      path: "/",
      sameSite: "none",
      secure: true,
    },
  }
);
