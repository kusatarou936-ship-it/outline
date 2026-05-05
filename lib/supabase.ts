// lib/supabase.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,   // ← これが絶対必要
        autoRefreshToken: false, // ← Edge Runtime では無効
      },
    }
  );
}
