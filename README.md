# Keybook.live - Digital Store

A modern e-commerce platform built with Next.js, TypeScript, and MongoDB.

## Features

- 🛍️ Full-featured e-commerce functionality
- 🌙 Dark mode interface
- 🔒 Secure authentication and authorization
- 💳 Stripe payment integration
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔍 Advanced product search and filtering
- 📊 Admin dashboard with analytics
- 🛡️ Role-based access control

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form + Zod
- **UI Components**: Headless UI + Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance
- Stripe account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/keybook-live.git
   cd keybook-live
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your environment variables

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/keybook"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Email (Optional)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@keybook.live"
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── shop/        # Shop-specific components
│   ├── admin/       # Admin dashboard components
│   └── auth/        # Authentication components
├── lib/             # Utility functions and configurations
├── types/           # TypeScript type definitions
└── hooks/           # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@keybook.live or open an issue in the repository.
