# Next.js Production-Grade Application

A scalable, production-grade Next.js application built with Clean Architecture, SOLID principles, and modern best practices.

## Architecture

This application follows the **Controller-Service-Repository** pattern with **Clean Architecture** principles:

### Layers

1. **Controllers** (`src/lib/controllers/`)
   - Handle HTTP requests and responses only
   - Validate input data using Zod schemas
   - Delegate business logic to services
   - Return standardized API responses

2. **Services** (`src/lib/services/`)
   - Implement business logic and rules
   - Coordinate between controllers and repositories
   - Handle data transformation and validation
   - Throw appropriate domain errors

3. **Repositories** (`src/lib/repositories/`)
   - Handle data access and persistence
   - Abstract data source implementation
   - Provide CRUD operations
   - Currently using in-memory storage (easily replaceable with databases)

4. **DTOs** (`src/lib/dto/`)
   - Define data transfer objects
   - Validate data with Zod schemas
   - Establish clear boundaries between layers

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── users/        # User endpoints
│   ├── users/            # Users page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── users-table.tsx   # Users table with TanStack Table
│   └── user-form.tsx     # User form with React Hook Form
└── lib/                   # Core business logic
    ├── controllers/       # HTTP controllers
    ├── services/          # Business services
    ├── repositories/      # Data repositories
    ├── dto/              # Data Transfer Objects
    ├── types/            # TypeScript types
    └── utils/            # Utility functions
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Tables**: TanStack Table
- **Forms**: React Hook Form
- **Validation**: Zod
- **State Management**: React Hooks

## Features

- ✅ **Strong Typing**: No `any` types, strict TypeScript configuration
- ✅ **DTO Boundaries**: Clear data validation at boundaries
- ✅ **Error Handling**: Graceful error handling with custom error classes
- ✅ **Responsive UI**: Mobile-first responsive design
- ✅ **Optimistic Updates**: Immediate UI feedback on user actions
- ✅ **Clean Architecture**: Separation of concerns
- ✅ **SOLID Principles**: Single responsibility, dependency inversion, etc.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run type checking
npm run type-check
```

### Development

The app will be available at [http://localhost:3000](http://localhost:3000)

- Home page: `/`
- Users page: `/users`
- API endpoints: `/api/users`

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Request/Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
  };
}
```

## Code Standards

### TypeScript

- Strict mode enabled
- No `any` types allowed
- All functions must have explicit return types
- Use interfaces for public APIs, types for internal use

### Error Handling

- Use custom error classes (AppError, ValidationError, NotFoundError, etc.)
- All errors are caught and transformed into standardized responses
- Zod validation errors are automatically handled

### Naming Conventions

- **Files**: kebab-case (e.g., `user.service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions**: camelCase (e.g., `getUsers`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## Testing

The application is structured to be easily testable:

- Controllers can be tested independently with mock services
- Services can be tested with mock repositories
- Repositories can be tested with mock data sources

## Extending the Application

### Adding a New Feature

1. **Define the entity type** in `src/lib/types/`
2. **Create DTOs** with Zod schemas in `src/lib/dto/`
3. **Implement repository** extending `InMemoryRepository` in `src/lib/repositories/`
4. **Implement service** extending `BaseService` in `src/lib/services/`
5. **Implement controller** extending `BaseController` in `src/lib/controllers/`
6. **Create API routes** in `src/app/api/`
7. **Build UI components** using shadcn/ui components

### Replacing In-Memory Storage

To replace the in-memory storage with a real database:

1. Install database client (e.g., Prisma, Drizzle)
2. Create new repository implementations
3. Update service constructors to use new repositories
4. No changes needed to controllers or UI

## Production Considerations

- Replace in-memory storage with a real database
- Add authentication and authorization
- Implement rate limiting
- Add logging and monitoring
- Set up CI/CD pipeline
- Configure environment variables
- Add comprehensive tests
- Enable HTTPS
- Set up error tracking (e.g., Sentry)

## License

MIT

## Author

Built with ❤️ following Clean Architecture principles
