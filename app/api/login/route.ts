import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const supabase = createClient();

  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: data.user,
    session: data.session,
  });
}
