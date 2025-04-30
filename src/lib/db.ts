import { prisma } from './prisma';

// Re-export prisma client as db to maintain consistent naming across the application
export const db = prisma;

// Add getSession helper function that was imported in route.ts files
export async function getSession() {
  try {
    // Since we're using next-auth and not our own implementation, we need to
    // import and use getServerSession from next-auth
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth');
    return getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
} 