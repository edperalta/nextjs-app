import { Unit } from "@prisma/client"
import {
    CreateIngredientDto,
    IngredientResponseDto,
} from "../dto/ingredient.dto"
import { IngredientRepository } from "../repositories/ingredient.repository"

export class IngredientService {
  private repository: IngredientRepository

  constructor() {
    this.repository = IngredientRepository.getInstance()
  }

  async getAll(search?: string): Promise<IngredientResponseDto[]> {
    const ingredients = await this.repository.findAll(search)
    return ingredients.map((i) => ({
      id: i.id,
      name: i.name,
      defaultUnit: i.defaultUnit,
    }))
  }

  async create(data: CreateIngredientDto): Promise<IngredientResponseDto> {
    const ingredient = await this.repository.create({
      name: data.name,
      defaultUnit: data.defaultUnit as Unit,
    })
    return {
      id: ingredient.id,
      name: ingredient.name,
      defaultUnit: ingredient.defaultUnit,
    }
  }
}
