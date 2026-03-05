"use client"

import { DeleteMealPlanDialog } from "@/app/meal-plans/components/DeleteMealPlanDialog"
import { MealPlanForm } from "@/app/meal-plans/components/MealPlanForm"
import { MealPlansTable } from "@/app/meal-plans/components/MealPlansTable"
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
// import { authClient } from "@/lib/auth/auth-client"
import {
    CreateMealPlanDto,
    MealPlanResponseDto,
    PaginatedMealPlansDto,
} from "@/lib/dto/meal-plan.dto"
import { CalendarDays, Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

const EMPTY_PAGE: PaginatedMealPlansDto = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
}

export default function MealPlansPage() {
  return (
    <React.Suspense>
      <MealPlansContent />
    </React.Suspense>
  )
}

function MealPlansContent() {
//   const { data: sessionData } = authClient.useSession()
//   const currentUserId = sessionData?.user?.id
  const router = useRouter()
  const searchParams = useSearchParams()

  const [result, setResult] = React.useState<PaginatedMealPlansDto>(EMPTY_PAGE)
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)

  const [showForm, setShowForm] = React.useState(false)
  const [editingPlan, setEditingPlan] = React.useState<MealPlanResponseDto | undefined>()
  const [deletingPlan, setDeletingPlan] = React.useState<MealPlanResponseDto | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const searchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearch = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setSearch(value)
      setPage(1)
    }, 400)
  }

  const fetchPlans = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" })
      if (search) params.set("search", search)
      const res = await fetch(`/api/meal-plans?${params}`)
      const json = await res.json()
      if (json.success) setResult(json.data)
      else toast.error("Failed to load meal plans")
    } catch {
      toast.error("Network error — could not load meal plans")
    } finally {
      setLoading(false)
    }
  }, [page, search])

  React.useEffect(() => { fetchPlans() }, [fetchPlans])

  // Auto-open edit form when arriving from detail page via ?edit=[id]
  React.useEffect(() => {
    const editId = searchParams.get("edit")
    if (!editId || showForm) return
    fetch(`/api/meal-plans/${editId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setEditingPlan(json.data)
          setShowForm(true)
          router.replace("/meal-plans")
        }
      })
      .catch(() => {})
  }, [searchParams, showForm, router])

  const handleCreate = async (data: CreateMealPlanDto) => {
    const res = await fetch("/api/meal-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message ?? "Failed to create meal plan")
    toast.success(`Meal plan "${json.data.name}" created!`)
    setShowForm(false)
    fetchPlans()
  }

  const handleUpdate = async (data: CreateMealPlanDto) => {
    if (!editingPlan) return
    const res = await fetch(`/api/meal-plans/${editingPlan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message ?? "Failed to update meal plan")
    toast.success(`Meal plan "${json.data.name}" updated!`)
    setShowForm(false)
    setEditingPlan(undefined)
    fetchPlans()
  }

  const handleDeleteConfirm = async () => {
    if (!deletingPlan) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/meal-plans/${deletingPlan.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message ?? "Failed to delete meal plan")
      toast.success(`Meal plan "${deletingPlan.name}" deleted`)
      setDeletingPlan(null)
      fetchPlans()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (plan: MealPlanResponseDto) => {
    setEditingPlan(plan)
    setShowForm(true)
  }

  const handleDelete = (plan: MealPlanResponseDto) => {
    setDeletingPlan(plan)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPlan(undefined)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
                <CalendarDays className="h-9 w-9 text-primary" />
                Meal Plans
              </h1>
              <p className="text-muted-foreground">
                Plan your weekly meals and manage your nutrition schedule
              </p>
            </div>
            {!showForm && (
              <Button
                // onClick={() => {
                //   if (!currentUserId) {
                //     toast.error("You must be logged in to create a meal plan")
                //     return
                //   }
                //   setShowForm(true)
                // }}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Meal Plan
              </Button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingPlan ? "Edit Meal Plan" : "New Meal Plan"}</CardTitle>
                <CardDescription>
                  {editingPlan
                    ? "Update your weekly meal schedule."
                    : "Plan your meals for the week."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MealPlanForm
                  plan={editingPlan}
                  onSubmit={editingPlan ? handleUpdate : handleCreate}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          )}

          {/* Table */}
          {!showForm && (
            <MealPlansTable
              data={result.data}
              total={result.total}
              page={result.page}
              totalPages={result.totalPages}
              loading={loading}
              onPageChange={setPage}
              onSearch={handleSearch}
              onEdit={handleEdit}
              onDelete={handleDelete}
            //   currentUserId={currentUserId}
            />
          )}
        </div>
      </div>
      <Footer />

      <DeleteMealPlanDialog
        open={deletingPlan !== null && !isDeleting}
        planName={deletingPlan?.name ?? ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPlan(null)}
      />
    </div>
  )
}
