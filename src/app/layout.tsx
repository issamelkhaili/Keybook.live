"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import { themeConfig, animations, gradients } from "@/lib/theme"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

function MainNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Software Keys", href: "/products" },
    { name: "Game Keys", href: "/categories/games" },
    { name: "Support", href: "/support" },
  ]

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-sm" 
          : "bg-background"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className={cn("text-2xl font-bold", gradients.text, animations.scale)}>
              Keybook.live
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium",
                  animations.button,
                  pathname === item.href 
                    ? gradients.text
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("relative", animations.button)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            
            {session ? (
              <Link href="/dashboard">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={animations.button}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button 
                  asChild 
                  variant="ghost" 
                  size="sm"
                  className={animations.button}
                >
                  <Link href="/login" className="flex items-center space-x-1">
                    <LogIn className="h-4 w-4 mr-1" />
                    Sign In
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="default" 
                  size="sm"
                  className={animations.button}
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:hidden", animations.button)}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className={cn(
            "md:hidden py-4 border-t",
            animations.slide,
            "divide-y divide-border/5"
          )}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block py-2 text-sm font-medium",
                  animations.button,
                  pathname === item.href 
                    ? gradients.text
                    : "text-muted-foreground hover:text-primary"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!session && (
              <div className="pt-2 space-y-2">
                <Link
                  href="/login"
                  className={cn(
                    "block py-2 text-sm font-medium text-muted-foreground hover:text-primary",
                    animations.button
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    "block py-2 text-sm font-medium text-muted-foreground hover:text-primary",
                    animations.button
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            {...themeConfig}
          >
            <CartProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <MainNav />
                <main className="flex-grow">
                  {children}
                </main>

                <footer className="border-t bg-background/95 backdrop-blur-sm">
                  <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <h3 className="font-semibold mb-4">About</h3>
                        <p className="text-sm text-muted-foreground">
                          Keybook.live is your trusted source for genuine software licenses and digital keys.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                          <li>
                            <Link href="/products" className={cn(
                              "text-sm text-muted-foreground hover:text-primary",
                              animations.button
                            )}>
                              Software Keys
                            </Link>
                          </li>
                          <li>
                            <Link href="/categories/games" className={cn(
                              "text-sm text-muted-foreground hover:text-primary",
                              animations.button
                            )}>
                              Game Keys
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                          <li>
                            <Link href="/contact" className={cn(
                              "text-sm text-muted-foreground hover:text-primary",
                              animations.button
                            )}>
                              Contact Us
                            </Link>
                          </li>
                          <li>
                            <Link href="/faq" className={cn(
                              "text-sm text-muted-foreground hover:text-primary",
                              animations.button
                            )}>
                              FAQ
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                          <li>
                            <Link href="/privacy" className={cn(
                              "text-sm text-muted-foreground hover:text-primary",
                              animations.button
                            )}>
                              Privacy Policy
                            </Link>
                          </li>
                          <li>
                            <Link href="/terms" className={cn(
                              "text-sm text-muted-foreground hover:text-primary",
                              animations.button
                            )}>
                              Terms of Service
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                      © {new Date().getFullYear()} Keybook.live. All rights reserved.
                    </div>
                  </div>
                </footer>
              </div>
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 