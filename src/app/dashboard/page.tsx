"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { User, Package, ShoppingCart, Settings, CreditCard, LogOut } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const menuItems = [
    {
      title: "My Profile",
      icon: User,
      href: "/dashboard/profile",
      description: "Manage your personal information"
    },
    {
      title: "My Orders",
      icon: Package,
      href: "/dashboard/orders",
      description: "View and track your orders"
    },
    {
      title: "My Cart",
      icon: ShoppingCart,
      href: "/cart",
      description: "View items in your cart"
    },
    {
      title: "Payment Methods",
      icon: CreditCard,
      href: "/dashboard/payment",
      description: "Manage your payment methods"
    },
    {
      title: "Account Settings",
      icon: Settings,
      href: "/dashboard/settings",
      description: "Update your account preferences"
    }
  ]

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Session Expired</h1>
          <p className="mb-4">Please sign in to access your dashboard</p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className={cn("text-3xl font-bold mb-2", gradients.text)}>
          Welcome, {session.user.name}!
        </h1>
        <p className="text-muted-foreground">
          Manage your account and view your purchases
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link 
            key={item.title} 
            href={item.href}
            className={cn(
              "block p-6 rounded-lg border border-border",
              "bg-card hover:shadow-lg transition-all duration-200",
              "hover:border-primary/20 hover:shadow-primary/5",
              animations.card
            )}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">{item.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </Link>
        ))}

        <button 
          onClick={() => {
            fetch('/api/auth/signout', { method: 'POST' })
              .then(() => router.push('/'))
          }}
          className={cn(
            "block p-6 rounded-lg border border-destructive/20",
            "bg-card hover:shadow-lg transition-all duration-200",
            "hover:border-destructive/30 hover:shadow-destructive/5",
            animations.card
          )}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mr-3">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="font-medium">Sign Out</h3>
          </div>
          <p className="text-sm text-muted-foreground">Log out of your account</p>
        </button>
      </div>
    </div>
  )
} 