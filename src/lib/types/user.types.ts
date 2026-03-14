/**
 * User entity type — mirrors Prisma User model (password excluded for safety)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "ADMIN" | "USER";
