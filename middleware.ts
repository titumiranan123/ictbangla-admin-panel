/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const { nextUrl } = request;

  const token:any = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SCRETE,
  });

  const isAuth = !!token;

  const isAdmin = token?.user?.role === "ADMIN";
  const isSignInPage = nextUrl.pathname === "/sign-in";
  const isAdminRoute = nextUrl.pathname.startsWith("/secure-zone");

  // Redirect non-authenticated users trying to access admin routes
  if (!isAuth && isAdminRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
 if(isAuth && nextUrl.pathname == '/'){
  return NextResponse.redirect(new URL("/secure-zone", request.url));
 }
  // Redirect authenticated non-admins trying to access admin routes
  if (isAuth && isAdminRoute && !isAdmin) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.set("next-auth.session-token","",{maxAge:0})
    return response
  }

  // Redirect authenticated users away from sign-in page
  if (isAuth && isSignInPage) {
    return NextResponse.redirect(new URL("/secure-zone", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
