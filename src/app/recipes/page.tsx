"use client"

import { DeleteRecipeDialog } from "@/app/recipes/components/DeleteRecipeDialog"
import { RecipeDetailDialog } from "@/app/recipes/components/RecipeDetailDialog"
import { RecipeForm } from "@/app/recipes/components/RecipeForm"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth/auth-client"
import {
  CreateRecipeDto,
  PaginatedRecipesDto,
  RecipeResponseDto,
} from "@/lib/dto/recipe.dto"
import { ChefHat, Plus } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { RecipesTable } from "./components/RecipesTable"

const EMPTY_PAGE: PaginatedRecipesDto = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
}

export default function RecipesPage() {
  const { data: sessionData } = authClient.useSession()
  const currentUserId = sessionData?.user?.id

  const [result, setResult] = React.useState<PaginatedRecipesDto>(EMPTY_PAGE)
  const [loading, setLoading] = React.useState(true)

  // Filters
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [healthScore, setHealthScore] = React.useState("")
  const [page, setPage] = React.useState(1)

  // UI state
  const [showForm, setShowForm] = React.useState(false)
  const [editingRecipe, setEditingRecipe] = React.useState<RecipeResponseDto | undefined>()
  const [viewingRecipe, setViewingRecipe] = React.useState<RecipeResponseDto | null>(null)
  const [deletingRecipe, setDeletingRecipe] = React.useState<RecipeResponseDto | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Debounced search
  const searchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearch = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setSearch(value)
      setPage(1)
    }, 400)
  }

  const fetchRecipes = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" })
      if (search) params.set("search", search)
      if (category) params.set("category", category)
      if (healthScore) params.set("healthScore", healthScore)

      const res = await fetch(`/api/recipes?${params}`)
      const json = await res.json()
      if (json.success) {
        setResult(json.data)
      } else {
        toast.error("Failed to load recipes")
      }
    } catch {
      toast.error("Network error — could not load recipes")
    } finally {
      setLoading(false)
    }
  }, [page, search, category, healthScore])

  React.useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // ── CRUD Handlers ──────────────────────────────────────────────────────────

  const handleCreate = async (data: CreateRecipeDto) => {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message ?? "Failed to create recipe")

    toast.success(`Recipe "${json.data.title}" created!`)
    setShowForm(false)
    fetchRecipes()
  }

  const handleUpdate = async (data: CreateRecipeDto) => {
    if (!editingRecipe) return
    const res = await fetch(`/api/recipes/${editingRecipe.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message ?? "Failed to update recipe")

    toast.success(`Recipe "${json.data.title}" updated!`)
    setShowForm(false)
    setEditingRecipe(undefined)
    fetchRecipes()
  }

  const handleDeleteConfirm = async () => {
    if (!deletingRecipe) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/recipes/${deletingRecipe.id}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message ?? "Failed to delete recipe")

      toast.success(`Recipe "${deletingRecipe.title}" deleted`)
      setDeletingRecipe(null)
      fetchRecipes()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete recipe")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenForm = () => {
    if (!currentUserId) {
      toast.error("You must be logged in to create a recipe")
      return
    }
    setShowForm(true)
  }

  const handleEdit = (recipe: RecipeResponseDto) => {
    setViewingRecipe(null)
    setEditingRecipe(recipe)
    setShowForm(true)
  }

  const handleDelete = (recipe: RecipeResponseDto) => {
    setViewingRecipe(null)
    setDeletingRecipe(recipe)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingRecipe(undefined)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
                <ChefHat className="h-9 w-9 text-primary" />
                Recipes
              </h1>
              <p className="text-muted-foreground">
                Browse, create, and manage your recipe collection
              </p>
            </div>
            {!showForm && (
              <Button onClick={handleOpenForm} size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                New Recipe
              </Button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingRecipe ? "Edit Recipe" : "New Recipe"}
                </CardTitle>
                <CardDescription>
                  {editingRecipe
                    ? "Update the details of your recipe."
                    : "Fill in the details to create a new recipe."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecipeForm
                  recipe={editingRecipe}
                  onSubmit={editingRecipe ? handleUpdate : handleCreate}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          )}

          {/* Table */}
          {!showForm && (
            <RecipesTable
              data={result.data}
              total={result.total}
              page={result.page}
              totalPages={result.totalPages}
              loading={loading}
              onPageChange={(p) => setPage(p)}
              onSearch={handleSearch}
              onCategoryChange={(v) => { setCategory(v); setPage(1) }}
              onHealthChange={(v) => { setHealthScore(v); setPage(1) }}
              onView={(r) => setViewingRecipe(r)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          )}
        </div>
      </div>
      <Footer />

      {/* Detail Dialog */}
      <RecipeDetailDialog
        recipe={viewingRecipe}
        open={viewingRecipe !== null}
        onClose={() => setViewingRecipe(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserId={currentUserId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteRecipeDialog
        open={deletingRecipe !== null && !isDeleting}
        recipeName={deletingRecipe?.title ?? ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingRecipe(null)}
      />
    </div>
  )
}
