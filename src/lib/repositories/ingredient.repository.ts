import { prisma } from "@/lib/db/prisma"
import { Ingredient, Prisma, Unit } from "@prisma/client"
import { ConflictError } from "../utils/errors"
import { IRepository } from "./base.repository"

export class IngredientRepository implements Pick<IRepository<Ingredient>, "findAll" | "findById" | "create"> {
  private static instance: IngredientRepository

  static getInstance(): IngredientRepository {
    if (!IngredientRepository.instance) {
      IngredientRepository.instance = new IngredientRepository()
    }
    return IngredientRepository.instance
  }

  async findAll(search?: string): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({
      where: search ? { name: { contains: search } } : undefined,
      orderBy: { name: "asc" },
    })
  }

  async findById(id: string): Promise<Ingredient | null> {
    return prisma.ingredient.findUnique({ where: { id } })
  }

  async create(data: { name: string; defaultUnit: Unit }): Promise<Ingredient> {
    try {
      return await prisma.ingredient.create({ data })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictError(`Ingredient "${data.name}" already exists`)
      }
      throw e
    }
  }
}
