"use client"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('min-h-screen bg-background antialiased')}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="keybook-theme"
      >
        <SessionProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </SessionProvider>
      </ThemeProvider>
    </div>
  )
} 