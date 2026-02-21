/**
 * Prisma Seed Script
 * 
 * Populates the database with initial data for development and testing.
 * Run with: npm run prisma:seed
 * 
 * @see https://www.prisma.io/docs/guides/database/seed-database
 */

import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Main seed function
 */
async function main() {
    console.log("🌱 Starting database seed...");

    // Clear existing data (optional - comment out in production)
    await prisma.user.deleteMany();
    console.log("  ✓ Cleared existing users");

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@example.com",
            role: UserRole.ADMIN,
        },
    });
    console.log(`  ✓ Created admin user: ${admin.email}`);

    // Create regular users
    const users = await prisma.user.createMany({
        data: [
            {
                name: "John Doe",
                email: "john.doe@example.com",
                role: UserRole.USER,
            },
            {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                role: UserRole.USER,
            },
            {
                name: "Bob Johnson",
                email: "bob.johnson@example.com",
                role: UserRole.USER,
            },
        ],
    });
    console.log(`  ✓ Created ${users.count} regular users`);

    // Summary
    const totalUsers = await prisma.user.count();
    console.log(`\n✅ Seed completed successfully!`);
    console.log(`   Total users in database: ${totalUsers}`);
}

/**
 * Execute seed and handle errors
 */
main()
    .catch((error) => {
        console.error("❌ Seed failed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
