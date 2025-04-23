import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Add debugging message
console.log("Initializing Prisma client...")

// Use a single instance of Prisma Client in development to prevent multiple connections
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// Verify database connection on startup
prisma.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((e) => console.error('Database connection failed:', e))

export default prisma 