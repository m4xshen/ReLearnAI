import { NextResponse } from "next/server"

// 這個API會根據用戶的錯題生成新的練習題
export async function POST(request: Request) {
  try {
    const { quizId, wrongQuestions } = await request.json()

    // 在實際應用中，這裡應該使用AI模型來生成相似的問題
    // 這裡為了演示，我們返回一些模擬的問題

    const generatedQuestions = [
      {
        id: 1,
        content: "下列哪一個數字是質數？",
        options: [
          { value: "A", label: "9" },
          { value: "B", label: "15" },
          { value: "C", label: "17" },
          { value: "D", label: "21" },
        ],
        correctAnswer: "C",
        explanation: "質數是只能被1和自身整除的數。17只能被1和17整除，所以是質數。",
      },
      {
        id: 2,
        content: "下列哪一個數字是偶數？",
        options: [
          { value: "A", label: "3" },
          { value: "B", label: "7" },
          { value: "C", label: "9" },
          { value: "D", label: "12" },
        ],
        correctAnswer: "D",
        explanation: "偶數是能被2整除的數。12能被2整除，所以是偶數。",
      },
      // 可以添加更多問題
    ]

    return NextResponse.json({
      success: true,
      questions: generatedQuestions,
    })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ success: false, error: "Failed to generate questions" }, { status: 500 })
  }
}
