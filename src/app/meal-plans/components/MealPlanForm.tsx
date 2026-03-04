"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
    CreateMealPlanDto,
    MEAL_TYPES,
    MealPlanResponseDto,
    MealTypeEnum,
} from "@/lib/dto/meal-plan.dto"
import { RecipeResponseDto } from "@/lib/dto/recipe.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const MEAL_LABELS: Record<MealTypeEnum, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
}

const MEAL_REQUIRED: Record<MealTypeEnum, boolean> = {
  BREAKFAST: true,
  LUNCH: true,
  DINNER: false,
  SNACK: false,
}

const staticSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  servings: z.number().int().min(1, "At least 1 person").max(200),
})
type StaticFields = z.infer<typeof staticSchema>

type DaySlot = {
  date: string
  label: string
  included: boolean
  meals: Record<MealTypeEnum, string>
}

function toYMD(d: Date): string {
  return d.toISOString().split("T")[0]
}

function getDatesInRange(start: string, end: string): DaySlot[] {
  const slots: DaySlot[] = []
  const cur = new Date(start + "T12:00:00")
  const last = new Date(end + "T12:00:00")
  if (isNaN(cur.getTime()) || isNaN(last.getTime()) || cur > last) return []
  while (cur <= last && slots.length < 31) {
    slots.push({
      date: toYMD(cur),
      label: cur.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      included: true,
      meals: { BREAKFAST: "", LUNCH: "", DINNER: "", SNACK: "" },
    })
    cur.setDate(cur.getDate() + 1)
  }
  return slots
}

function slotsFromPlan(plan: MealPlanResponseDto): DaySlot[] {
  const slots = getDatesInRange(plan.startDate, plan.endDate)
  const includedDates = new Set(plan.entries.map((e) => e.planDate))
  for (const slot of slots) {
    slot.included = includedDates.has(slot.date)
    for (const entry of plan.entries) {
      if (entry.planDate === slot.date) {
        slot.meals[entry.mealType] = entry.recipeId
      }
    }
  }
  return slots
}

interface MealPlanFormProps {
  plan?: MealPlanResponseDto
  onSubmit: (data: CreateMealPlanDto) => Promise<void>
  onCancel: () => void
}

export function MealPlanForm({ plan, onSubmit, onCancel }: MealPlanFormProps) {
  const [recipes, setRecipes] = React.useState<RecipeResponseDto[]>([])
  const [loadingRecipes, setLoadingRecipes] = React.useState(true)
  const [daySlots, setDaySlots] = React.useState<DaySlot[]>(() =>
    plan ? slotsFromPlan(plan) : []
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StaticFields>({
    resolver: zodResolver(staticSchema),
    defaultValues: {
      name: plan?.name ?? "",
      startDate: plan?.startDate ?? "",
      endDate: plan?.endDate ?? "",
      servings: plan?.servings ?? 2,
    },
  })

  const watchedStart = watch("startDate")
  const watchedEnd = watch("endDate")

  React.useEffect(() => {
    if (!plan && watchedStart && watchedEnd) {
      setDaySlots(getDatesInRange(watchedStart, watchedEnd))
    }
  }, [watchedStart, watchedEnd, plan])

  React.useEffect(() => {
    fetch("/api/recipes?limit=200")
      .then((r) => r.json())
      .then((r) => { if (r.success) setRecipes(r.data.data) })
      .finally(() => setLoadingRecipes(false))
  }, [])

  const toggleDay = (date: string) =>
    setDaySlots((prev) =>
      prev.map((s) => (s.date === date ? { ...s, included: !s.included } : s))
    )

  const setMeal = (date: string, meal: MealTypeEnum, recipeId: string) =>
    setDaySlots((prev) =>
      prev.map((s) =>
        s.date === date ? { ...s, meals: { ...s.meals, [meal]: recipeId } } : s
      )
    )

  const onFormSubmit = async (staticData: StaticFields) => {
    try {
      setError(null)
      const includedSlots = daySlots.filter((s) => s.included)
      if (includedSlots.length === 0) {
        setError("At least one day must be included.")
        return
      }
      for (const slot of includedSlots) {
        if (!slot.meals.BREAKFAST || !slot.meals.LUNCH) {
          setError(`${slot.label}: Breakfast and Lunch are required.`)
          return
        }
      }
      const entries: CreateMealPlanDto["entries"] = includedSlots.flatMap((slot) =>
        MEAL_TYPES.filter((m) => slot.meals[m]).map((m) => ({
          planDate: slot.date,
          mealType: m,
          recipeId: slot.meals[m],
        }))
      )
      setIsSubmitting(true)
      await onSubmit({ ...staticData, entries })
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Static fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5 lg:col-span-2">
          <Label htmlFor="name">Plan Name *</Label>
          <Input id="name" placeholder="e.g. Healthy Week" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="servings">Number of People *</Label>
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
          <Label htmlFor="startDate">Start Date *</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-xs text-destructive">{errors.startDate.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">End Date *</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
          {errors.endDate && (
            <p className="text-xs text-destructive">{errors.endDate.message}</p>
          )}
        </div>
        
      </div>

      {/* Day grid */}
      {daySlots.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          Select a start and end date to configure your meal schedule.
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Label>Daily Schedule ({daySlots.length} day{daySlots.length !== 1 ? "s" : ""})</Label>
            <p className="text-xs text-muted-foreground">
              Uncheck a day to skip it. Breakfast &amp; Lunch are required for included days.
            </p>
          </div>

          {loadingRecipes ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border divide-y divide-border">
              {daySlots.map((slot) => (
                <div
                  key={slot.date}
                  className={`p-3 transition-colors ${slot.included ? "" : "bg-muted/30"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id={`toggle-${slot.date}`}
                      checked={slot.included}
                      onChange={() => toggleDay(slot.date)}
                      className="h-4 w-4 rounded cursor-pointer accent-primary"
                    />
                    <label
                      htmlFor={`toggle-${slot.date}`}
                      className={`font-medium text-sm cursor-pointer select-none ${
                        slot.included ? "text-foreground" : "text-muted-foreground line-through"
                      }`}
                    >
                      {slot.label}
                    </label>
                    {!slot.included && (
                      <span className="text-xs text-muted-foreground italic">— skipped</span>
                    )}
                  </div>

                  {slot.included && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pl-7">
                      {MEAL_TYPES.map((meal) => (
                        <div key={meal} className="space-y-1">
                          <span className="text-xs text-muted-foreground flex gap-0.5">
                            {MEAL_LABELS[meal]}
                            {MEAL_REQUIRED[meal] && (
                              <span className="text-destructive">*</span>
                            )}
                          </span>
                          <Select
                            value={slot.meals[meal]}
                            onChange={(e) => setMeal(slot.date, meal, e.target.value)}
                          >
                            <option value="">— None —</option>
                            {recipes.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.title}
                              </option>
                            ))}
                          </Select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || loadingRecipes || daySlots.length === 0}>
          {isSubmitting ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </form>
  )
}
