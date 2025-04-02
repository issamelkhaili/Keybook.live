"use client"

import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

// Temporary mock data - will be replaced with actual API calls
const stats = [
  {
    name: "Total Revenue",
    value: formatPrice(12345.67),
    icon: DollarSign,
    change: "+12%",
  },
  {
    name: "Total Orders",
    value: "156",
    icon: ShoppingCart,
    change: "+8%",
  },
  {
    name: "Total Customers",
    value: "2,345",
    icon: Users,
    change: "+23%",
  },
  {
    name: "Total Products",
    value: "45",
    icon: Package,
    change: "+4%",
  },
]

const recentOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    product: "Digital Marketing Guide",
    amount: 29.99,
    status: "Completed",
    date: "2024-03-15",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    product: "Web Development Course",
    amount: 49.99,
    status: "Processing",
    date: "2024-03-14",
  },
  // Add more recent orders as needed
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Order ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Customer
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Product
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Amount
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-4 align-middle">{order.id}</td>
                    <td className="p-4 align-middle">{order.customer}</td>
                    <td className="p-4 align-middle">{order.product}</td>
                    <td className="p-4 align-middle">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 