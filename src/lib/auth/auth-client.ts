/**
 * Auth Client (better-auth/react)
 *
 * Exposes: signIn, signUp, signOut, useSession
 * Import these hooks in Client Components instead of the server-side `auth`.
 */
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
})

export const { signIn, signUp, signOut, useSession } = authClient
