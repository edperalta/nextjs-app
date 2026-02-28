import { RecipeController } from "@/lib/controllers/recipe.controller"
import { NextRequest } from "next/server"

const controller = new RecipeController()

export async function GET(request: NextRequest) {
  return controller.getAll(request)
}

export async function POST(request: NextRequest) {
  return controller.create(request)
}
