"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function GeneratePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    // 模擬生成過程
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 2000)
  }

  const handleStartQuiz = () => {
    router.push(`/quiz/${params.id}`)
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

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">數學 Ch3 小考</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {!isGenerating && !isGenerated ? (
            <>
              <p className="text-center mb-6">系統將根據您之前的錯題，生成新的練習題目。</p>
              <Button onClick={handleGenerate} className="bg-gray-900 hover:bg-gray-800">
                生成練習題
              </Button>
            </>
          ) : isGenerating ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>正在生成題目，請稍候...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center py-8">
                <p className="text-lg font-medium mb-2">題目已生成！</p>
                <p className="text-sm text-gray-500 mb-6">系統已根據您的錯題生成了10道練習題。</p>
                <Button onClick={handleStartQuiz} className="bg-gray-900 hover:bg-gray-800">
                  開始練習
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
