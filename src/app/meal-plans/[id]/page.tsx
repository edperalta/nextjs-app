import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth/jwt"
import { prisma } from "@/lib/db/prisma"
import { ArrowLeft, CalendarDays, ShoppingCart, Users } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MealPlanActions } from "./MealPlanActions"

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as const
type MealType = (typeof MEAL_TYPES)[number]

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
}

const UNIT_LABELS: Record<string, string> = {
  GRAMS: "g",
  MILLILITERS: "ml",
  PIECES: "pcs",
  TABLESPOON: "tbsp",
  TEASPOON: "tsp",
  CUP: "cup",
  KILOGRAM: "kg",
  LITER: "L",
  OUNCE: "oz",
  POUND: "lb",
  SLICE: "slices",
  PINCH: "pinch",
}

function formatDate(ymd: string) {
  return new Date(ymd + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

function formatShort(ymd: string) {
  return new Date(ymd + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function MealPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [plan, session] = await Promise.all([
    prisma.mealPlan.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: { select: { id: true, name: true } },
        entries: {
          include: {
            recipe: {
              select: {
                id: true,
                title: true,
                category: true,
                servings: true,
                ingredients: {
                  include: {
                    ingredient: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
          orderBy: { planDate: "asc" },
        },
      },
    }),
    getSession(await headers()),
  ])

  if (!plan) notFound()

  const isOwner = session?.user?.id === plan.userId

  // ── Group entries by date ─────────────────────────────────────────────────
  const byDate = new Map<string, Map<MealType, string>>()
  for (const entry of plan.entries) {
    const date = entry.planDate.toISOString().split("T")[0]
    if (!byDate.has(date)) byDate.set(date, new Map())
    byDate.get(date)!.set(entry.mealType as MealType, entry.recipe.title)
  }
  const dates = [...byDate.keys()].sort()

  // ── Ingredient summary ────────────────────────────────────────────────────
  type IngItem = { name: string; amounts: Map<string, number>; toTaste: boolean }
  const ingMap = new Map<string, IngItem>()

  for (const entry of plan.entries) {
    const scale = plan.servings / Math.max(entry.recipe.servings, 1)
    for (const ri of entry.recipe.ingredients) {
      if (!ingMap.has(ri.ingredientId)) {
        ingMap.set(ri.ingredientId, {
          name: ri.ingredient.name,
          amounts: new Map(),
          toTaste: false,
        })
      }
      const item = ingMap.get(ri.ingredientId)!
      if (ri.unit === "TO_TASTE") {
        item.toTaste = true
      } else {
        item.amounts.set(
          ri.unit,
          (item.amounts.get(ri.unit) ?? 0) + ri.quantity * scale,
        )
      }
    }
  }

  const ingredients = [...ingMap.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({
      name: item.name,
      quantities: [...item.amounts.entries()].map(([unit, amount]) => ({
        unit,
        amount: Math.round(amount * 100) / 100,
      })),
      toTaste: item.toTaste,
    }))

  const startYmd = plan.startDate.toISOString().split("T")[0]
  const endYmd = plan.endDate.toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Back link */}
        <Link
          href="/meal-plans"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Meal Plans
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-primary shrink-0" />
              <h1 className="text-3xl font-bold tracking-tight">{plan.name}</h1>
            </div>
            <p className="text-muted-foreground pl-11">
              {formatShort(startYmd)}
              {startYmd !== endYmd && <> &rarr; {formatShort(endYmd)}</>}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-11 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {plan.servings} {plan.servings === 1 ? "person" : "people"}
              </span>
              <span>{dates.length} day{dates.length !== 1 ? "s" : ""} planned</span>
              <span>{plan.entries.length} meals</span>
              <span>by {plan.user.name}</span>
            </div>
          </div>
          {isOwner && <MealPlanActions planId={plan.id} planName={plan.name} />}
        </div>

        <Separator />

        {/* Meal Schedule */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Meal Schedule</h2>
          <div className="space-y-3">
            {dates.map((date) => {
              const meals = byDate.get(date)!
              return (
                <div key={date} className="rounded-lg border p-4">
                  <p className="text-sm font-semibold mb-3">{formatDate(date)}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {MEAL_TYPES.map((meal) => {
                      const name = meals.get(meal)
                      return (
                        <div key={meal} className="rounded-md bg-muted/40 px-3 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            {MEAL_LABELS[meal]}
                          </p>
                          {name ? (
                            <p className="text-sm font-medium leading-snug">{name}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">—</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <Separator />

        {/* Shopping List */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Shopping List</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Quantities scaled for{" "}
            <strong>
              {plan.servings} {plan.servings === 1 ? "person" : "people"}
            </strong>
            {" "}based on each recipe&apos;s serving size.
          </p>
          {ingredients.length === 0 ? (
            <p className="text-sm text-muted-foreground italic rounded-md border border-dashed p-6 text-center">
              No ingredient data available for these recipes.
            </p>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-4 py-3 font-semibold">Ingredient</th>
                    <th className="text-right px-4 py-3 font-semibold">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ingredients.map((ing) => (
                    <tr key={ing.name} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 font-medium capitalize">{ing.name}</td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground">
                        {ing.quantities.map(({ unit, amount }) => (
                          <div key={unit} className="whitespace-nowrap">
                            {amount} {UNIT_LABELS[unit] ?? unit.toLowerCase()}
                          </div>
                        ))}
                        {ing.toTaste && (
                          <div className="italic text-xs">
                            {ing.quantities.length > 0 ? "+ to taste" : "to taste"}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  )
}
