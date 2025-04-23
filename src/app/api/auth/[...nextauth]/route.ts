import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Set up a custom handler for better debugging
async function handler(req: NextRequest) {
  console.log("Auth API route called:", req.url);
  console.log("Method:", req.method);
  
  try {
    // Use the standard NextAuth handler but pass the request
    return await NextAuth(authOptions)(req);
  } catch (error) {
    console.error("NextAuth error:", error);
    return new Response(JSON.stringify({ error: "Authentication failed" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export { handler as GET, handler as POST }; 