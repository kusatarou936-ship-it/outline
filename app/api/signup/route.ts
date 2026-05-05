import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const supabase = createClient();

  const { email, password, name } = await req.json();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase
    .from("users")
    .insert({
      id: userId,
      name: name ?? "No Name",
      bio: "",
      links: [],
    });

  if (profileError) {
    console.error(profileError);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    user: data.user,
    session: data.session,
  });
}
