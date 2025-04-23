"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  CreditCard, 
  HelpCircle, 
  PackageOpen, 
  Truck 
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    images: string[];
    slug: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
}

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError("Failed to load order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="py-10 text-center">
        <HelpCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Order not found</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          {error || "We couldn't find the order you're looking for."}
        </p>
        <Button asChild>
          <Link href="/orders">View all orders</Link>
        </Button>
      </div>
    );
  }

  const statusSteps = [
    { id: "pending", label: "Order Placed", icon: <Clock />, complete: true },
    { 
      id: "processing", 
      label: "Processing", 
      icon: <PackageOpen />, 
      complete: ["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) 
    },
    { 
      id: "shipped", 
      label: "Shipped", 
      icon: <Truck />, 
      complete: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) 
    },
    { 
      id: "delivered", 
      label: "Delivered", 
      icon: <Check />, 
      complete: ["DELIVERED", "COMPLETED"].includes(order.status) 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-bold mb-1">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status: {order.status}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            {statusSteps.map((step, i) => (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step.complete 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : "border-muted-foreground bg-background text-muted-foreground"
                  }`}
                >
                  {step.icon}
                </div>
                <p className="mt-2 text-sm font-medium">{step.label}</p>
                {i < statusSteps.length - 1 && (
                  <div className="absolute left-0 top-0">
                    <Separator orientation="horizontal" className="w-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({order.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start space-x-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                  <Image
                    src={item.product.images[0] || "/images/placeholder.png"}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link 
                    href={`/product/${item.product.slug}`}
                    className="font-medium hover:underline"
                  >
                    {item.product.title}
                  </Link>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <span>Qty: {item.quantity}</span>
                    <span className="mx-2">·</span>
                    <span>${item.price.toFixed(2)} each</span>
                  </div>
                </div>
                <div className="text-right font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <address className="not-italic">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </address>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{order.paymentMethod}</p>
                <p className="text-sm text-muted-foreground">
                  {order.status === "PAID" || order.status === "COMPLETED" 
                    ? "Paid on " + new Date(order.updatedAt).toLocaleDateString() 
                    : "Payment pending"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-10 w-32 bg-muted rounded-md" />
        <div className="text-right space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md ml-auto" />
          <div className="h-4 w-36 bg-muted rounded-md ml-auto" />
        </div>
      </div>

      <div className="h-40 bg-muted rounded-lg" />

      <div className="h-72 bg-muted rounded-lg" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-40 bg-muted rounded-lg" />
        <div className="h-40 bg-muted rounded-lg" />
      </div>
    </div>
  );
} 