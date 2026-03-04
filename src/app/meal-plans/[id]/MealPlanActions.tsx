"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

interface Props {
  planId: string
  planName: string
}

export function MealPlanActions({ planId, planName }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/meal-plans/${planId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message ?? "Failed to delete")
      toast.success(`"${planName}" deleted`)
      router.push("/meal-plans")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete")
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/meal-plans?edit=${planId}`)}
      >
        <Pencil className="h-4 w-4 mr-1.5" />
        Edit
      </Button>
      {confirming ? (
        <>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="text-destructive border-destructive/50 hover:bg-destructive/10"
          onClick={() => setConfirming(true)}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      )}
    </div>
  )
}
