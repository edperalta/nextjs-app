import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: "Server is up and running",
    timestamp: new Date().toISOString(),
  })
}
