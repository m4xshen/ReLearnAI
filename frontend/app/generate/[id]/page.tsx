"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuizComponent, type Question } from '@/components/quiz/QuizComponent'

export default function GeneratePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/generate-questions`, {
          method: 'POST'
        })
        if (!response.ok) {
          throw new Error('Failed to generate questions')
        }
        const data = await response.json()
        setQuestions(data.questions)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [params.id])

  const handleComplete = (score: number) => {
    console.log('測驗完成，得分：', score)
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
      title="新測驗"
      questions={questions}
      mode="new"
      onComplete={handleComplete}
      onReturnHome={handleReturnHome}
      isLoading={isLoading}
    />
  )
}
