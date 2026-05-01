import { cookies } from "next/headers";

export async function getUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const API = process.env.NEXT_PUBLIC_API_BASE;

  const res = await fetch(`${API}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return await res.json();
}
