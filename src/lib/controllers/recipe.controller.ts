import { getSession } from "@/lib/auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import {
    createRecipeSchema,
    recipeFiltersSchema,
    updateRecipeSchema,
} from "../dto/recipe.dto"
import { RecipeService } from "../services/recipe.service"
import { UnauthorizedError } from "../utils/errors"
import { BaseController } from "./base.controller"

export class RecipeController extends BaseController {
  private service: RecipeService

  constructor() {
    super()
    this.service = new RecipeService()
  }

  async getAll(request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const params = this.getQueryParams(request)
      const filters = recipeFiltersSchema.parse({
        search: params.get("search") ?? undefined,
        category: params.get("category") ?? undefined,
        healthScore: params.get("healthScore") ?? undefined,
        page: params.get("page") ?? 1,
        limit: params.get("limit") ?? 10,
      })
      const result = await this.service.getAll(filters)
      return this.success(result)
    })
  }

  async getById(id: string): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const recipe = await this.service.getById(id)
      return this.success(recipe)
    })
  }

  async create(request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const session = await this.requireSession(request)
      const body = await this.getBody(request)
      const data = createRecipeSchema.parse(body)
      const recipe = await this.service.create(data, session.user.id)
      return this.success(recipe, 201)
    })
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const session = await this.requireSession(request)
      const body = await this.getBody(request)
      const data = updateRecipeSchema.parse(body)
      const recipe = await this.service.update(id, data, session.user.id)
      return this.success(recipe)
    })
  }

  async delete(id: string, request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const session = await this.requireSession(request)
      await this.service.delete(id, session.user.id)
      return this.success({ message: "Recipe deleted successfully" })
    })
  }

  private async requireSession(request: NextRequest) {
    const session = await getSession(request.headers)
    if (!session) throw new UnauthorizedError()
    return session
  }
}
