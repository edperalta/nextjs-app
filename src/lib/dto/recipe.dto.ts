import { z } from "zod"

// ── Enum schemas (mirror Prisma enums) ────────────────────────────────────────

export const unitSchema = z.enum([
  "GRAMS",
  "MILLILITERS",
  "PIECES",
  "TABLESPOON",
  "TEASPOON",
  "CUP",
  "KILOGRAM",
  "LITER",
  "OUNCE",
  "POUND",
  "SLICE",
  "PINCH",
  "TO_TASTE",
])

export const recipeCategorySchema = z.enum([
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
  "DESSERT",
  "APPETIZER",
  "SOUP",
  "SALAD",
  "BEVERAGE",
])

export const healthScoreSchema = z.enum([
  "VERY_HEALTHY",
  "HEALTHY",
  "MODERATE",
  "INDULGENT",
])

// ── Ingredient line within a recipe ───────────────────────────────────────────

const recipeIngredientInputSchema = z.object({
  ingredientId: z.string().min(1, "Ingredient is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: unitSchema,
})

// ── CRUD schemas ───────────────────────────────────────────────────────────────

export const createRecipeSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000).optional(),
  instructions: z
    .string()
    .min(10, "Instructions must be at least 10 characters"),
  servings: z.number().int().min(1).max(100),
  prepTimeMin: z.number().int().min(0).optional(),
  cookTimeMin: z.number().int().min(0).optional(),
  category: recipeCategorySchema,
  healthScore: healthScoreSchema,
  ingredients: z
    .array(recipeIngredientInputSchema)
    .min(1, "At least one ingredient is required"),
})

export const updateRecipeSchema = createRecipeSchema.partial()

export const recipeFiltersSchema = z.object({
  search: z.string().optional(),
  category: recipeCategorySchema.optional(),
  healthScore: healthScoreSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(2000).default(10),
})

// ── Inferred types ─────────────────────────────────────────────────────────────

export type UnitEnum = z.infer<typeof unitSchema>;
export type RecipeCategoryEnum = z.infer<typeof recipeCategorySchema>;
export type HealthScoreEnum = z.infer<typeof healthScoreSchema>;
export type RecipeIngredientInput = z.infer<typeof recipeIngredientInputSchema>;
export type CreateRecipeDto = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeDto = z.infer<typeof updateRecipeSchema>;
export type RecipeFilters = z.infer<typeof recipeFiltersSchema>;

// ── Response DTOs ──────────────────────────────────────────────────────────────

export interface RecipeIngredientResponseDto {
  id: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: UnitEnum;
}

export interface RecipeResponseDto {
  id: string;
  title: string;
  description: string | null;
  instructions: string;
  servings: number;
  prepTimeMin: number | null;
  cookTimeMin: number | null;
  category: RecipeCategoryEnum;
  healthScore: HealthScoreEnum;
  userId: string;
  userName: string;
  ingredients: RecipeIngredientResponseDto[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedRecipesDto {
  data: RecipeResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
