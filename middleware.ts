import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const access =
    req.cookies.get("sb-access-token")?.value ||
    req.cookies.get("__Host-sb-access-token")?.value;

  const refresh =
    req.cookies.get("sb-refresh-token")?.value ||
    req.cookies.get("__Host-sb-refresh-token")?.value;

  // redirectTo を安全に生成
  const redirectTo =
    req.nextUrl.pathname && !req.nextUrl.pathname.startsWith("/login")
      ? req.nextUrl.pathname + req.nextUrl.search
      : "/";

  if (!access && !refresh) {
    return NextResponse.redirect(
      new URL(`/login?redirectTo=${redirectTo}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/submit/:path*"],
};
