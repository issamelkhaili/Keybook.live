"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

// Define a User type for TypeScript
type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  emailVerified: Date | null;
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchUsers() {
      if (status === "authenticated" && session?.user?.role === "ADMIN") {
        try {
          setLoading(true);
          const response = await fetch('/api/admin/users');
          
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          
          const data = await response.json();
          setUsers(data.users);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Error loading users. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUsers();
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null; // Will redirect in the useEffect
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        
        // Remove the user from the state
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">User List</h2>
          <Button>Add New User</Button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3">{user.id.substring(0, 8)}...</td>
                    <td className="p-3">{user.name || 'Unnamed'}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <Badge variant={user.role === 'ADMIN' ? 'secondary' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/users/${user.id}`)}>
                        Edit
                      </Button>
                      {user.role !== 'ADMIN' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 