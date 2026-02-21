import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in — Next.js App",
}

export default function LoginPage() {
  return <LoginForm />
}
