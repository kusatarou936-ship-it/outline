import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, name, bio, links, created_at")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user: {
      ...profile,
      id: user.id,
      email: user.email,
    },
  });
}
