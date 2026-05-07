import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken =
    req.cookies.get("sb-access-token")?.value ||
    req.cookies.get("__Host-sb-access-token")?.value;

  if (!accessToken) {
    const redirectTo = req.nextUrl.pathname + req.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?redirectTo=${redirectTo}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/submit/:path*"],
};
