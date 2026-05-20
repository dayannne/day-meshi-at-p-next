import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

const API_BROWSER_NOT_FOUND_PATH = "/__api_browser_not_found__";

function isApiRoute(pathname: string): boolean {
  return pathname === "/api" || pathname.startsWith("/api/");
}

function isBrowserNavigationRequest(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  const secFetchDest = request.headers.get("sec-fetch-dest");
  const secFetchMode = request.headers.get("sec-fetch-mode");

  return (
    accept.includes("text/html") || (secFetchDest === "document" && secFetchMode === "navigate")
  );
}

export async function proxy(request: NextRequest) {
  if (isApiRoute(request.nextUrl.pathname) && isBrowserNavigationRequest(request)) {
    return NextResponse.rewrite(new URL(API_BROWSER_NOT_FOUND_PATH, request.url));
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
