"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, LogOut, Tag } from "lucide-react"
import { signOut } from "@/app/actions/auth"

type Subject = "數學" | "英文" | "物理" | string

interface Folder {
  folder_id: string
  folder_title: string
  tag_id: string
  tag_name: Subject
  questions: any[]
}

interface HomePageProps {
  folders: Folder[]
}

export function HomePage({ folders = [] }: HomePageProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<Subject | "all">("all")
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique tag names for the filter dropdown
  const uniqueSubjects = [...new Set(folders.map(folder => folder.tag_name))]
  
  // Filter folders based on selected tag
  const filteredFolders = filter === "all" ? folders : folders.filter((folder) => folder.tag_name === filter)

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ReLearnAI</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            {isLoading ? '登出中...' : '登出'}
          </Button>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E9%A6%96%E9%A0%81-FdCoEHnALIf50wdlzKQV8AyxDz6RRe.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div className="w-60">
          <Select onValueChange={(value) => setFilter(value as Subject | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {uniqueSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link href="/create-quiz">
          <Button className="bg-gray-900 hover:bg-gray-800">建立新題本</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder) => (
            <Card key={folder.folder_id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{folder.folder_title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>{folder.tag_name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>題目數量: {folder.questions.length}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-end gap-2">
                <Link href={`/generate/${folder.folder_id}`}>
                  <Button variant="outline" className="bg-gray-900 text-white hover:bg-gray-800">
                    產生新題
                  </Button>
                </Link>
                <Link href={`/quiz/${folder.folder_id}`}>
                  <Button variant="outline" className="bg-gray-900 text-white hover:bg-gray-800">
                    複習
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">沒有找到題本，請建立新題本</p>
          </div>
        )}
      </div>
    </div>
  )
}
