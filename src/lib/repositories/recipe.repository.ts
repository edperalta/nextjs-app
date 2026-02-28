import { prisma } from "@/lib/db/prisma"
import { HealthScore, Prisma, RecipeCategory, Unit } from "@prisma/client"
import { RecipeIngredientInput } from "../dto/recipe.dto"
import { RecipeWithRelations } from "../types/recipe.types"
import { ConflictError, NotFoundError } from "../utils/errors"

export interface FindAllOptions {
  search?: string;
  category?: RecipeCategory;
  healthScore?: HealthScore;
  page: number;
  limit: number;
}

export interface FindAllResult {
  data: RecipeWithRelations[];
  total: number;
}

export interface IRecipeRepository {
  findAll(options: FindAllOptions): Promise<FindAllResult>
  findById(id: string): Promise<RecipeWithRelations | null>
  create(data: CreateRecipeData): Promise<RecipeWithRelations>
  update(id: string, data: Partial<Omit<CreateRecipeData, "userId">>): Promise<RecipeWithRelations>
  softDelete(id: string): Promise<void>
}

interface CreateRecipeData {
  title: string;
  description?: string;
  instructions: string;
  servings: number;
  prepTimeMin?: number;
  cookTimeMin?: number;
  category: RecipeCategory;
  healthScore: HealthScore;
  userId: string;
  ingredients: RecipeIngredientInput[];
}

export class RecipeRepository implements IRecipeRepository {
  private static instance: RecipeRepository

  static getInstance(): RecipeRepository {
    if (!RecipeRepository.instance) {
      RecipeRepository.instance = new RecipeRepository()
    }
    return RecipeRepository.instance
  }

  private get include() {
    return {
      user: { select: { id: true, name: true } },
      ingredients: { include: { ingredient: true } },
    } as const
  }

  async findAll(options: FindAllOptions): Promise<FindAllResult> {
    const { search, category, healthScore, page, limit } = options
    const skip = (page - 1) * limit

    const where: Prisma.RecipeWhereInput = {
      deletedAt: null,
      ...(category && { category }),
      ...(healthScore && { healthScore }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    }
    const total = await prisma.recipe.count({ where })
    const data = await prisma.recipe.findMany({
      where,
      include: this.include,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    return { data, total }
  }

  async findById(id: string): Promise<RecipeWithRelations | null> {
    return prisma.recipe.findFirst({
      where: { id, deletedAt: null },
      include: this.include,
    })
  }

  async create(data: CreateRecipeData): Promise<RecipeWithRelations> {
    const { ingredients, ...recipeData } = data
    try {
      return await prisma.recipe.create({
        data: {
          ...recipeData,
          ingredients: {
            create: ingredients.map((i) => ({
              ingredientId: i.ingredientId,
              quantity: i.quantity,
              unit: i.unit as Unit,
            })),
          },
        },
        include: this.include,
      })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictError("A recipe with this title already exists")
      }
      throw e
    }
  }

  async update(
    id: string,
    data: Partial<Omit<CreateRecipeData, "userId">>,
  ): Promise<RecipeWithRelations> {
    const { ingredients, ...recipeData } = data
    try {
      return await prisma.recipe.update({
        where: { id },
        data: {
          ...recipeData,
          ...(ingredients && {
            ingredients: {
              deleteMany: {},
              create: ingredients.map((i) => ({
                ingredientId: i.ingredientId,
                quantity: i.quantity,
                unit: i.unit as Unit,
              })),
            },
          }),
        },
        include: this.include,
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new NotFoundError(`Recipe ${id} not found`)
        if (e.code === "P2002")
          throw new ConflictError("A recipe with this title already exists")
      }
      throw e
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await prisma.recipe.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundError(`Recipe ${id} not found`)
      }
      throw e
    }
  }
}
