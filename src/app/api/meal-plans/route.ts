import { MealPlanController } from "@/lib/controllers/meal-plan.controller"
import { NextRequest } from "next/server"

const controller = new MealPlanController()

export async function GET(request: NextRequest) {
  return controller.getAll(request)
}

export async function POST(request: NextRequest) {
  return controller.create(request)
}
