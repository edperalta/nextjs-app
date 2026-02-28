import { HealthScore, RecipeCategory } from "@prisma/client"
import {
    CreateRecipeDto,
    HealthScoreEnum,
    PaginatedRecipesDto,
    RecipeCategoryEnum,
    RecipeFilters,
    RecipeResponseDto,
    UnitEnum,
    UpdateRecipeDto,
} from "../dto/recipe.dto"
import { RecipeRepository } from "../repositories/recipe.repository"
import { RecipeWithRelations } from "../types/recipe.types"
import { ForbiddenError, NotFoundError } from "../utils/errors"

export class RecipeService {
  private repository: RecipeRepository

  constructor() {
    this.repository = RecipeRepository.getInstance()
  }

  async getAll(filters: RecipeFilters): Promise<PaginatedRecipesDto> {
    const { search, category, healthScore, page, limit } = filters
    const { data, total } = await this.repository.findAll({
      search,
      category: category as RecipeCategory | undefined,
      healthScore: healthScore as HealthScore | undefined,
      page,
      limit,
    })
    return {
      data: data.map(this.toResponseDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getById(id: string): Promise<RecipeResponseDto> {
    const recipe = await this.repository.findById(id)
    if (!recipe) throw new NotFoundError(`Recipe ${id} not found`)
    return this.toResponseDto(recipe)
  }

  async create(
    data: CreateRecipeDto,
    userId: string,
  ): Promise<RecipeResponseDto> {
    const recipe = await this.repository.create({
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      servings: data.servings,
      prepTimeMin: data.prepTimeMin,
      cookTimeMin: data.cookTimeMin,
      category: data.category as RecipeCategory,
      healthScore: data.healthScore as HealthScore,
      ingredients: data.ingredients,
      userId,
    })
    return this.toResponseDto(recipe)
  }

  async update(
    id: string,
    data: UpdateRecipeDto,
    requesterId: string,
  ): Promise<RecipeResponseDto> {
    const existing = await this.repository.findById(id)
    if (!existing) throw new NotFoundError(`Recipe ${id} not found`)
    if (existing.userId !== requesterId)
      throw new ForbiddenError("Only the creator can edit this recipe")

    const recipe = await this.repository.update(id, {
      ...data,
      category: data.category as RecipeCategory | undefined,
      healthScore: data.healthScore as HealthScore | undefined,
    })
    return this.toResponseDto(recipe)
  }

  async delete(id: string, requesterId: string): Promise<void> {
    const existing = await this.repository.findById(id)
    if (!existing) throw new NotFoundError(`Recipe ${id} not found`)
    if (existing.userId !== requesterId)
      throw new ForbiddenError("Only the creator can delete this recipe")
    await this.repository.softDelete(id)
  }

  private toResponseDto(recipe: RecipeWithRelations): RecipeResponseDto {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      servings: recipe.servings,
      prepTimeMin: recipe.prepTimeMin,
      cookTimeMin: recipe.cookTimeMin,
      category: recipe.category as RecipeCategoryEnum,
      healthScore: recipe.healthScore as HealthScoreEnum,
      userId: recipe.userId,
      userName: recipe.user.name,
      ingredients: recipe.ingredients.map((ri) => ({
        id: ri.id,
        ingredientId: ri.ingredientId,
        ingredientName: ri.ingredient.name,
        quantity: ri.quantity,
        unit: ri.unit as UnitEnum,
      })),
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
      deletedAt: recipe.deletedAt?.toISOString() ?? null,
    }
  }
}
