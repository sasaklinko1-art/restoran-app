import { NextRequest, NextResponse } from "next/server";
import { NAZIV_KOLACICA, proveriTokenSesije } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const jePutanjaLogina = pathname === "/admin/login";
  const jeAdminApi =
    (pathname.startsWith("/api/rezervacije") && request.method !== "POST") ||
    pathname.startsWith("/api/jela");

  if (pathname.startsWith("/admin") && !jePutanjaLogina) {
    const token = request.cookies.get(NAZIV_KOLACICA)?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  if (jeAdminApi) {
  const token = request.cookies.get(NAZIV_KOLACICA)?.value;

  if (!token) {
    return NextResponse.json(
      { greska: "Niste prijavljeni." },
      { status: 401 }
    );
  }
}

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/rezervacije/:path*", "/api/jela/:path*"],
};
