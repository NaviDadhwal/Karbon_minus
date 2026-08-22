import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * No-op middleware (Clerk auth disabled for local development).
 */
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*", "/project/:path*", "/api/:path*"],
};
