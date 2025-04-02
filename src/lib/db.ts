import { PrismaClient } from "@prisma/client"

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development'

// Create a mock PrismaClient for development
class MockPrismaClient {
  user = {
    findUnique: async () => null,
    create: async (data: any) => ({
      id: 'mock-user-id',
      ...data.data,
      password: '[hashed-password]',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  }
}

// For global singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | MockPrismaClient | undefined
}

// Use mock in development or try to connect to real DB
export const db = globalForPrisma.prisma ?? (
  isDev 
    ? new MockPrismaClient() as any
    : new PrismaClient()
)

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db 