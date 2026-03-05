/**
 * Auth Server Configuration (better-auth)
 *
 * Configured with:
 *  - Email/password (bcrypt hashing built-in)
 *  - Google OAuth (optional — requires env vars)
 *  - GitHub OAuth (optional — requires env vars)
 *  - Database sessions via Prisma (more secure than stateless JWT for production)
 */
import { prisma } from "@/lib/db/prisma"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        autoSignIn: true,
    },

    socialProviders: {
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? {
                google: {
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                },
            }
            : {}),
        ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
            ? {
                github: {
                    clientId: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                },
            }
            : {}),
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24,      // Refresh cookie if session is older than 1 day
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                input: false, // Clients cannot set their own role
            },
        },
    },
    trustHost: true, // Required for correct URL generation behind proxies (e.g. Vercel)
})

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
