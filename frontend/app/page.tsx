import { redirect } from "next/navigation"
import { HomePage } from "@/components/home-page"

export default function Home() {
  // 在實際應用中，這裡應該檢查用戶是否已登入
  // 如果未登入，則重定向到登入頁面
  // 這裡為了演示，我們假設用戶已登入
  const isLoggedIn = true

  if (!isLoggedIn) {
    redirect("/login")
  }

  return <HomePage />
}
