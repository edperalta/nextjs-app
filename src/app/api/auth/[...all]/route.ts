/**
 * Fallback for any unmatched /api/auth/* paths.
 * Specific routes are handled by: login/, register/, logout/, session/
 */
import { NextResponse } from "next/server"

function notFound() {
  return NextResponse.json(
    { error: { message: "Not found" } },
    { status: 404 }
  )
}

export const GET = notFound
export const POST = notFound
