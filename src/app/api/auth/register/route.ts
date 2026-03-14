import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  hashPassword,
  signToken,
} from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { registerSchema } from "@/lib/dto/auth.dto"
import { ConflictError } from "@/lib/utils/errors"
import { handleError } from "@/lib/utils/response"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })
    if (existing) throw new ConflictError("Email already in use")

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true, image: true },
    })

    const token = await signToken({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    })

    const response = NextResponse.json({ success: true }, { status: 201 })
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
