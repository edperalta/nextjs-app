/**
 * Base Service interface
 * Defines business logic layer operations
 */
export interface IService<T, TCreateDto, TUpdateDto, TId = string> {
  getAll(): Promise<T[]>;
  getById(id: TId): Promise<T>;
  create(data: TCreateDto): Promise<T>;
  update(id: TId, data: TUpdateDto): Promise<T>;
  delete(id: TId): Promise<void>;
}

/**
 * Base Service implementation
 */
export abstract class BaseService<T, TCreateDto, TUpdateDto, TId = string>
  implements IService<T, TCreateDto, TUpdateDto, TId>
{
  abstract getAll(): Promise<T[]>;
  abstract getById(id: TId): Promise<T>;
  abstract create(data: TCreateDto): Promise<T>;
  abstract update(id: TId, data: TUpdateDto): Promise<T>;
  abstract delete(id: TId): Promise<void>;
}
