import { MealPlanController } from "@/lib/controllers/meal-plan.controller"
import { NextRequest } from "next/server"

const controller = new MealPlanController()

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return controller.getById(id)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return controller.update(id, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return controller.delete(id, request)
}
