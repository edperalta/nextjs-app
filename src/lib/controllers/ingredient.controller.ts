import { NextRequest, NextResponse } from "next/server"
import { IngredientService } from "../services/ingredient.service"
import { BaseController } from "./base.controller"

export class IngredientController extends BaseController {
  private service: IngredientService

  constructor() {
    super()
    this.service = new IngredientService()
  }

  async getAll(request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const params = this.getQueryParams(request)
      const search = params.get("search") ?? undefined
      const ingredients = await this.service.getAll(search)
      return this.success(ingredients)
    })
  }
}
