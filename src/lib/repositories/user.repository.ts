import { prisma } from "@/lib/db/prisma"
import { Prisma, UserRole } from "@prisma/client"
import { User } from "../types/user.types"
import { ConflictError, NotFoundError } from "../utils/errors"

/**
 * User Repository — Prisma implementation
 * All query logic lives here; no business rules.
 */
export class UserRepository {
  private static instance: UserRepository

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository()
    }
    return UserRepository.instance
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: {
    name: string;
    email: string;
    role: UserRole;
  }): Promise<User> {
    try {
      return await prisma.user.create({ data })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictError("A user with this email already exists")
      }
      throw e
    }
  }

  async update(
    id: string,
    data: Partial<{ name: string; email: string; role: UserRole }>
  ): Promise<User> {
    try {
      return await prisma.user.update({ where: { id }, data })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new NotFoundError(`User ${id} not found`)
        if (e.code === "P2002")
          throw new ConflictError("A user with this email already exists")
      }
      throw e
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundError(`User ${id} not found`)
      }
      throw e
    }
  }
}

