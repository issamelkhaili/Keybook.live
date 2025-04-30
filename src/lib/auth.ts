import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug mode to help troubleshoot
  // Only use adapter if you have social sign-in or want persistent sessions
  // adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  basePath: "/api/auth",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Authorization attempt with credentials:", { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Email and password required");
        }

        try {
          // Test database connection
          await prisma.$queryRaw`SELECT 1`;
          console.log("Database connection successful");

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          console.log("User found:", !!user);

          if (!user || !user.password) {
            console.log("User not found or no password");
            throw new Error("Invalid email or password");
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      console.log("Session callback:", { token: { ...token, sub: undefined } });
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback:", { user: !!user, tokenId: token.sub });
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
};

// Export getSession helper for convenience
export async function getSession() {
  const { getServerSession } = await import('next-auth/next');
  return getServerSession(authOptions);
} 