# Architecture Documentation

## Overview

This application implements **Clean Architecture** principles combined with the **Controller-Service-Repository** pattern to create a maintainable, testable, and scalable codebase.

## Architectural Principles

### 1. Separation of Concerns

Each layer has a single, well-defined responsibility:

- **Presentation Layer**: UI components and pages
- **API Layer**: Controllers handling HTTP
- **Business Logic Layer**: Services containing domain logic
- **Data Access Layer**: Repositories managing data

### 2. Dependency Rule

Dependencies point inward:
- Controllers depend on Services
- Services depend on Repositories
- Inner layers know nothing about outer layers

### 3. SOLID Principles

#### Single Responsibility Principle (SRP)
Each class has one reason to change:
- Controllers only handle HTTP
- Services only contain business logic
- Repositories only manage data access

#### Open/Closed Principle (OCP)
Classes are open for extension, closed for modification:
- Base classes provide extensibility points
- New features add new classes, not modify existing ones

#### Liskov Substitution Principle (LSP)
Implementations can be substituted:
- Any repository implementing `IRepository` can be swapped
- Services work with interfaces, not concrete implementations

#### Interface Segregation Principle (ISP)
Interfaces are focused and minimal:
- `IRepository<T>` defines only essential CRUD operations
- `IService<T>` defines only business operations

#### Dependency Inversion Principle (DIP)
Depend on abstractions, not concretions:
- Services depend on repository interfaces
- Controllers depend on service abstractions

## Layer Details

### Controllers

**Location**: `src/lib/controllers/`

**Responsibilities**:
- Receive HTTP requests
- Validate request data (using Zod)
- Call appropriate service methods
- Transform service responses to HTTP responses
- Handle errors and return appropriate status codes

**Example**:
```typescript
export class UserController extends BaseController {
  async getAll(): Promise<NextResponse> {
    return this.handleRequest(async () => {
      const users = await this.service.getAll();
      return this.success(users);
    });
  }
}
```

**Key Points**:
- No business logic
- No direct database access
- Stateless request handlers
- Standard error handling

### Services

**Location**: `src/lib/services/`

**Responsibilities**:
- Implement business rules
- Validate business constraints
- Coordinate between repositories
- Transform data between layers
- Throw domain-specific errors

**Example**:
```typescript
export class UserService extends BaseService {
  async create(data: CreateUserDto): Promise<UserResponseDto> {
    // Business rule: check for duplicate email
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("Email already exists");
    }
    
    // Create user
    const user = await this.repository.create(data);
    return this.toResponseDto(user);
  }
}
```

**Key Points**:
- Contains all business logic
- Orchestrates repository calls
- Returns DTOs, not entities
- Validates business rules

### Repositories

**Location**: `src/lib/repositories/`

**Responsibilities**:
- Abstract data source
- Provide CRUD operations
- Query data
- Handle data persistence

**Example**:
```typescript
export class UserRepository extends InMemoryRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(u => u.email === email) ?? null;
  }
}
```

**Key Points**:
- No business logic
- Independent of business rules
- Can be swapped with different implementations
- Focused on data access only

### DTOs (Data Transfer Objects)

**Location**: `src/lib/dto/`

**Responsibilities**:
- Define data structure for layer boundaries
- Validate data with Zod schemas
- Ensure type safety
- Separate internal entities from external APIs

**Example**:
```typescript
export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["admin", "user"]).default("user"),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
```

**Key Points**:
- Explicit validation rules
- Type-safe transformations
- Clear API contracts
- Protection against over-posting

## Data Flow

### Creating a User

```
1. Client Request
   POST /api/users
   Body: { name, email, role }
   
2. Controller Layer
   - UserController receives request
   - Validates with createUserSchema
   - Calls service.create()
   
3. Service Layer
   - UserService validates business rules
   - Checks for duplicate email
   - Calls repository.create()
   
4. Repository Layer
   - UserRepository saves to data store
   - Returns User entity
   
5. Service Layer
   - Transforms User to UserResponseDto
   - Returns DTO to controller
   
6. Controller Layer
   - Wraps in ApiResponse
   - Returns HTTP 201 with user data
```

## Error Handling

### Error Hierarchy

```
AppError (base)
├── ValidationError (400)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
└── ConflictError (409)
```

### Error Flow

```
1. Error thrown in any layer
2. Caught by controller's handleRequest()
3. Transformed to appropriate HTTP response
4. Returned to client with error details
```

### Example

```typescript
// In service
throw new NotFoundError(`User with id ${id} not found`);

// Caught and transformed by controller
{
  success: false,
  error: {
    message: "User with id user-1 not found",
    code: "NOT_FOUND"
  },
  meta: { timestamp: "2024-01-01T00:00:00.000Z" }
}
// HTTP Status: 404
```

## Type Safety

### No `any` Types

```typescript
// ❌ Bad
function getData(): any { ... }

// ✅ Good
function getData(): UserResponseDto[] { ... }
```

### Strict TypeScript Config

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true
}
```

## Testing Strategy

### Unit Tests

- **Controllers**: Mock services, test HTTP handling
- **Services**: Mock repositories, test business logic
- **Repositories**: Mock data source, test queries

### Integration Tests

- Test complete request-response cycle
- Use test database
- Verify layer interactions

### Example Test Structure

```typescript
describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;
  
  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    service = new UserService(mockRepository);
  });
  
  it('should throw ConflictError if email exists', async () => {
    mockRepository.findByEmail.mockResolvedValue(existingUser);
    
    await expect(service.create(newUserData))
      .rejects
      .toThrow(ConflictError);
  });
});
```

## Benefits

### Maintainability
- Clear separation of concerns
- Easy to locate and fix bugs
- Predictable code organization

### Testability
- Layers can be tested independently
- Easy to mock dependencies
- High test coverage possible

### Scalability
- Easy to add new features
- Components can be replaced
- Multiple teams can work in parallel

### Type Safety
- Compile-time error detection
- IDE autocomplete support
- Refactoring confidence

### Flexibility
- Swap data sources without changing business logic
- Change UI without affecting API
- Replace implementations easily

## Migration Path

### From In-Memory to Database

1. Create new repository implementation:
```typescript
export class PostgresUserRepository implements IRepository<User> {
  // Implement using Prisma or other ORM
}
```

2. Update dependency injection:
```typescript
const repository = new PostgresUserRepository();
const service = new UserService(repository);
```

3. No changes to controllers or services needed!

## Conclusion

This architecture provides:
- Clean separation of concerns
- Type-safe, maintainable code
- Easy testing and debugging
- Flexibility for future changes
- Production-ready patterns

The patterns used here scale from small projects to large enterprise applications.
