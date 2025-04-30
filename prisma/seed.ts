import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding...`)

  // Delete all existing data
  await prisma.fAQ.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.user.deleteMany()

  // Create test admin
  const password = await hash('password123', 10)
  
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: UserRole.ADMIN,
    }
  })
  
  await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Regular User',
      password,
      role: UserRole.USER,
    }
  })

  console.log('Database seeded with test users!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 