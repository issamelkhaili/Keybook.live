"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Define an Order type for TypeScript
type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
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
    async function fetchOrders() {
      if (status === "authenticated" && session?.user?.role === "ADMIN") {
        try {
          setLoading(true);
          const response = await fetch('/api/admin/orders');
          
          if (!response.ok) {
            throw new Error('Failed to fetch orders');
          }
          
          const data = await response.json();
          setOrders(data.orders);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setError('Error loading orders. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }

    fetchOrders();
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">Paid</Badge>;
      case 'FULFILLED':
        return <Badge variant="secondary">Fulfilled</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Order List</h2>
          <div className="flex space-x-2">
            <Button variant="outline">Export Orders</Button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center">No orders found</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3">{order.orderNumber}</td>
                    <td className="p-3">{order.user?.name || order.user?.email || 'Unknown'}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">${order.total.toFixed(2)}</td>
                    <td className="p-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                      >
                        View
                      </Button>
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