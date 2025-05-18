import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const fakeUsers = [
  { email: "chieh.mg11@nycu.edu.tw", password: "12345678" },
  // 若要多個測試帳號就再加
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 2. 在假資料庫裡找 user
    const user = fakeUsers.find(u => u.email === email && u.password === password)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // 3. 產生假的 token（你可以改成任何字串）
    const token = "mock-jwt-token"

    // 4. 回傳 { token }，並同時設 HttpOnly Cookie
    const response = NextResponse.json(
      { token },
      { status: 200 }
    )
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 七天
      sameSite: "lax",
    })
    return response

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 