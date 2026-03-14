/**
 * Prisma Seed Script
 *
 * Populates the database with initial data for development and testing.
 * Run with: npm run prisma:seed
 *
 * @see https://www.prisma.io/docs/guides/database/seed-database
 */

import { PrismaClient, Unit, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const SEED_USERS = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin1234!",
    role: UserRole.ADMIN,
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "User1234!",
    role: UserRole.USER,
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "User1234!",
    role: UserRole.USER,
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    password: "User1234!",
    role: UserRole.USER,
  },
]

const SEED_INGREDIENTS: { name: string; defaultUnit: Unit }[] = [
    { name: "Chicken breast", defaultUnit: "GRAMS" },
    { name: "All-purpose flour", defaultUnit: "GRAMS" },
    { name: "Whole milk", defaultUnit: "MILLILITERS" },
    { name: "Eggs", defaultUnit: "PIECES" },
    { name: "Butter", defaultUnit: "GRAMS" },
    { name: "Olive oil", defaultUnit: "TABLESPOON" },
    { name: "Garlic", defaultUnit: "PIECES" },
    { name: "Onion", defaultUnit: "PIECES" },
    { name: "Salt", defaultUnit: "TEASPOON" },
    { name: "Black pepper", defaultUnit: "TEASPOON" },
    { name: "Sugar", defaultUnit: "GRAMS" },
    { name: "Tomato", defaultUnit: "PIECES" },
    { name: "Tomato paste", defaultUnit: "TABLESPOON" },
    { name: "Chicken broth", defaultUnit: "MILLILITERS" },
    { name: "Heavy cream", defaultUnit: "MILLILITERS" },
    { name: "Parmesan cheese", defaultUnit: "GRAMS" },
    { name: "Lemon juice", defaultUnit: "TABLESPOON" },
    { name: "Cumin", defaultUnit: "TEASPOON" },
    { name: "Paprika", defaultUnit: "TEASPOON" },
    { name: "Canned black beans", defaultUnit: "GRAMS" },
    { name: "Rice", defaultUnit: "GRAMS" },
    { name: "Pasta", defaultUnit: "GRAMS" },
    { name: "Spinach", defaultUnit: "GRAMS" },
    { name: "Broccoli", defaultUnit: "GRAMS" },
    { name: "Cheddar cheese", defaultUnit: "GRAMS" },
]

/**
 * Seed ingredients into the global catalog
 */
async function seedIngredients() {
    let created = 0
    for (const ingredient of SEED_INGREDIENTS) {
        await prisma.ingredient.upsert({
            where: { name: ingredient.name },
            update: {},
            create: ingredient,
        })
        created++
    }
    console.log(`  ✓ Seeded ${created} ingredients`)
}

/**
 * Main seed function
 */async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing data
  await prisma.recipeIngredient.deleteMany()
  await prisma.recipe.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.user.deleteMany()
  console.log("  ✓ Cleared existing data")

  // Seed ingredients
  await seedIngredients()

  for (const userData of SEED_USERS) {
    const hashed = await bcrypt.hash(userData.password, 12)
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashed,
        role: userData.role,
      },
    })
    console.log(`  ✓ Created user: ${userData.email} (${userData.role})`)
  }

  // Summary
  const totalUsers = await prisma.user.count()
  console.log(`\n✅ Seed completed successfully!`)
  console.log(`   Total users in database: ${totalUsers}`)
  console.log(`\n   Credentials for testing:`)
  for (const u of SEED_USERS) {
    console.log(`   ${u.role.padEnd(6)} → ${u.email} / ${u.password}`)
  }
}

/**
 * Execute seed and handle errors
 */
main()
  .catch((error) => {
    console.error("❌ Seed failed:")
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
