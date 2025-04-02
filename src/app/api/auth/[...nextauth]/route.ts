import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

// Mock user for development
const DEV_USER = {
  id: "mock-user-id",
  name: "Test User",
  email: "test@example.com",
  password: "$2a$10$9XmtMSG5xhBFJrLYCww9ue4QSBGw5rO0wjdC.qOr8kVIeY0TlBny6", // 'password123'
  role: "USER",
}

const isDev = process.env.NODE_ENV === 'development'

// Type fixes for NextAuth
type SessionCallback = {
  session: any;
  token: any;
}

type JWTCallback = {
  token: any;
  user?: any;
}

export const authOptions: NextAuthOptions = {
  adapter: isDev ? undefined : PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  debug: isDev, // Enable debug mode in development
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("Missing credentials");
          return null
        }

        // In development, special case for test user
        if (isDev) {
          console.log(`Login attempt for email: ${credentials.email}`);
          
          // Always allow test@example.com with password 'password123'
          if (credentials.email === DEV_USER.email && credentials.password === 'password123') {
            console.log("Dev mode: Login successful with test user");
            return {
              id: DEV_USER.id,
              email: DEV_USER.email,
              name: DEV_USER.name,
              role: DEV_USER.role,
            }
          }
        }

        try {
          // Attempt to find user in database
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) {
            console.log("User not found or no password");
            return null
          }

          // Compare password
          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("Password invalid");
            return null
          }

          console.log("Login successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          
          // In development, fallback to test user if DB access fails
          if (isDev && credentials.email === DEV_USER.email && credentials.password === 'password123') {
            console.log("Dev mode: Fallback to test user after DB error");
            return {
              id: DEV_USER.id,
              email: DEV_USER.email,
              name: DEV_USER.name,
              role: DEV_USER.role,
            }
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: SessionCallback) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }: JWTCallback) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }