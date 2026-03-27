import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/tasks", "/projects", "/settings"];
const GUEST_ONLY_PREFIXES = ["/auth/login", "/auth/register"];
const TOKEN_COOKIE_KEY = "greenwin_token";

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated && startsWithAny(pathname, PROTECTED_PREFIXES)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && startsWithAny(pathname, GUEST_ONLY_PREFIXES)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/tasks";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tasks/:path*",
    "/projects/:path*",
    "/settings/:path*",
    "/dashboard/:path*",
    "/dashboard",
    "/auth/login",
    "/auth/register",
  ],
};
