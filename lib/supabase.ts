import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookieOptions: {
      name: "sb",
      domain: process.env.NEXT_PUBLIC_SITE_DOMAIN,
      path: "/",
      sameSite: "none",
      secure: true,
    },
  }
);
