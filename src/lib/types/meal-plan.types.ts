import { Prisma } from "@prisma/client"

export type MealPlanWithRelations = Prisma.MealPlanGetPayload<{
  include: {
    user: { select: { id: true; name: true } }
    entries: { include: { recipe: { select: { id: true; title: true; category: true } } } }
  }
}>
