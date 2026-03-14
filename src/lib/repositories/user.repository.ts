import { prisma } from "@/lib/db/prisma"
import { Prisma, UserRole } from "@prisma/client"
import { User } from "../types/user.types"
import { ConflictError, NotFoundError } from "../utils/errors"

// Password is never returned from repository find methods
const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

/**
 * User Repository — Prisma implementation
 * All query logic lives here; no business rules.
 *
 * Note: UserRepository does not implement IRepository directly because
 * the create signature requires a `password` field not present on the
 * public User type (password is intentionally excluded from responses).
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
    return prisma.user.findMany({ select: USER_SAFE_SELECT, orderBy: { createdAt: "desc" } })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id }, select: USER_SAFE_SELECT })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email }, select: USER_SAFE_SELECT })
  }

  async create(data: {
    name: string;
    email: string;
    role: UserRole;
    password: string;
  }): Promise<User> {
    try {
      return await prisma.user.create({ data, select: USER_SAFE_SELECT })
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
      return await prisma.user.update({ where: { id }, data, select: USER_SAFE_SELECT })
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

