"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const from = searchParams?.get("from") || "/dashboard"
      
      // For development mode, show login attempt information
      console.log(`Attempting login with email: ${email}`)
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        console.error("Login error:", result.error)
        setError("Invalid email or password")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid email or password. Please try again.",
        })
        return
      }

      // Special handling for test user in development
      if (process.env.NODE_ENV === 'development' && email === 'test@example.com') {
        console.log("Dev mode: Successful login with test user")
      }

      toast({
        title: "Success",
        description: "Logged in successfully.",
      })

      router.push(from)
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper text for development mode
  const devModeHelper = process.env.NODE_ENV === 'development' ? (
    <div className="text-xs text-muted-foreground mt-2 text-center">
      <p>Development mode: Use these credentials</p>
      <p>Email: test@example.com</p>
      <p>Password: password123</p>
    </div>
  ) : null

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-background" />
        <div className={cn("relative z-20 flex items-center text-lg font-medium", animations.fade)}>
          <Link href="/" className={gradients.text}>
            Keybook.live
          </Link>
        </div>
        <div className={cn("relative z-20 mt-auto", animations.fade)}>
          <blockquote className="space-y-2">
            <p className="text-lg">
              Your trusted source for genuine software licenses and digital keys.
            </p>
            <footer className="text-sm text-muted-foreground">Secure • Fast • Reliable</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className={cn("text-2xl font-semibold tracking-tight", gradients.text)}>
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <form onSubmit={onSubmit} className={cn("grid gap-4", animations.fade)}>
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  name="email"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isLoading}
                  name="password"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <Button className={animations.button} disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            {devModeHelper}
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link 
              href="/register" 
              className={cn(
                "hover:text-primary underline underline-offset-4",
                animations.button
              )}
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 