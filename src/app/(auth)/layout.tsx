"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card } from "@/components/ui/card"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
      <div className="w-full max-w-md px-4 py-8">
        <div className="flex justify-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            Keybook.live
          </Link>
        </div>
        <Card className="p-6">
          <nav className="flex space-x-4 mb-6">
            <Link
              href="/login"
              className={`flex-1 text-center py-2 rounded-md transition-colors ${
                pathname === "/login"
                  ? "bg-primary text-white"
                  : "hover:bg-primary/10"
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`flex-1 text-center py-2 rounded-md transition-colors ${
                pathname === "/register"
                  ? "bg-primary text-white"
                  : "hover:bg-primary/10"
              }`}
            >
              Register
            </Link>
          </nav>
          {children}
        </Card>
      </div>
    </div>
  )
} 