import {
    CreateMealPlanDto,
    MealPlanEntryResponseDto,
    MealPlanFilters,
    MealPlanResponseDto,
    MealTypeEnum,
    PaginatedMealPlansDto,
    UpdateMealPlanDto,
} from "../dto/meal-plan.dto"
import { MealPlanRepository } from "../repositories/meal-plan.repository"
import { MealPlanWithRelations } from "../types/meal-plan.types"
import { ForbiddenError, NotFoundError } from "../utils/errors"

const MEAL_ORDER: Record<MealTypeEnum, number> = {
  BREAKFAST: 0,
  LUNCH: 1,
  DINNER: 2,
  SNACK: 3,
}

export class MealPlanService {
  private repository: MealPlanRepository

  constructor() {
    this.repository = MealPlanRepository.getInstance()
  }

  async getAll(filters: MealPlanFilters): Promise<PaginatedMealPlansDto> {
    const { search, page, limit } = filters
    const { data, total } = await this.repository.findAll({ search, page, limit })
    return {
      data: data.map(this.toResponseDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getById(id: string): Promise<MealPlanResponseDto> {
    const plan = await this.repository.findById(id)
    if (!plan) throw new NotFoundError(`Meal plan ${id} not found`)
    return this.toResponseDto(plan)
  }

  async create(data: CreateMealPlanDto, userId: string): Promise<MealPlanResponseDto> {
    const plan = await this.repository.create({ ...data, userId })
    return this.toResponseDto(plan)
  }

  async update(
    id: string,
    data: UpdateMealPlanDto,
    requesterId: string,
  ): Promise<MealPlanResponseDto> {
    const existing = await this.repository.findById(id)
    if (!existing) throw new NotFoundError(`Meal plan ${id} not found`)
    if (existing.userId !== requesterId)
      throw new ForbiddenError("Only the creator can edit this meal plan")

    const plan = await this.repository.update(id, data)
    return this.toResponseDto(plan)
  }

  async delete(id: string, requesterId: string): Promise<void> {
    const existing = await this.repository.findById(id)
    if (!existing) throw new NotFoundError(`Meal plan ${id} not found`)
    if (existing.userId !== requesterId)
      throw new ForbiddenError("Only the creator can delete this meal plan")
    await this.repository.softDelete(id)
  }

  private toResponseDto(plan: MealPlanWithRelations): MealPlanResponseDto {
    const sortedEntries = [...plan.entries].sort((a, b) => {
      const dateDiff = a.planDate.getTime() - b.planDate.getTime()
      return dateDiff !== 0
        ? dateDiff
        : MEAL_ORDER[a.mealType as MealTypeEnum] -
            MEAL_ORDER[b.mealType as MealTypeEnum]
    })

    return {
      id: plan.id,
      name: plan.name,
      startDate: plan.startDate.toISOString().split("T")[0],
      endDate: plan.endDate.toISOString().split("T")[0],
      servings: plan.servings,
      userId: plan.userId,
      userName: plan.user.name,
      entries: sortedEntries.map(
        (e): MealPlanEntryResponseDto => ({
          id: e.id,
          planDate: e.planDate.toISOString().split("T")[0],
          mealType: e.mealType as MealTypeEnum,
          recipeId: e.recipeId,
          recipeName: e.recipe.title,
          recipeCategory: e.recipe.category,
        }),
      ),
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
      deletedAt: plan.deletedAt?.toISOString() ?? null,
    }
  }
}


