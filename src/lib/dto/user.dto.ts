import { z } from "zod";

/**
 * Create User DTO Schema
 */
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user"]).default("user"),
});

/**
 * Update User DTO Schema
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["admin", "user"]).optional(),
});

/**
 * Inferred types from schemas
 */
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

/**
 * User Response DTO (excludes internal fields)
 */
export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}
