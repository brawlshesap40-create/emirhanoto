import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (!isLoginRoute && !session?.adminId) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && session?.adminId) {
    return NextResponse.redirect(new URL("/admin/vehicles", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
