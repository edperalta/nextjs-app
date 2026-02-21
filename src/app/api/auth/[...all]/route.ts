/**
 * better-auth catch-all API route
 * Handles all auth operations: login, register, OAuth callbacks, session, signout
 */
import { auth } from "@/lib/auth/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
