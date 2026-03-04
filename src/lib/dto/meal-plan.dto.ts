import { z } from "zod"

export const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as const
export type MealTypeEnum = (typeof MEAL_TYPES)[number]

// ── Entry input ────────────────────────────────────────────────────────────────

const mealPlanEntryInputSchema = z.object({
  planDate: z.string().min(1, "Date is required"), // YYYY-MM-DD
  mealType: z.enum(MEAL_TYPES),
  recipeId: z.string().min(1, "Recipe is required"),
})

// ── API schemas ────────────────────────────────────────────────────────────────

export const createMealPlanSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name must be less than 200 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  servings: z.number().int().min(1, "At least 1 person").max(200),
  entries: z
    .array(mealPlanEntryInputSchema)
    .min(1, "At least one meal entry is required"),
})

export const updateMealPlanSchema = createMealPlanSchema.partial()

export const mealPlanFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

// ── Inferred types ─────────────────────────────────────────────────────────────

export type MealPlanEntryInput = z.infer<typeof mealPlanEntryInputSchema>
export type CreateMealPlanDto = z.infer<typeof createMealPlanSchema>
export type UpdateMealPlanDto = z.infer<typeof updateMealPlanSchema>
export type MealPlanFilters = z.infer<typeof mealPlanFiltersSchema>

// ── Response DTOs ──────────────────────────────────────────────────────────────

export interface MealPlanEntryResponseDto {
  id: string
  planDate: string // YYYY-MM-DD
  mealType: MealTypeEnum
  recipeId: string
  recipeName: string
  recipeCategory: string
}

export interface MealPlanResponseDto {
  id: string
  name: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  servings: number
  userId: string
  userName: string
  entries: MealPlanEntryResponseDto[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface PaginatedMealPlansDto {
  data: MealPlanResponseDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
