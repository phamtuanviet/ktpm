import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("refreshToken")?.value;

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/auth?isLogin=true", request.url));
  }

  try {
    if (isAdminRoute && token) {
      const secret = new TextEncoder().encode(
        process.env.SECRET_KEY || "change_this_secret"
      );
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/auth?isLogin=true", request.url)
        );
      }
    }
    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(
      new URL("/auth?isLogin=true", request.url)
    );
    return response;
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
