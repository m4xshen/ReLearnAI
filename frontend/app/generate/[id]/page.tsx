import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { QuizComponent, type Question } from '@/components/quiz/QuizComponent'

// Loading component to show while questions are being generated
function QuizLoading() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg border p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">生成新測驗中...</h2>
        <div className="flex justify-center items-center space-x-2 my-8">
          <div className="w-4 h-4 rounded-full bg-gray-900 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 rounded-full bg-gray-900 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 rounded-full bg-gray-900 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-sm text-gray-500">正在根據您的學習數據生成新的練習題...</p>
      </div>
    </div>
  )
}

// Error component to show if question generation fails
function QuizError({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg border p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">發生錯誤</h2>
        <p className="mb-6">{error.message}</p>
        <a
          href="/"
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 inline-block"
        >
          返回首頁
        </a>
      </div>
    </div>
  )
}

// Component that fetches and renders the quiz questions
async function GenerateQuizContent({ quizId }: { quizId: string }) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  
  // Get user's wrong questions to generate new practice questions
  const response = await fetch(`https://relearnai.onrender.com/api/get-all-questions/${userId}`)
  const { data } = await response.json()
  
  // Find the folder with wrong questions
  const folder = data.folders.find((folder: any) => folder.folder_id === quizId)
  
  if (!folder) {
    throw new Error('找不到指定的測驗資料')
  }
  
  // Get wrong questions from the folder
  const wrongQuestions = folder.questions.filter((q: any) => 
    q.user_answer && q.user_answer !== q.answer
  )
  
  if (wrongQuestions.length === 0) {
    throw new Error('沒有錯誤題目可供生成新練習')
  }
  
  // Call the generate-questions API to create new practice questions
  const generateResponse = await fetch('http://localhost:3000/api/generate-questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ wrongQuestions }),
    cache: 'no-store'
  })
  
  if (!generateResponse.ok) {
    throw new Error('生成新測驗失敗')
  }
  
  const generatedData = await generateResponse.json()
  
  return (
    <QuizComponent
      title={`${folder.folder_title} - 新練習`}
      questions={generatedData.questions}
      mode="new"
      quizId={quizId}
    />
  )
}

export default async function GeneratePage({ params }: { params: { id: string } }) {
  const { id } = await params

  return (
      <Suspense fallback={<QuizLoading />}>
        <GenerateQuizContent quizId={id} />
      </Suspense>
  )
}
