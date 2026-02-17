import { BaseService } from "./base.service";
import { User } from "../types/user.types";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "../dto/user.dto";
import { UserRepository } from "../repositories/user.repository";
import { NotFoundError, ConflictError } from "../utils/errors";

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
  private repository: UserRepository;

  constructor() {
    super();
    this.repository = UserRepository.getInstance();
  }

  /**
   * Get all users
   */
  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.findAll();
    return users.map(this.toResponseDto);
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<UserResponseDto> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return this.toResponseDto(user);
  }

  /**
   * Create new user
   */
  async create(data: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const now = new Date();
    const user = await this.repository.create({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    return this.toResponseDto(user);
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.repository.findById(id);
    if (!existingUser) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await this.repository.findByEmail(data.email);
      if (userWithEmail) {
        throw new ConflictError("User with this email already exists");
      }
    }

    const updatedUser = await this.repository.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    return this.toResponseDto(updatedUser);
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    await this.repository.delete(id);
  }

  /**
   * Convert User entity to Response DTO
   */
  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
