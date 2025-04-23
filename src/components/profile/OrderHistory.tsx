import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight, ShoppingBag } from "lucide-react";

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
  status: string;
  createdAt: string;
  paymentMethod: string;
  items: OrderItem[];
}

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          You haven't placed any orders with us yet.
        </p>
        <Button asChild>
          <Link href="/games">Browse Games</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge
              variant={
                order.status === "PAID"
                  ? "success"
                  : order.status === "PENDING"
                  ? "default"
                  : order.status === "CANCELLED"
                  ? "destructive"
                  : "outline"
              }
            >
              {order.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Items
                </h4>
                <div className="space-y-2">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 bg-center bg-cover rounded"
                        style={{
                          backgroundImage: `url(${
                            item.product.images[0] || "/images/placeholder.png"
                          })`,
                        }}
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm">{item.product.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Payment: {order.paymentMethod}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/orders/${order.id}`}>
                    View Order <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 