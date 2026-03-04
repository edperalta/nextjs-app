"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    MEAL_TYPES,
    MealPlanResponseDto,
    MealTypeEnum,
} from "@/lib/dto/meal-plan.dto"
import { Pencil, Trash2, Users, X } from "lucide-react"

const MEAL_LABELS: Record<MealTypeEnum, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
}

function formatDate(ymd: string) {
  return new Date(ymd + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

function formatShortDate(ymd: string) {
  return new Date(ymd + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface MealPlanDetailDialogProps {
  plan: MealPlanResponseDto | null
  open: boolean
  onClose: () => void
  onEdit: (plan: MealPlanResponseDto) => void
  onDelete: (plan: MealPlanResponseDto) => void
  currentUserId?: string
}

export function MealPlanDetailDialog({
  plan,
  open,
  onClose,
  onEdit,
  onDelete,
  currentUserId,
}: MealPlanDetailDialogProps) {
  if (!open || !plan) return null

  const isOwner = plan.userId === currentUserId

  // Group entries by date
  const byDate = new Map<string, Map<MealTypeEnum, string>>()
  for (const entry of plan.entries) {
    if (!byDate.has(entry.planDate)) byDate.set(entry.planDate, new Map())
    byDate.get(entry.planDate)!.set(entry.mealType, entry.recipeName)
  }
  const dates = [...byDate.keys()].sort()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 bg-background rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {formatShortDate(plan.startDate)} &rarr; {formatShortDate(plan.endDate)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Meta */}
        <div className="px-6 py-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {plan.servings} {plan.servings === 1 ? "person" : "people"}
          </span>
          <span>By {plan.userName}</span>
          <span>{dates.length} day{dates.length !== 1 ? "s" : ""} planned</span>
        </div>

        <Separator />

        {/* Date rows */}
        <div className="p-6 space-y-4">
          {dates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No meals scheduled.</p>
          ) : (
            dates.map((date) => {
              const meals = byDate.get(date)!
              return (
                <div key={date}>
                  <p className="font-semibold text-sm mb-2">{formatDate(date)}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MEAL_TYPES.map((meal) => {
                      const name = meals.get(meal)
                      return (
                        <div key={meal} className="rounded-md bg-muted/40 px-3 py-2">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
                            {MEAL_LABELS[meal]}
                          </p>
                          {name ? (
                            <p className="text-sm font-medium truncate">{name}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">—</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {isOwner && (
          <>
            <Separator />
            <div className="flex items-center justify-end gap-2 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(plan)}
                className="text-destructive border-destructive/50 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1.5" /> Delete
              </Button>
              <Button size="sm" onClick={() => onEdit(plan)}>
                <Pencil className="h-4 w-4 mr-1.5" /> Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
