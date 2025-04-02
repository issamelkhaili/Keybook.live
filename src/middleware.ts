import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Define explicitly which paths require authentication
const authRequiredPaths = [
  "/admin",
  "/profile",
  "/orders",
  "/dashboard",
]

// Define explicitly which paths are auth pages
const authPaths = [
  "/login",
  "/register",
]

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const path = req.nextUrl.pathname
    
    // Check if current path is an auth page
    const isAuthPage = authPaths.some(ap => path.startsWith(ap))
    
    // Check if current path requires auth
    const isProtectedPath = authRequiredPaths.some(p => path.startsWith(p))

    // Logged in users shouldn't access auth pages - redirect to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Unauthenticated users trying to access protected routes - redirect to login
    if (isProtectedPath && !isAuth) {
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(path)}`, req.url)
      )
    }

    // Handle admin routes with strict role checking
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Add security headers to all responses
    const response = NextResponse.next()
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set(
      "Permissions-Policy", 
      "camera=(), microphone=(), geolocation=()"
    )

    return response
  },
  {
    callbacks: {
      authorized: () => true, // Always return true and let our middleware handle auth
    },
  }
)

// Only run middleware on the paths we care about
export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/login",
    "/register",
    "/dashboard/:path*",
  ],
} 