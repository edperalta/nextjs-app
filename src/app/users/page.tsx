"use client";

import * as React from "react";
import { UsersTable } from "@/components/users-table";
import { UserForm } from "@/components/user-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "@/lib/dto/user.dto";

export default function UsersPage() {
  const [users, setUsers] = React.useState<UserResponseDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<
    UserResponseDto | undefined
  >(undefined);

  // Fetch users
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserDto) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to create user");
    }

    // Optimistic update
    setUsers([...users, result.data]);
    setShowForm(false);
  };

  const handleUpdateUser = async (data: UpdateUserDto) => {
    if (!editingUser) return;

    const response = await fetch(`/api/users/${editingUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to update user");
    }

    // Optimistic update
    setUsers(users.map((u) => (u.id === editingUser.id ? result.data : u)));
    setShowForm(false);
    setEditingUser(undefined);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error?.message || "Failed to delete user");
    }

    // Optimistic update
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleEdit = (user: UserResponseDto) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users in your application
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add User</Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </CardTitle>
            <CardDescription>
              {editingUser
                ? "Update the user information below"
                : "Fill in the form to create a new user"}
            </CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A list of all users in the system
            </CardDescription>
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
  );
}
