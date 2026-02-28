"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RecipeResponseDto } from "@/lib/dto/recipe.dto"
import { formatDate } from "@/lib/utils"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react"
import * as React from "react"

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "LUNCH", label: "Lunch" },
  { value: "DINNER", label: "Dinner" },
  { value: "SNACK", label: "Snack" },
  { value: "DESSERT", label: "Dessert" },
  { value: "APPETIZER", label: "Appetizer" },
  { value: "SOUP", label: "Soup" },
  { value: "SALAD", label: "Salad" },
  { value: "BEVERAGE", label: "Beverage" },
]

const HEALTH_OPTIONS = [
  { value: "", label: "All Scores" },
  { value: "VERY_HEALTHY", label: "Very Healthy" },
  { value: "HEALTHY", label: "Healthy" },
  { value: "MODERATE", label: "Moderate" },
  { value: "INDULGENT", label: "Indulgent" },
]

const HEALTH_COLORS: Record<string, string> = {
  VERY_HEALTHY: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  HEALTHY: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  MODERATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  INDULGENT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

interface RecipesTableProps {
  data: RecipeResponseDto[]
  total: number
  page: number
  totalPages: number
  loading: boolean
  onPageChange: (page: number) => void
  onSearch: (value: string) => void
  onCategoryChange: (value: string) => void
  onHealthChange: (value: string) => void
  onView: (recipe: RecipeResponseDto) => void
  onEdit: (recipe: RecipeResponseDto) => void
  onDelete: (recipe: RecipeResponseDto) => void
  currentUserId?: string
}

export function RecipesTable({
  data,
  total,
  page,
  totalPages,
  loading,
  onPageChange,
  onSearch,
  onCategoryChange,
  onHealthChange,
  onView,
  onEdit,
  onDelete,
  currentUserId,
}: RecipesTableProps) {
  const [searchValue, setSearchValue] = React.useState("")

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
      onSearch(e.target.value)
    },
    [onSearch]
  )

  const columns = React.useMemo<ColumnDef<RecipeResponseDto>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Recipe",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.getValue("title")}</p>
            <p className="text-xs text-muted-foreground truncate max-w-xs">
              {row.original.description}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {(row.getValue("category") as string).charAt(0) +
              (row.getValue("category") as string).slice(1).toLowerCase()}
          </Badge>
        ),
      },
      {
        accessorKey: "healthScore",
        header: "Health",
        cell: ({ row }) => {
          const score = row.getValue("healthScore") as string
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${HEALTH_COLORS[score]}`}
            >
              {score.replace(/_/g, " ").charAt(0) +
                score.replace(/_/g, " ").slice(1).toLowerCase()}
            </span>
          )
        },
      },
      {
        accessorKey: "servings",
        header: "Servings",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.getValue("servings")}
          </span>
        ),
      },
      {
        accessorKey: "userName",
        header: "By",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.getValue("userName")}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.getValue("createdAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const recipe = row.original
          const isOwner = currentUserId === recipe.userId
          return (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onView(recipe)}>
                <Eye className="h-4 w-4" />
              </Button>
              {isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(recipe)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(recipe)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )
        },
      },
    ],
    [currentUserId, onView, onEdit, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search recipes..."
          value={searchValue}
          onChange={handleSearchChange}
          className="sm:max-w-xs"
        />
        <Select onChange={(e) => onCategoryChange(e.target.value)} className="sm:w-44">
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <Select onChange={(e) => onHealthChange(e.target.value)} className="sm:w-44">
          {HEALTH_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-10">
                  No recipes found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} recipe{total !== 1 ? "s" : ""} total
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
