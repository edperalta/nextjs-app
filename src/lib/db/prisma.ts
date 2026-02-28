/**
 * Prisma Client Singleton
 * 
 * Ensures a single instance of Prisma Client is used throughout the application.
 * This prevents connection pool exhaustion in development with hot reloading.
 * 
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from "@prisma/client"

/**
 * Global type declaration for PrismaClient
 */
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

/**
 * Prisma Client configuration
 */
const prismaClientSingleton = () => {
    return new PrismaClient({
        log:
            process.env.DEBUG_PRISMA === "true"
                ? ["query", "error", "warn"]
                : ["error"],
    })
}

/**
 * Singleton instance of Prisma Client
 * 
 * In development, reuse the cached client to avoid creating multiple instances.
 * In production, create a new client for each deployment.
 */
export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma
}

/**
 * Graceful shutdown handler for Prisma Client
 */
export async function disconnectPrisma() {
    await prisma.$disconnect()
}

/**
 * Default export for convenience
 */
export default prisma
