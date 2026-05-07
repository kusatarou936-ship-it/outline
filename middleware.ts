import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken =
    req.cookies.get("sb-access-token")?.value ||
    req.cookies.get("__Host-sb-access-token")?.value;

  if (!accessToken && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|login|signup|public).*)",
  ],
};
