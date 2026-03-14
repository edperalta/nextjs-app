import { UserRole } from "@prisma/client"
import { hashPassword } from "@/lib/auth/auth"
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "../dto/user.dto"
import { UserRepository } from "../repositories/user.repository"
import { User } from "../types/user.types"
import { NotFoundError } from "../utils/errors"
import { BaseService } from "./base.service"

/**
 * User Service
 * Contains business logic for User operations
 */
export class UserService extends BaseService<
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
  string
> {
  private repository: UserRepository

  constructor() {
    super()
    this.repository = UserRepository.getInstance()
  }

  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.findAll()
    return users.map(this.toResponseDto)
  }

  async getById(id: string): Promise<UserResponseDto> {
    const user = await this.repository.findById(id)
    if (!user) throw new NotFoundError(`User with id ${id} not found`)
    return this.toResponseDto(user)
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const hashed = await hashPassword(data.password)
    const user = await this.repository.create({
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      password: hashed,
    })
    return this.toResponseDto(user)
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    const existing = await this.repository.findById(id)
    if (!existing) throw new NotFoundError(`User with id ${id} not found`)

    const user = await this.repository.update(id, {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role as UserRole }),
    })
    return this.toResponseDto(user)
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id)
    if (!existing) throw new NotFoundError(`User with id ${id} not found`)
    await this.repository.delete(id)
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  }
}
