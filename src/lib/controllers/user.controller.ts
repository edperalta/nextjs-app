import { NextRequest, NextResponse } from "next/server"
import { createUserSchema, updateUserSchema } from "../dto/user.dto"
import { UserService } from "../services/user.service"
import { BaseController } from "./base.controller"

/**
 * User Controller
 * Handles HTTP requests for User endpoints
 */
export class UserController extends BaseController {
  private service: UserService

  constructor() {
    super()
    this.service = new UserService()
  }

  /**
   * GET /api/users - Get all users
   */
  async getAll(): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const users = await this.service.getAll()
      return this.success(users)
    })
  }

  /**
   * GET /api/users/:id - Get user by ID
   */
  async getById(id: string): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const user = await this.service.getById(id)
      return this.success(user)
    })
  }

  /**
   * POST /api/users - Create new user
   */
  async create(request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const body = await this.getBody(request)
      const data = createUserSchema.parse(body)
      const user = await this.service.create(data)
      return this.success(user, 201)
    })
  }

  /**
   * PATCH /api/users/:id - Update user
   */
  async update(id: string, request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const body = await this.getBody(request)
      const data = updateUserSchema.parse(body)
      const user = await this.service.update(id, data)
      return this.success(user)
    })
  }

  /**
   * DELETE /api/users/:id - Delete user
   */
  async delete(id: string): Promise<NextResponse> {
    return this.handleRequest(async () => {
      await this.service.delete(id)
      return this.success({ message: "User deleted successfully" })
    })
  }
}
