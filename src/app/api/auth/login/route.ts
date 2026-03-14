import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  signToken,
  verifyPassword,
} from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { loginSchema } from "@/lib/dto/auth.dto"
import { UnauthorizedError } from "@/lib/utils/errors"
import { handleError } from "@/lib/utils/response"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        image: true,
      },
    })

    const isValid =
      user !== null && (await verifyPassword(password, user.password))
    if (!isValid) throw new UnauthorizedError("Invalid email or password")

    const token = await signToken({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    })
    return response
  } catch (error) {
    return handleError(error)
  }
}
