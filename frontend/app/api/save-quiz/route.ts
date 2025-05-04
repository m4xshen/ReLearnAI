import { NextResponse } from "next/server"

// 這個API會保存用戶創建的題目
export async function POST(request: Request) {
  try {
    const { title, subject, questions } = await request.json()

    // 在實際應用中，這裡應該將數據保存到數據庫
    // 這裡為了演示，我們只返回成功

    return NextResponse.json({
      success: true,
      quizId: Math.random().toString(36).substring(2, 9), // 生成隨機ID
    })
  } catch (error) {
    console.error("Error saving quiz:", error)
    return NextResponse.json({ success: false, error: "Failed to save quiz" }, { status: 500 })
  }
}
