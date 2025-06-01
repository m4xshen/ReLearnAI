import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { NextResponse } from "next/server"

// 這個API會根據用戶的錯題生成新的練習題
export async function POST(request: Request) {
  try {
    // const { quizId, wrongQuestions } = await request.json()

    console.log(JSON.stringify(wrongQuestions, null, 2))

    const { text } = await generateText({
      model: anthropic("claude-3-5-haiku-20241022"),
      prompt: `
    你是一位厲害的老師，請根據每一題錯誤題目，分別生成一題新的練習題。  
    請確保新題目與原本的題目知識點或觀念一致。  
    
    請回傳純 JSON 陣列，每一筆資料包含：
    - sourceId: 原始錯題 ID
    - content: 題目敘述（選擇題）
    - options: 四個選項（value: A~D, label: 文字）
    - correctAnswer: 正確選項（A~D）
    - explanation: 答案說明（清楚說明邏輯）
    
    🧠 請使用**繁體中文**並避免重複題目，如果是英文請用英文出題。
    
    以下是原始錯題資料：
      ${JSON.stringify(wrongQuestions, null, 2)}
      `,
      temperature: 0.7,
    })

    console.log(text)

    const generatedQuestions = JSON.parse(text)

    return NextResponse.json({
      success: true,
      questions: generatedQuestions
    })
  } catch (error) {
    console.error("Claude 題目生成失敗：", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate questions" },
      { status: 500 }
    )
  }
}

const wrongQuestions = 
  [
    {
      id: 1,
      content: "下列「」內的字，讀音前後相同的是：",
      options: [
        { value: "A", label: "「舁」出寶貨／吾生須「臾」" },
        { value: "B", label: "切而「啗」之／「諂」詞令色" },
        { value: "C", label: "「迤」邐而行／外「弛」內張" },
        { value: "D", label: "若分「畛」域／暴「殄」天物" }
      ],
      correctAnswer: "A",
      explanation: "這題是考查字音辨識能力，判斷括號內兩個字的讀音是否相同。選項 (A) 的「舁」和「臾」皆讀作 ㄩˊ，意思分別為「抬」和「片刻」，讀音相同，為正確答案。其餘選項中，(B) 的「啗」讀 ㄉㄢˋ、「諂」讀 ㄔㄢˇ，(C) 的「迤」讀 ㄧˇ、「弛」讀 ㄔˊ，(D) 的「畛」讀 ㄓㄣˇ、「殄」讀 ㄊㄧㄢˇ，皆為不同讀音，因此均不正確。故本題正確答案為 (A)。"
    },
    {
      id: 2,
      content: "If you put a ______ under a leaking faucet, you will be surprised at the amount of water collected in 24 hours.：",
      options: [
        { value: "A", label: "border" },
        { value: "B", label: "timer" },
        { value: "C", label: "container" },
        { value: "D", label: "marker" }
      ],
      correctAnswer: "D",
      explanation: "這題是要找一個適合放在「漏水的水龍頭下」來「收集水」的物品。四個選項中，只有 container（容器） 才符合這個用途。"
    }
  ]
