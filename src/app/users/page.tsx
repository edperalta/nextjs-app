"use client"

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
import { UserForm } from "@/components/user-form"
import { UsersTable } from "@/components/users-table"
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "@/lib/dto/user.dto"
import * as React from "react"
import { toast } from "sonner"

export default function UsersPage() {
  const [users, setUsers] = React.useState<UserResponseDto[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<
    UserResponseDto | undefined
  >(undefined)

  // Fetch users
  React.useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const result = await response.json()
      if (result.success) {
        setUsers(result.data)
      } else {
        toast.error("Failed to load users")
      }
    } catch {
      toast.error("Network error — could not load users")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (data: CreateUserDto) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to create user")
    }

    setUsers([result.data, ...users])
    setShowForm(false)
    toast.success(`User "${result.data.name}" created successfully`)
  }

  const handleUpdateUser = async (data: UpdateUserDto) => {
    if (!editingUser) return

    const response = await fetch(`/api/users/${editingUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to update user")
    }

    // Optimistic update
    setUsers(users.map((u) => (u.id === editingUser.id ? result.data : u)))
    setShowForm(false)
    setEditingUser(undefined)
    toast.success(`User "${result.data.name}" updated successfully`)
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    const response = await fetch(`/api/users/${id}`, { method: "DELETE" })

    if (!response.ok) {
      const result = await response.json()
      toast.error(result.error?.message || "Failed to delete user")
      return
    }

    setUsers(users.filter((u) => u.id !== id))
    toast.success("User deleted")
  }

  const handleEdit = (user: UserResponseDto) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(undefined)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-sm text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Users Management
              </h1>
              <p className="text-muted-foreground">
                Manage users in your application
              </p>
            </div>
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="w-full sm:w-auto"
              >
                <span className="mr-2">➕</span>
                Add User
              </Button>
            )}
          </div>

          {showForm ? (
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {editingUser ? "✏️ Edit User" : "➕ Create New User"}
                    </CardTitle>
                    <CardDescription className="mt-1.5">
                      {editingUser
                        ? "Update the user information below"
                        : "Fill in the form to create a new user"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <UserForm
                  user={editingUser}
                  onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <div>
                    <CardTitle className="text-2xl">All Users</CardTitle>
                    <CardDescription className="mt-1">
                      {users.length} {users.length === 1 ? "user" : "users"} in
                      the system
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <UsersTable
                  data={users}
                  onEdit={handleEdit}
                  onDelete={handleDeleteUser}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
