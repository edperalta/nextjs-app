/**
 * User entity type — mirrors Prisma User model
 */
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "ADMIN" | "USER";
