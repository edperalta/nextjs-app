import { COOKIE_NAME } from "@/lib/auth/jwt"
import { NextResponse } from "next/server"

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}
