import { UserController } from "@/lib/controllers/user.controller"
import { NextRequest } from "next/server"

const controller = new UserController()

/**
 * GET /api/users - Get all users
 */
export async function GET() {
  return controller.getAll()
}

/**
 * POST /api/users - Create new user
 */
export async function POST(request: NextRequest) {
  return controller.create(request)
}
