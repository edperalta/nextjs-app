"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  CreateUserDto,
  createUserSchema,
  updateUserSchema,
  UserResponseDto,
} from "@/lib/dto/user.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { type Resolver, useForm } from "react-hook-form"

interface UserFormProps {
  user?: UserResponseDto;
  onSubmit: (data: CreateUserDto) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(
      user ? updateUserSchema : createUserSchema
    ) as Resolver<CreateUserDto>,
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
        }
      : {
          name: "",
          email: "",
          role: "USER",
        },
  })

  const onFormSubmit = async (data: CreateUserDto) => {
    try {
      setError(null)
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-2">
          <AlertDescription className="flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label
            htmlFor="name"
            className="text-sm font-semibold flex items-center gap-1"
          >
            👤 Name
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="John Doe"
            disabled={isSubmitting}
            className="h-11"
          />
          {errors.name && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span>•</span>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold flex items-center gap-1"
          >
            📧 Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john.doe@example.com"
            disabled={isSubmitting}
            className="h-11"
          />
          {errors.email && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span>•</span>
              {errors.email.message}
            </p>
          )}
        </div>

        {!user && (
          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold flex items-center gap-1"
            >
              🔒 Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Min. 8 characters"
              disabled={isSubmitting}
              className="h-11"
            />
            {errors.password && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span>•</span>
                {errors.password.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="role"
            className="text-sm font-semibold flex items-center gap-1"
          >
            🎭 Role
          </Label>
          <Select
            id="role"
            {...register("role")}
            disabled={isSubmitting}
            className="h-11"
          >
            <option value="USER">👤 User</option>
            <option value="ADMIN">👑 Admin</option>
          </Select>
          {errors.role && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span>•</span>
              {errors.role.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:flex-1 sm:max-w-xs h-11"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              Saving...
            </span>
          ) : (
            <span>{user ? "💾 Update User" : "➕ Create User"}</span>
          )}
        </Button>
      </div>
    </form>
  )
}
