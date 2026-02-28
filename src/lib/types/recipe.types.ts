import { Prisma } from "@prisma/client"

/** Recipe entity with user and ingredients relations.*/
export type RecipeWithRelations = Prisma.RecipeGetPayload<{
  include: {
    user: { select: { id: true; name: true } }
    ingredients: { include: { ingredient: true } }
  }
}>
