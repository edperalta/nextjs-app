import { InMemoryRepository } from "./base.repository";
import { User } from "../types/user.types";

/**
 * User Repository
 * Handles data access for User entities
 */
export class UserRepository extends InMemoryRepository<User, string> {
  private static instance: UserRepository;

  private constructor() {
    super();
    // Seed with sample data
    this.seedData();
  }

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  protected generateId(): string {
    this.idCounter++;
    return `user-${this.idCounter}`;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find((user) => user.email === email) ?? null;
  }

  /**
   * Seed initial data
   */
  private seedData(): void {
    const now = new Date();
    const users: User[] = [
      {
        id: this.generateId(),
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.generateId(),
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "user",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.generateId(),
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "user",
        createdAt: now,
        updatedAt: now,
      },
    ];

    users.forEach((user) => this.items.set(user.id, user));
  }
}
