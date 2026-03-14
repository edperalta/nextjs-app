/**
 * Server-side auth utilities (Node.js only — do NOT import in Edge Runtime)
 *
 * Provides password hashing via bcryptjs.
 * JWT / session helpers are re-exported from jwt.ts (Edge-safe).
 */
import bcrypt from "bcryptjs"

export {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  getSession,
  signToken,
  type Session,
  type TokenPayload,
} from "@/lib/auth/jwt"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
