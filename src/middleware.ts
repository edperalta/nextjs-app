/**
 * Route protection middleware
 *
 * Uses betterFetch to call /api/auth/get-session via HTTP — required because
 * Next.js middleware runs on the Edge Runtime, which does not support Prisma.
 * Calling auth.api.getSession() directly would attempt a DB connection and fail.
 */
import type { Session } from "@/lib/auth/auth"
import { betterFetch } from "@better-fetch/fetch"
import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PATHS = ["/users", "/chat"]
const AUTH_PATHS = ["/login", "/register"]

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl

    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") ?? "",
            },
        }
    )

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
