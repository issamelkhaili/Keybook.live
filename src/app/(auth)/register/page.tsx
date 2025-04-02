"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { Lock, Mail, User } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      toast({
        title: "Success",
        description: "Account created successfully. Please sign in.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className={cn("text-2xl font-semibold tracking-tight", gradients.text)}>
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to create your account
            </p>
          </div>
          <form onSubmit={onSubmit} className={cn("grid gap-4", animations.fade)}>
            <div className="grid gap-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                  name="name"
                  className="pl-9"
                  required
                />
              </div>
            </div>
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
                  placeholder="Create a password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  name="password"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <Button className={animations.button} disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link 
              href="/login"
              className={cn(
                "hover:text-primary underline underline-offset-4",
                animations.button
              )}
            >
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </div>
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
              Join thousands of users who trust Keybook.live for their software needs.
            </p>
            <footer className="text-sm text-muted-foreground">Fast • Secure • Reliable</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
} 