"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MealPlanResponseDto } from "@/lib/dto/meal-plan.dto"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2, Users } from "lucide-react"
import Link from "next/link"
import * as React from "react"

function formatShort(ymd: string) {
  return new Date(ymd + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface MealPlansTableProps {
  data: MealPlanResponseDto[]
  total: number
  page: number
  totalPages: number
  loading: boolean
  onPageChange: (page: number) => void
  onSearch: (value: string) => void
  onEdit: (plan: MealPlanResponseDto) => void
  onDelete: (plan: MealPlanResponseDto) => void
  currentUserId?: string
}

export function MealPlansTable({
  data,
  total,
  page,
  totalPages,
  loading,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  currentUserId,
}: MealPlansTableProps) {
  const columns = React.useMemo<ColumnDef<MealPlanResponseDto>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Plan Name",
        cell: ({ row }) => (
          <Link
            href={`/meal-plans/${row.original.id}`}
            className="font-medium hover:underline truncate max-w-[200px] block"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        id: "dateRange",
        header: "Date Range",
        cell: ({ row }) => (
          <span className="text-sm">
            {formatShort(row.original.startDate)}
            {row.original.startDate !== row.original.endDate && (
              <> &rarr; {formatShort(row.original.endDate)}</>
            )}
          </span>
        ),
      },
      {
        accessorKey: "servings",
        header: "People",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            {getValue<number>()}
          </div>
        ),
      },
      {
        id: "meals",
        header: "Meals",
        cell: ({ row }) => {
          const days = new Set(row.original.entries.map((e) => e.planDate)).size
          return (
            <div className="flex flex-col gap-0.5">
              <Badge variant="secondary">{row.original.entries.length} meals</Badge>
              <span className="text-xs text-muted-foreground">{days} day{days !== 1 ? "s" : ""}</span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const plan = row.original
          const isOwner = plan.userId === currentUserId
          return (
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`/meal-plans/${plan.id}`}
                className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title="View"
              >
                <Eye className="h-4 w-4" />
              </Link>
              {isOwner && (
                <>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(plan)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(plan)}
                    className="text-destructive hover:text-destructive"
                    title="Delete"
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
    [currentUserId, onEdit, onDelete],
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
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search plans..."
          className="max-w-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
        <span className="text-sm text-muted-foreground ml-auto">
          {total} plan{total !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
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
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No meal plans found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
