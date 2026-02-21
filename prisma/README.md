# Prisma Database Layer

This directory contains the Prisma ORM configuration for the Next.js application.

## Structure

```
prisma/
├── schema.prisma          # Database schema and models
├── seed.ts                # Database seeding script
└── migrations/            # Database migrations
    └── 20260217031437_init/
        └── migration.sql  # Initial schema migration
```

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(255)
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  ADMIN
  USER
}
```

## Available Commands

### Development

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Apply migrations to production
npm run prisma:migrate:deploy

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Seed the database
npm run prisma:seed

# Reset database (drop all data and re-migrate)
npm run prisma:reset
```

### Database Push/Pull

```bash
# Push schema changes without creating a migration
npm run db:push

# Pull schema from existing database
npm run db:pull
```

## Seeding

The `seed.ts` script populates the database with initial data:

- **1 Admin User**: admin@example.com
- **3 Regular Users**: john.doe@, jane.smith@, bob.johnson@example.com

## Migrations

### Creating a New Migration

1. Modify `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Provide a descriptive name for your migration
4. The migration SQL will be generated in `prisma/migrations/`

### Production Deployment

```bash
npm run prisma:migrate:deploy
```

This command:
- Applies pending migrations
- Does not prompt for input
- Safe for CI/CD pipelines

## Connection

The database connection is configured via the `DATABASE_URL` environment variable in `.env`:

```env
DATABASE_URL="mysql://nextjs_user:nextjs_password@localhost:3306/nextjs_db"
```

## Prisma Client Usage

Import  the Prisma client singleton in your application:

```typescript
import prisma from "@/lib/db/prisma";

// Example: Find all users
const users = await prisma.user.findMany();

// Example: Create a user
const newUser = await prisma.user.create({
  data: {
    name: "Jane Doe",
    email: "jane@example.com",
    role: "USER",
  },
});
```

## Best Practices

1. **Always use migrations** in production - never use `db push`
2. **Run `prisma generate`** after pulling changes that modify the schema
3. **Use transactions** for operations that modify multiple tables
4. **Gracefully disconnect** when shutting down the application
5. **Use the singleton pattern** to avoid connection exhaustion

## Troubleshooting

### "Prisma Client not found"

```bash
npm run prisma:generate
```

### "Shadow database" permissions error

The MySQL user needs `CREATE` and `DROP` permissions. This is already configured in `docker/mysql/init/01-init.sql`.

### Connection refused

Ensure the MySQL container is running:

```bash
npm run docker:db:up
npm run docker:db:logs
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
