import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "juzni-merak-secret"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin/* routes (but not /admin itself which is the login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const token = req.cookies.get("jm_admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    try {
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
