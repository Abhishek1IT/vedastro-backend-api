import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/",
    "/home",
    "/shop",
    "/cart",
    "/login",
    "/admin/login",
    "/consultations", 
  ];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (pathname.startsWith("/admin")) {
    if (!accessToken) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url),
      );
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/astrologer")) {
    if (!accessToken) {
      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }

    return NextResponse.next();
  }

  const protectedPaths = [
    "/profile",
    "/orders",
    "/chat",
    "/call",

    "/consultations/chat",
    "/consultations/call",
  ];

  const isProtectedRoute = protectedPaths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`${path}/`),
  );

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|avatars|fonts).*)",
  ],
};