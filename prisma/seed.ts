import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding...`)

  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookplus.net' },
    update: {},
    create: {
      email: 'admin@bookplus.net',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN
    }
  })
  console.log(`Created admin user: ${admin.email}`)

  // Create regular user
  const userPassword = await hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: UserRole.USER
    }
  })
  console.log(`Created regular user: ${user.email}`)

  // Create product categories
  const gamesCategory = await prisma.productCategory.upsert({
    where: { slug: 'games' },
    update: {},
    create: {
      name: 'Games',
      slug: 'games',
      image: '/images/categories/games.jpg'
    }
  })

  const softwareCategory = await prisma.productCategory.upsert({
    where: { slug: 'software' },
    update: {},
    create: {
      name: 'Software',
      slug: 'software',
      image: '/images/categories/software.jpg'
    }
  })

  const osCategory = await prisma.productCategory.upsert({
    where: { slug: 'operating-systems' },
    update: {},
    create: {
      name: 'Operating Systems',
      slug: 'operating-systems',
      image: '/images/categories/os.jpg'
    }
  })
  
  console.log(`Created categories`)

  // Create sample products
  const windows11 = await prisma.product.upsert({
    where: { slug: 'windows-11-pro' },
    update: {},
    create: {
      title: 'Windows 11 Pro Cd Key OEM Microsoft Global',
      slug: 'windows-11-pro',
      description: 'Windows 11 Pro OEM CD Key for global activation. Includes all features of Windows 11 with enhanced security and management capabilities for businesses.',
      price: 4.99,
      images: [
        'https://ext.same-assets.com/3893671847/4214474036.jpeg',
        'https://ext.same-assets.com/3893671847/3205726074.jpeg',
        'https://ext.same-assets.com/3893671847/175483935.jpeg',
      ],
      inStock: true,
      platform: 'Windows',
      platformIcon: 'https://ext.same-assets.com/3893671847/1513979826.png',
      rewardPoints: 5,
      categoryId: osCategory.id,
      faq: {
        create: [
          {
            question: 'Will I get an invoice?',
            answer: 'Invoice will automatically generate upon placing an order.'
          },
          {
            question: 'Can I edit my invoice?',
            answer: 'Currently you cannot do it yourself, but please contact our support via mail at support@bookplus.net and we will be glad to assist on the matter.'
          },
          {
            question: 'Can I transfer this software to a new hardware?',
            answer: 'Yes, this key can be used again if the OS or software is reinstalled or formatted, if the key is bind to your Microsoft account. For instructions, please contact our support at support@bookplus.net'
          }
        ]
      }
    }
  })

  const office2021 = await prisma.product.upsert({
    where: { slug: 'office-2021-pro' },
    update: {},
    create: {
      title: 'Office 2021 Professional Plus Cd Key Digital Download',
      slug: 'office-2021-pro',
      description: 'Microsoft Office 2021 Professional Plus includes Word, Excel, PowerPoint, Outlook, and more. Digital download with lifetime license.',
      price: 18.89,
      images: [
        '/images/office-2021.jpg'
      ],
      inStock: true,
      platform: 'Windows',
      platformIcon: 'https://ext.same-assets.com/3893671847/1513979826.png',
      rewardPoints: 18,
      categoryId: softwareCategory.id,
      faq: {
        create: [
          {
            question: 'Is this a lifetime license?',
            answer: 'Yes, this is a one-time purchase with a lifetime license. No subscription required.'
          },
          {
            question: 'How many devices can I install this on?',
            answer: 'This license can be used on 1 PC or Mac.'
          }
        ]
      }
    }
  })

  const gamePassUltimate = await prisma.product.upsert({
    where: { slug: 'xbox-game-pass-ultimate-3-month' },
    update: {},
    create: {
      title: 'XBOX Game Pass Ultimate - 3 Month Cd Key',
      slug: 'xbox-game-pass-ultimate-3-month',
      description: 'Xbox Game Pass Ultimate includes Xbox Game Pass for Console, PC Game Pass, EA Play, and Xbox Live Gold. Get 3 months of unlimited access to 100+ games.',
      price: 29.90,
      images: [
        '/images/xbox-gamepass.jpg'
      ],
      inStock: true,
      platform: 'Xbox',
      platformIcon: 'https://ext.same-assets.com/3893671847/xbox-icon.png',
      rewardPoints: 30,
      categoryId: gamesCategory.id,
      faq: {
        create: [
          {
            question: 'Can I stack multiple codes?',
            answer: 'Yes, you can stack up to 36 months of Xbox Game Pass Ultimate.'
          },
          {
            question: 'Will my subscription auto-renew?',
            answer: 'This code will add 3 months to your subscription. Auto-renewal settings can be managed in your Microsoft account.'
          }
        ]
      }
    }
  })

  // Add some sample reviews
  await prisma.review.createMany({
    data: [
      {
        productId: windows11.id,
        userId: user.id,
        rating: 5,
        comment: 'Excellent product and fast delivery! Key worked perfectly.'
      },
      {
        productId: office2021.id,
        userId: user.id,
        rating: 4,
        comment: 'Good value for money. Installation was straightforward.'
      }
    ]
  })

  console.log(`Database has been seeded!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 