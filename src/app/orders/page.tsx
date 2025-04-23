import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrders } from "@/lib/actions/order";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ChevronRight } from "lucide-react";

export const metadata = {
  title: "My Orders | BookPlus",
  description: "View your order history and track current orders",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const { orders, error } = await getOrders(session.user.id);

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like you haven't placed any orders with us yet.
          </p>
          <Button asChild>
            <Link href="/games">Browse Games</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Order #{order.orderNumber}</CardTitle>
                  <CardDescription>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-medium">{order.items.length} products</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 my-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 bg-center bg-cover rounded"
                          style={{ 
                            backgroundImage: `url(${item.product.images[0] || '/images/placeholder.png'})` 
                          }}
                        />
                        <span className="text-sm truncate max-w-[150px]">
                          {item.product.title}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-sm text-muted-foreground">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>

                  <Button asChild variant="outline">
                    <Link href={`/orders/${order.id}`}>
                      View Order Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 