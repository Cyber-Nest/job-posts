import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ─── ADMIN ROUTE PROTECTION ───────────────────────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminToken = req.cookies.get("admin_token")?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  }

  // ─── EMPLOYER ROUTE PROTECTION ────────────────────────────────────────────
  const token =
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value ||
    req.cookies.get("__Host-better-auth.session_token")?.value;

  const protectedRoutes = ["/post-a-job", "/employers/dashboard"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/post-a-job/:path*",
    "/employers/dashboard/:path*",
  ],
};
