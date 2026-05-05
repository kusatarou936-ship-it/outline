"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createApiClient(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    }
  );
}
