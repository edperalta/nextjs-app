import { NextRequest, NextResponse } from "next/server";
import { handleError, createSuccessResponse } from "../utils/response";

/**
 * Base Controller
 * Handles HTTP requests and delegates to services
 */
export abstract class BaseController {
  /**
   * Wrap async handler with error handling
   */
  protected async handleRequest(
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      return await handler();
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Create success response with data
   */
  protected success<T>(data: T, status = 200): NextResponse {
    return NextResponse.json(createSuccessResponse(data), { status });
  }

  /**
   * Get query parameters from URL
   */
  protected getQueryParams(request: NextRequest): URLSearchParams {
    return new URL(request.url).searchParams;
  }

  /**
   * Parse request body as JSON
   */
  protected async getBody<T>(request: NextRequest): Promise<T> {
    return await request.json();
  }
}
