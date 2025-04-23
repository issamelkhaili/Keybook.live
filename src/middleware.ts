import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Temporarily bypass auth checks during development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }
  
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const isPublicPath = 
    path === "/login" || 
    path === "/register" || 
    path === "/" || 
    path.startsWith("/product/") || 
    path.startsWith("/games") || 
    path.startsWith("/software") || 
    path.startsWith("/api/");
  
  // Admin paths that require admin role
  const isAdminPath = path.startsWith("/admin");
  
  // User paths that require authentication
  const isUserPath = 
    path.startsWith("/profile") || 
    path.startsWith("/orders") || 
    path.startsWith("/checkout");
  
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Redirect unauthenticated users to login
  if (!token && (isUserPath || isAdminPath)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Redirect authenticated users away from login/register pages
  if (token && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // Check admin access
  if (isAdminPath && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api/auth (NextAuth.js paths)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 