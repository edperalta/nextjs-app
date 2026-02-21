import { NextRequest } from "next/server"
import { UserController } from "@/lib/controllers/user.controller"

const controller = new UserController()

/**
 * GET /api/users/:id - Get user by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return controller.getById(id)
}

/**
 * PATCH /api/users/:id - Update user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return controller.update(id, request)
}

/**
 * DELETE /api/users/:id - Delete user
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return controller.delete(id)
}
