import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Mock user for development
const DEV_USER = {
  email: "test@example.com",
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // In development mode, prevent registration with test user email
    if (process.env.NODE_ENV === 'development' && email === DEV_USER.email) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      )
    }

    try {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 409 }
        )
      }

      // Hash password
      const hashedPassword = await hash(password, 10)

      // Create user
      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "USER", // Default role
        },
      })

      return NextResponse.json(
        {
          user: {
            name: user.name,
            email: user.email,
          },
        },
        { status: 201 }
      )
    } catch (error) {
      // In development mode, simulate success even if DB operation fails
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating successful registration")
        return NextResponse.json(
          {
            user: {
              name,
              email,
            },
          },
          { status: 201 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 