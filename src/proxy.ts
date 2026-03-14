/**
 * Route protection middleware (Edge Runtime compatible)
 *
 * Verifies the JWT auth cookie locally using jose — no DB calls, fully Edge-safe.
 */
import { getSession } from "@/lib/auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PATHS = ["/users", "/chat"]
const AUTH_PATHS = ["/login", "/register"]

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const session = await getSession(request.headers)

  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
    // Skip static assets, images, and the auth API itself
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
