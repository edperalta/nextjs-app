"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { IngredientResponseDto } from "@/lib/dto/ingredient.dto"
import {
    CreateRecipeDto,
    createRecipeSchema,
    RecipeResponseDto,
    updateRecipeSchema,
} from "@/lib/dto/recipe.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import { Minus, Plus } from "lucide-react"
import * as React from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"

const CATEGORIES = [
  "BREAKFAST", "LUNCH", "DINNER", "SNACK", "DESSERT",
  "APPETIZER", "SOUP", "SALAD", "BEVERAGE",
] as const

const HEALTH_SCORES = [
  "VERY_HEALTHY", "HEALTHY", "MODERATE", "INDULGENT",
] as const

const UNITS = [
  "GRAMS", "MILLILITERS", "PIECES", "TABLESPOON", "TEASPOON",
  "CUP", "KILOGRAM", "LITER", "OUNCE", "POUND", "SLICE", "PINCH", "TO_TASTE",
] as const

interface RecipeFormProps {
  recipe?: RecipeResponseDto
  onSubmit: (data: CreateRecipeDto) => Promise<void>
  onCancel: () => void
}

export function RecipeForm({ recipe, onSubmit, onCancel }: RecipeFormProps) {
  const [ingredients, setIngredients] = React.useState<IngredientResponseDto[]>([])
  const [loadingIngredients, setLoadingIngredients] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateRecipeDto>({
    resolver: zodResolver(recipe ? updateRecipeSchema : createRecipeSchema),
    defaultValues: recipe
      ? {
          title: recipe.title,
          description: recipe.description ?? "",
          instructions: recipe.instructions,
          servings: recipe.servings,
          prepTimeMin: recipe.prepTimeMin ?? undefined,
          cookTimeMin: recipe.cookTimeMin ?? undefined,
          category: recipe.category,
          healthScore: recipe.healthScore,
          ingredients: recipe.ingredients.map((i) => ({
            ingredientId: i.ingredientId,
            quantity: i.quantity,
            unit: i.unit,
          })),
        }
      : {
          title: "",
          description: "",
          instructions: "",
          servings: 2,
          category: "DINNER",
          healthScore: "MODERATE",
          ingredients: [{ ingredientId: "", quantity: 1, unit: "GRAMS" }],
        },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" })

  const watchedIngredients = useWatch({ control, name: "ingredients" })

  React.useEffect(() => {
    fetch("/api/ingredients")
      .then((r) => r.json())
      .then((r) => { if (r.success) setIngredients(r.data) })
      .finally(() => setLoadingIngredients(false))
  }, [])

  const onFormSubmit = async (data: CreateRecipeDto) => {
    try {
      setError(null)
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" placeholder="Recipe title" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Brief description..."
          {...register("description")}
        />
      </div>

      {/* Category + Health Score */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category *</Label>
          <Select id="category" {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="healthScore">Health Score *</Label>
          <Select id="healthScore" {...register("healthScore")}>
            {HEALTH_SCORES.map((h) => (
              <option key={h} value={h}>
                {h.replace(/_/g, " ").charAt(0) + h.replace(/_/g, " ").slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
          {errors.healthScore && (
            <p className="text-xs text-destructive">{errors.healthScore.message}</p>
          )}
        </div>
      </div>

      {/* Servings + Times */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="servings">Servings *</Label>
          <Input
            id="servings"
            type="number"
            min={1}
            {...register("servings", { valueAsNumber: true })}
          />
          {errors.servings && (
            <p className="text-xs text-destructive">{errors.servings.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="prepTimeMin">Prep (min)</Label>
          <Input
            id="prepTimeMin"
            type="number"
            min={0}
            {...register("prepTimeMin", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cookTimeMin">Cook (min)</Label>
          <Input
            id="cookTimeMin"
            type="number"
            min={0}
            {...register("cookTimeMin", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-1.5">
        <Label htmlFor="instructions">Instructions *</Label>
        <textarea
          id="instructions"
          rows={5}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Step 1: ..."
          {...register("instructions")}
        />
        {errors.instructions && (
          <p className="text-xs text-destructive">{errors.instructions.message}</p>
        )}
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Ingredients *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ ingredientId: "", quantity: 1, unit: "GRAMS" })}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {errors.ingredients && !Array.isArray(errors.ingredients) && (
          <p className="text-xs text-destructive">{errors.ingredients.message}</p>
        )}

        {loadingIngredients ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => {
              const selectedIds = watchedIngredients
                ?.map((w, i) => (i !== index ? w?.ingredientId : null))
                .filter(Boolean) as string[]

              const availableIngredients = ingredients.filter(
                (ing) => !selectedIds.includes(ing.id)
              )

              return (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Select {...register(`ingredients.${index}.ingredientId`)}>
                    <option value="">— Select ingredient —</option>
                    {availableIngredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name}
                      </option>
                    ))}
                  </Select>
                  {errors.ingredients?.[index]?.ingredientId && (
                    <p className="text-xs text-destructive mt-0.5">
                      {errors.ingredients[index].ingredientId?.message}
                    </p>
                  )}
                </div>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  className="w-24"
                  placeholder="Qty"
                  {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                />
                <Select className="w-32" {...register(`ingredients.${index}.unit`)}>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u.toLowerCase().replace(/_/g, " ")}
                    </option>
                  ))}
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Saving..." : recipe ? "Update Recipe" : "Create Recipe"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
