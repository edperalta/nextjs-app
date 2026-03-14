/**
 * JWT utilities — Edge Runtime compatible (jose only, no Node.js-specific deps)
 *
 * Import from this file in middleware / Edge routes.
 * For password hashing (bcryptjs), import from auth.ts instead.
 */
import { jwtVerify, SignJWT } from "jose"

export const COOKIE_NAME = "auth-token"
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "fallback-dev-secret-change-in-production"
  )
}

export type TokenPayload = {
  sub: string
  name: string
  email: string
  role: string
  image: string | null
}

export type Session = {
  user: {
    id: string
    name: string
    email: string
    role: string
    image: string | null
  }
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

function parseCookieToken(cookieHeader: string): string | null {
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null
}

export async function getSession(
  headers: { get(name: string): string | null }
): Promise<Session | null> {
  const cookieHeader = headers.get("cookie") ?? ""
  const token = parseCookieToken(cookieHeader)
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  return {
    user: {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      image: payload.image,
    },
  }
}
