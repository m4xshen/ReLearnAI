"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuizComponent, type Question } from '@/components/quiz/QuizComponent'

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 模擬的問題數據
  const questions: Question[] = [
    {
      id: 1,
      content: '下列哪一個數字是質數？',
      options: [
        { value: 'A', label: '9' },
        { value: 'B', label: '15' },
        { value: 'C', label: '17' },
        { value: 'D', label: '21' },
      ],
      correctAnswer: 'C',
    },
    {
      id: 2,
      content: '下列哪一個數字是偶數？',
      options: [
        { value: 'A', label: '3' },
        { value: 'B', label: '7' },
        { value: 'C', label: '9' },
        { value: 'D', label: '12' },
      ],
      correctAnswer: 'D',
    },
    // 可以添加更多問題
  ]

  const handleComplete = (score: number) => {
    // 這裡可以處理測驗完成後的邏輯，例如保存分數到資料庫
    console.log('Quiz completed with score:', score)
  }

  const handleReturnHome = () => {
    router.push('/')
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg border p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">發生錯誤</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            返回首頁
          </button>
        </div>
      </div>
    )
  }

  return (
    <QuizComponent
      title="數學 Ch3 小考"
      questions={questions}
      mode="review"
      onComplete={handleComplete}
      onReturnHome={handleReturnHome}
      isLoading={isLoading}
    />
  )
}
