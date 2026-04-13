import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminLoginPage = pathname === "/Limitless89king";
  const isProtectedAdminPage = pathname.startsWith("/Limitless89king/");
  const isProtectedAdminApi =
    pathname.startsWith("/api/Limitless89king") && pathname !== "/api/Limitless89king/auth";

  if (!isProtectedAdminPage && !isProtectedAdminApi) {
    return NextResponse.next();
  }

  if (isAdminLoginPage) {
    return NextResponse.next();
  }

  const adminCookie = request.cookies.get("elesh_admin")?.value;

  if (adminCookie === "1") {
    return NextResponse.next();
  }

  if (isProtectedAdminApi) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/Limitless89king", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/Limitless89king/:path*", "/api/Limitless89king/:path*"]
};
