"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number
  content: string
  options: { value: string; label: string }[]
  correctAnswer: string
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  // 模擬的問題數據
  const questions: Question[] = [
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
    },
    // 可以添加更多問題
  ]

  const handleAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    setSelectedAnswer("")
    setShowExplanation(false)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCompleted(true)
    }
  }

  const handleReturnHome = () => {
    router.push("/")
  }

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg border p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">數學 Ch3 小考</h2>
          <p className="text-lg mb-6">你的得分：</p>
          <p className="text-5xl font-bold mb-8">
            {score}/{questions.length}
          </p>
          <Button onClick={handleReturnHome} className="bg-gray-900 hover:bg-gray-800">
            回首頁
          </Button>
        </div>
      </div>
    )
  }

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
        <h2 className="text-xl font-bold mb-4">數學 Ch3 小考</h2>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">
            {currentQuestion + 1}/{questions.length}
          </span>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{questions[currentQuestion].content}</h3>

          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 border rounded-md p-3 ${
                  selectedAnswer === option.value ? "bg-gray-100" : ""
                }`}
              >
                <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                <Label htmlFor={`option-${option.value}`} className="flex-grow cursor-pointer">
                  {option.value}. {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {showExplanation && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">詳解</h4>
            <Textarea
              readOnly
              className="min-h-[100px]"
              value="這裡是詳細解釋，說明為什麼正確答案是正確的，以及其他選項為什麼是錯誤的。"
            />
          </div>
        )}

        <div className="flex justify-end">
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
  )
}
