import { QuizComponent, type Question } from '@/components/quiz/QuizComponent'
import { cookies } from "next/headers";

export default async function QuizPage(
  { params }: { params: { id: string } }
) {

  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  const response = await fetch(`https://relearnai.onrender.com/api/get-all-questions/${userId}`)
  const { data } = await response.json()

  // Ensure params.id is properly handled in server component
  const { id } = await params
  const folder = data.folders.find((folder: any) => folder.folder_id === id)

  return (
    <QuizComponent
      title={folder.folder_title}
      questions={folder.questions}
      mode="review"
      quizId={id}
    />
  )
}
