import { prisma } from "@/lib/db/prisma"
import { MealType, Prisma } from "@prisma/client"
import { MealPlanEntryInput } from "../dto/meal-plan.dto"
import { MealPlanWithRelations } from "../types/meal-plan.types"
import { NotFoundError } from "../utils/errors"

export interface FindAllMealPlansOptions {
  search?: string
  page: number
  limit: number
}

export interface FindAllMealPlansResult {
  data: MealPlanWithRelations[]
  total: number
}

interface CreateMealPlanData {
  name: string
  startDate: string
  endDate: string
  servings: number
  userId: string
  entries: MealPlanEntryInput[]
}

export interface IMealPlanRepository {
  findAll(options: FindAllMealPlansOptions): Promise<FindAllMealPlansResult>
  findById(id: string): Promise<MealPlanWithRelations | null>
  create(data: CreateMealPlanData): Promise<MealPlanWithRelations>
  update(
    id: string,
    data: Partial<Omit<CreateMealPlanData, "userId">>,
  ): Promise<MealPlanWithRelations>
  softDelete(id: string): Promise<void>
}

export class MealPlanRepository implements IMealPlanRepository {
  private static instance: MealPlanRepository

  static getInstance(): MealPlanRepository {
    if (!MealPlanRepository.instance) {
      MealPlanRepository.instance = new MealPlanRepository()
    }
    return MealPlanRepository.instance
  }

  private get include() {
    return {
      user: { select: { id: true, name: true } },
      entries: {
        include: {
          recipe: { select: { id: true, title: true, category: true } },
        },
      },
    } as const
  }

  async findAll(options: FindAllMealPlansOptions): Promise<FindAllMealPlansResult> {
    const { search, page, limit } = options
    const skip = (page - 1) * limit

    const where: Prisma.MealPlanWhereInput = {
      deletedAt: null,
      ...(search && { name: { contains: search } }),
    }
    const total = await prisma.mealPlan.count({ where })
    const data = await prisma.mealPlan.findMany({
      where,
      include: this.include,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    return { data, total }
  }

  async findById(id: string): Promise<MealPlanWithRelations | null> {
    return prisma.mealPlan.findFirst({
      where: { id, deletedAt: null },
      include: this.include,
    })
  }

  async create(data: CreateMealPlanData): Promise<MealPlanWithRelations> {
    const { entries, startDate, endDate, ...rest } = data
    return prisma.mealPlan.create({
      data: {
        ...rest,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        entries: {
          create: entries.map((e) => ({
            planDate: new Date(e.planDate),
            mealType: e.mealType as MealType,
            recipeId: e.recipeId,
          })),
        },
      },
      include: this.include,
    })
  }

  async update(
    id: string,
    data: Partial<Omit<CreateMealPlanData, "userId">>,
  ): Promise<MealPlanWithRelations> {
    const { entries, startDate, endDate, ...rest } = data
    try {
      return await prisma.mealPlan.update({
        where: { id },
        data: {
          ...rest,
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
          ...(entries && {
            entries: {
              deleteMany: {},
              create: entries.map((e) => ({
                planDate: new Date(e.planDate),
                mealType: e.mealType as MealType,
                recipeId: e.recipeId,
              })),
            },
          }),
        },
        include: this.include,
      })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundError(`Meal plan ${id} not found`)
      }
      throw e
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await prisma.mealPlan.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundError(`Meal plan ${id} not found`)
      }
      throw e
    }
  }
}


