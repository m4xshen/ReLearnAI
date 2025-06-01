import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

export interface Question {
  id: number
  content: string
  options: { value: string; label: string }[]
  correctAnswer: string
  explanation?: string
  userAnswer?: string
  isCorrect?: boolean
}

interface QuizComponentProps {
  title: string
  questions: Question[]
  mode: 'new' | 'review'
  onComplete?: (score: number) => void
  onReturnHome?: () => void
  isLoading?: boolean
}

export function QuizComponent({
  title,
  questions,
  mode,
  onComplete,
  onReturnHome,
  isLoading = false,
}: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    setSelectedAnswer('')
    setShowExplanation(false)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCompleted(true)
      onComplete?.(score)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer('')
      setShowExplanation(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg border p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">
            {mode === 'new' ? '正在生成題目...' : '正在載入題目...'}
          </h2>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg border p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="text-lg mb-6">你的得分：</p>
          <p className="text-5xl font-bold mb-8">
            {score}/{questions.length}
          </p>
          <Button onClick={onReturnHome} className="bg-gray-900 hover:bg-gray-800">
            回首頁
          </Button>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const isReviewMode = mode === 'review'
  const showUserAnswer = isReviewMode && currentQ.userAnswer

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ReLearnAI</h1>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E9%A6%96%E9%A0%81-FdCoEHnALIf50wdlzKQV8AyxDz6RRe.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
      </header>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">
            {currentQuestion + 1}/{questions.length}
          </span>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQ.content}</h3>
          <RadioGroup
            name={`question-${currentQ.id}`}
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
          >
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswer === option.value;
              const isCorrect = option.value === currentQ.correctAnswer;
              const showCorrect = showExplanation && isCorrect;
              const showWrong = showExplanation && isSelected && !isCorrect;

              return (
                <Label
                  key={option.value}
                  htmlFor={`option-${option.value}`}
                  className={
                    `flex items-center space-x-2 border rounded-md p-3 cursor-pointer ` +
                    (isSelected ? 'bg-gray-100 ' : '') +
                    (showCorrect ? 'border-green-500 bg-green-50 ' : '') +
                    (showWrong ? 'border-red-500 bg-red-50 ' : '')
                  }
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`option-${option.value}`}
                    disabled={false}
                  />
                  <span className="ml-2">
                    {option.value}. {option.label}
                  </span>
                </Label>
              );
            })}
          </RadioGroup>

          {showExplanation && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">詳解</h4>
              <Textarea
                readOnly
                className="min-h-[100px]"
                value={currentQ.explanation || '這裡是詳細解釋，說明為什麼正確答案是正確的，以及其他選項為什麼是錯誤的。'}
              />
            </div>
          )}

          <div className="flex justify-end mt-6 gap-4">
            {currentQuestion > 0 && (
                <Button variant="outline" onClick={handlePrevQuestion}>
                    回上題
                </Button>
                )}
            {!showExplanation ? (
              <Button onClick={handleAnswer} disabled={!selectedAnswer} className="bg-gray-900 hover:bg-gray-800">
                確認
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="bg-gray-900 hover:bg-gray-800">
                下一題
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 