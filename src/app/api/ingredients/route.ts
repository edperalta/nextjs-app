import { IngredientController } from "@/lib/controllers/ingredient.controller"
import { NextRequest } from "next/server"

const controller = new IngredientController()

export async function GET(request: NextRequest) {
  return controller.getAll(request)
}
