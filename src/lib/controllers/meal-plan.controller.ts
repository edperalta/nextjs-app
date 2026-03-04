import { auth } from "@/lib/auth/auth"
import { NextRequest, NextResponse } from "next/server"
import {
    createMealPlanSchema,
    mealPlanFiltersSchema,
    updateMealPlanSchema,
} from "../dto/meal-plan.dto"
import { MealPlanService } from "../services/meal-plan.service"
import { UnauthorizedError } from "../utils/errors"
import { BaseController } from "./base.controller"

export class MealPlanController extends BaseController {
  private service: MealPlanService

  constructor() {
    super()
    this.service = new MealPlanService()
  }

  async getAll(request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const params = this.getQueryParams(request)
      const filters = mealPlanFiltersSchema.parse({
        search: params.get("search") ?? undefined,
        page: params.get("page") ?? 1,
        limit: params.get("limit") ?? 10,
      })
      const result = await this.service.getAll(filters)
      return this.success(result)
    })
  }

  async getById(id: string): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const plan = await this.service.getById(id)
      return this.success(plan)
    })
  }

  async create(request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const session = await this.requireSession(request)
      const body = await this.getBody(request)
      const data = createMealPlanSchema.parse(body)
      const plan = await this.service.create(data, session.user.id)
      return this.success(plan, 201)
    })
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const session = await this.requireSession(request)
      const body = await this.getBody(request)
      const data = updateMealPlanSchema.parse(body)
      const plan = await this.service.update(id, data, session.user.id)
      return this.success(plan)
    })
  }

  async delete(id: string, request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const session = await this.requireSession(request)
      await this.service.delete(id, session.user.id)
      return this.success({ message: "Meal plan deleted successfully" })
    })
  }

  private async requireSession(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) throw new UnauthorizedError()
    return session
  }
}
