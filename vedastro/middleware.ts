import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("authToken")?.value;

  const { pathname } = request.nextUrl;

  const publicRoutes = ["/", "/login", "/register"];

  const protectedRoutes = [
    "/home",
    "/consultations",
    "/shop",
    "/profile",
    "/chat",
    "/call",
  ];

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublic && pathname !== "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|avatars|fonts).*)",
  ],
};
