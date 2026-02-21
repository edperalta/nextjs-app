/**
 * Base Repository interface
 * Defines standard CRUD operations for data access layer
 */
export interface IRepository<T, TId = string> {
  findAll(): Promise<T[]>;
  findById(id: TId): Promise<T | null>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: TId, data: Partial<T>): Promise<T>;
  delete(id: TId): Promise<void>;
}

/**
 * In-memory repository implementation for development
 */
export abstract class InMemoryRepository<T extends { id: TId }, TId = string>
  implements IRepository<T, TId>
{
  protected items: Map<TId, T> = new Map()
  protected idCounter = 0

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values())
  }

  async findById(id: TId): Promise<T | null> {
    return this.items.get(id) ?? null
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const id = this.generateId()
    const item = { ...data, id } as T
    this.items.set(id, item)
    return item
  }

  async update(id: TId, data: Partial<T>): Promise<T> {
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Item with id ${id} not found`)
    }
    const updated = { ...existing, ...data }
    this.items.set(id, updated)
    return updated
  }

  async delete(id: TId): Promise<void> {
    this.items.delete(id)
  }

  protected abstract generateId(): TId;
}
