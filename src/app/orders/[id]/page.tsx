import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrderById } from "@/lib/actions/order";
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
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Copy } from "lucide-react";
import { toast } from "sonner";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { title: "Order Not Found" };

  const { order, error } = await getOrderById(params.id, session.user.id);
  
  if (error || !order) {
    return { title: "Order Not Found | BookPlus" };
  }

  return {
    title: `Order #${order.orderNumber} | BookPlus`,
    description: `Details for your order #${order.orderNumber}`,
  };
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders/" + params.id);
  }

  const { order, error } = await getOrderById(params.id, session.user.id);

  if (error || !order) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
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
          className="text-base px-3 py-1"
        >
          {order.status}
        </Badge>
      </div>
      
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Ordered on {new Date(order.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center space-x-4">
                      <div
                        className="w-12 h-12 bg-center bg-cover rounded"
                        style={{
                          backgroundImage: `url(${item.product.images[0] || '/images/placeholder.png'})`,
                        }}
                      />
                      <div>
                        <h3 className="font-medium">{item.product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.platform && (
                            <span>{item.product.platform}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="md:text-center">
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p>${item.price.toFixed(2)}</p>
                    </div>

                    <div className="md:text-center">
                      <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                      <p>{item.quantity}</p>
                    </div>

                    <div className="md:text-center">
                      <Button variant="outline" size="sm" className="w-full">
                        <Copy className="mr-2 h-4 w-4" />
                        {item.key}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span>{order.paymentMethod}</span>
                </div>
                {order.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="truncate max-w-[160px]">{order.paymentId}</span>
                  </div>
                )}
              </div>

              <Separator />

              <Button asChild className="w-full">
                <Link href="#" target="_blank">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 