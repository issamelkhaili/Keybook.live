import { useSession } from 'next-auth/react';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user as User | undefined,
    status: status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isAdmin: session?.user?.role === 'ADMIN'
  };
} 