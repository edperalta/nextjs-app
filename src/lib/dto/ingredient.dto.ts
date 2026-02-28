import { z } from "zod"
import { unitSchema } from "./recipe.dto"

export const createIngredientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  defaultUnit: unitSchema,
})

export type CreateIngredientDto = z.infer<typeof createIngredientSchema>

export interface IngredientResponseDto {
  id: string
  name: string
  defaultUnit: string
}
