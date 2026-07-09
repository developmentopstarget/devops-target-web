import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/config";

// Note: Next.js 16 renamed `middleware.ts` to `proxy.ts` (same behavior, new name).
// This is an optimistic check only — it looks for the presence of the httpOnly auth
// cookie, not its validity. Real authorization still happens against the Django API.
//
// /checkout intentionally stays open (guest checkout is supported); only /account is gated.
const PROTECTED_PREFIXES = ["/account"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) return NextResponse.next();
  if (request.cookies.has(AUTH_COOKIE_NAME)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account/:path*"],
};
