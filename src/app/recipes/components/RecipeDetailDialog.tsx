"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { RecipeResponseDto } from "@/lib/dto/recipe.dto"
import {
    BookOpen,
    Clock,
    Heart,
    Pencil,
    Tag,
    Trash2,
    Users,
} from "lucide-react"

const CATEGORY_LABELS: Record<string, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
  DESSERT: "Dessert",
  APPETIZER: "Appetizer",
  SOUP: "Soup",
  SALAD: "Salad",
  BEVERAGE: "Beverage",
}

const HEALTH_COLORS: Record<string, string> = {
  VERY_HEALTHY: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  HEALTHY: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  MODERATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  INDULGENT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

const HEALTH_LABELS: Record<string, string> = {
  VERY_HEALTHY: "Very Healthy",
  HEALTHY: "Healthy",
  MODERATE: "Moderate",
  INDULGENT: "Indulgent",
}

interface RecipeDetailDialogProps {
  recipe: RecipeResponseDto | null
  open: boolean
  onClose: () => void
  onEdit: (recipe: RecipeResponseDto) => void
  onDelete: (recipe: RecipeResponseDto) => void
  currentUserId?: string
}

export function RecipeDetailDialog({
  recipe,
  open,
  onClose,
  onEdit,
  onDelete,
  currentUserId,
}: RecipeDetailDialogProps) {
  if (!recipe) return null

  const isOwner = currentUserId === recipe.userId
  const totalTime = (recipe.prepTimeMin ?? 0) + (recipe.cookTimeMin ?? 0)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl pr-8">{recipe.title}</DialogTitle>
        </DialogHeader>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {CATEGORY_LABELS[recipe.category] ?? recipe.category}
          </Badge>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${HEALTH_COLORS[recipe.healthScore]}`}
          >
            <Heart className="h-3 w-3" />
            {HEALTH_LABELS[recipe.healthScore] ?? recipe.healthScore}
          </span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
          </Badge>
          {totalTime > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {totalTime} min
            </Badge>
          )}
        </div>

        {recipe.description && (
          <p className="text-sm text-muted-foreground">{recipe.description}</p>
        )}

        <Separator />

        {/* Ingredients */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Ingredients
          </h3>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing) => (
              <li
                key={ing.id}
                className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0"
              >
                <span>{ing.ingredientName}</span>
                <span className="text-muted-foreground">
                  {ing.quantity} {ing.unit.toLowerCase().replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Instructions */}
        <div>
          <h3 className="font-semibold mb-2">Instructions</h3>
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {recipe.instructions}
          </p>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            By {recipe.userName}
          </span>
          {isOwner && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(recipe)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(recipe)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
