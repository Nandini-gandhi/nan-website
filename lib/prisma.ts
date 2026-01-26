import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient | undefined

export function getPrisma(): PrismaClient {
    if (prismaInstance) return prismaInstance

    // Check if we should use Turso (only at runtime, not during build)
    const useTurso =
        typeof window === 'undefined' &&
        process.env.TURSO_DATABASE_URL &&
        process.env.TURSO_AUTH_TOKEN &&
        process.env.NODE_ENV === 'production'

    if (useTurso) {
        try {
            const { PrismaLibSql } = require("@prisma/adapter-libsql")
            const { createClient } = require("@libsql/client")

            const libsql = createClient({
                url: process.env.TURSO_DATABASE_URL!,
                authToken: process.env.TURSO_AUTH_TOKEN!,
            })
            const adapter = new PrismaLibSql(libsql)
            prismaInstance = new PrismaClient({ adapter } as any)
        } catch (e) {
            console.error("Failed to initialize Turso, falling back to SQLite:", e)
            prismaInstance = new PrismaClient()
        }
    } else {
        prismaInstance = new PrismaClient({
            log: process.env.NODE_ENV === "development" ? ["query"] : [],
        })
    }

    if (process.env.NODE_ENV !== "production") {
        global.prisma = prismaInstance
    }

    return prismaInstance
}

// For backward compatibility
export const prisma = global.prisma || getPrisma()
