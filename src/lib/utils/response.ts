import { NextResponse } from "next/server"
import { AppError, ValidationError } from "./errors"
import { ZodError } from "zod"

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
  };
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  code?: string,
  details?: unknown
): ApiResponse {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Handle errors and return appropriate response
 */
export function handleError(error: unknown): NextResponse {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.reduce((acc, err) => {
      const path = err.path.join(".")
      if (!acc[path]) acc[path] = []
      acc[path].push(err.message)
      return acc
    }, {} as Record<string, string[]>)

    return NextResponse.json(
      createErrorResponse("Validation failed", "VALIDATION_ERROR", errors),
      { status: 400 }
    )
  }

  // Handle custom app errors
  if (error instanceof ValidationError) {
    return NextResponse.json(
      createErrorResponse(error.message, error.code, error.errors),
      { status: error.statusCode }
    )
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      createErrorResponse(error.message, error.code),
      { status: error.statusCode }
    )
  }

  // Handle unknown errors
  console.error("Unhandled error:", error)
  return NextResponse.json(
    createErrorResponse(
      "Internal server error",
      "INTERNAL_ERROR",
      process.env.NODE_ENV === "development" ? error : undefined
    ),
    { status: 500 }
  )
}
