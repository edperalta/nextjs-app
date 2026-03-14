/**
 * Auth client — browser-side helpers for sign-in, sign-up, sign-out, and
 * a React hook for reading the current session.
 *
 * Communicates with our custom auth API routes.
 * Import in Client Components only.
 */
import { useCallback, useEffect, useState } from "react"

// ─── Types ─────────────────────────────────────────────────────────────────

type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  image: string | null
}

type Session = { user: SessionUser } | null

type AuthError = { message: string }
type AuthResult = { error: AuthError | null }

// ─── signIn ────────────────────────────────────────────────────────────────

export const signIn = {
  async email(params: {
    email: string
    password: string
    callbackURL?: string
  }): Promise<AuthResult> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: params.email, password: params.password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return {
        error: { message: data.error?.message ?? "Invalid email or password" },
      }
    }
    return { error: null }
  },
}

// ─── signUp ────────────────────────────────────────────────────────────────

export const signUp = {
  async email(params: {
    name: string
    email: string
    password: string
    callbackURL?: string
  }): Promise<AuthResult> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        password: params.password,
      }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return {
        error: { message: data.error?.message ?? "Could not create account" },
      }
    }
    return { error: null }
  },
}

// ─── signOut ───────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" })
}

// ─── useSession ────────────────────────────────────────────────────────────

export function useSession(): { data: Session; isPending: boolean } {
  const [session, setSession] = useState<Session>(null)
  const [isPending, setIsPending] = useState(true)

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session")
      setSession(res.ok ? ((await res.json()) as Session) : null)
    } catch {
      setSession(null)
    } finally {
      setIsPending(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  return { data: session, isPending }
}
