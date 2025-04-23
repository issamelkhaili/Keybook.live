# BookPlus - Digital Key Store

BookPlus is a modern e-commerce platform for digital software keys, games, and subscriptions. Built with Next.js, TypeScript, TailwindCSS, and Prisma.

## Getting Started

First, set up the database:

```bash
# Install dependencies
npm install

# Push the schema to your database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend Features

- **Authentication**: Full user authentication with NextAuth.js
- **Database**: PostgreSQL database with Prisma ORM
- **API Routes**: RESTful API endpoints for all operations
- **Server Actions**: Next.js server actions for form handling and data fetching
- **Cart Management**: Shopping cart management with cookies
- **Order Processing**: Complete order processing system
- **Admin Dashboard**: Admin-only routes for managing products and orders

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui

## API Routes

- `/api/auth/*` - Authentication endpoints (NextAuth.js)
- `/api/products` - Product listing and filtering
- `/api/products/[slug]` - Individual product data
- `/api/products/[slug]/reviews` - Product reviews
- `/api/cart/*` - Shopping cart management
- `/api/orders` - Order creation and listing
- `/api/orders/[id]` - Order details

## Database Schema

- **User**: User accounts and authentication
- **Product**: Product listings with details and images
- **ProductCategory**: Product categories
- **Review**: Product reviews from users
- **Order**: User orders with items and status
- **OrderItem**: Individual items in an order
- **FAQ**: Product-specific frequently asked questions

## Default Users

After running the seed script, you can log in with these accounts:

- **Admin**: admin@bookplus.net / admin123
- **User**: user@example.com / user123

## License

This project is open source and available under the [MIT License](LICENSE).
