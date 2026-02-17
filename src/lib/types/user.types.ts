/**
 * User entity type
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User status enum
 */
export type UserRole = "admin" | "user";
