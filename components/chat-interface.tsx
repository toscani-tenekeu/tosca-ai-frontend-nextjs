"use client"

import { useState, useRef, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { useChat } from "@/hooks/use-chat"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { ToscaLogo } from "./tosca-logo"
import { useAuth } from "@/context/auth-context"
import { useI18n } from "@/context/i18n-context"
import { AuthDialog } from "./auth-dialog"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

export function ChatInterface() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user, logout, checkAuthRequired } = useAuth()
  const { t } = useI18n()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMessage, setAuthMessage] = useState("")

  const {
    messages,
    isLoading,
    sendMessage,
    conversations,
    currentConversationId,
    startNewConversation,
    setCurrentConversationId,
    uploadFile,
    recordAudio,
    isRecording,
    stopRecording,
    generateImage,
  } = useChat()

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleUploadFile = (file: File) => {
    const authCheck = checkAuthRequired("file-upload")
    if (authCheck.required && !isAuthenticated) {
      setAuthMessage(authCheck.message)
      setAuthDialogOpen(true)
      return
    }
    uploadFile(file)
  }

  const handleRecordAudio = () => {
    const authCheck = checkAuthRequired("audio-recording")
    if (authCheck.required && !isAuthenticated) {
      setAuthMessage(authCheck.message)
      setAuthDialogOpen(true)
      return
    }
    recordAudio()
  }

  const handleGenerateImage = (prompt: string) => {
    const authCheck = checkAuthRequired("image-generation")
    if (authCheck.required && !isAuthenticated) {
      setAuthMessage(authCheck.message)
      setAuthDialogOpen(true)
      return
    }
    generateImage(prompt)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-30 h-full ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
          onNewConversation={startNewConversation}
          onClose={() => setSidebarOpen(false)}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col w-full h-full bg-gradient-to-br from-background to-accent/5">
        {/* Header */}
        <header className="flex items-center justify-between p-4 glass-effect border-b border-white/10">
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center">
            <ToscaLogo className="h-16 w-16" />
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
            <Button variant="outline" size="sm" onClick={startNewConversation} className="hover-scale">
              {t("new-conversation")}
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages messages={messages} isLoading={isLoading} t={t} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 glass-effect border-t border-white/10">
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            onUploadFile={handleUploadFile}
            onRecordAudio={handleRecordAudio}
            onStopRecording={stopRecording}
            isRecording={isRecording}
            onGenerateImage={handleGenerateImage}
            t={t}
          />
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog isOpen={authDialogOpen} onClose={() => setAuthDialogOpen(false)} message={authMessage} />
    </div>
  )
}

