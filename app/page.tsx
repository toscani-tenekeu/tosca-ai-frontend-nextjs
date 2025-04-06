"use client"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { useAuth } from "@/context/auth-context"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // If user is not authenticated, they can still use the basic chat
  // Advanced features will prompt for login when used

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ChatInterface />
    </main>
  )
}

