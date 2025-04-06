"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Plus, Settings, X, Trash2, LucideImage, FileText, Mic, LogOut, Eye } from "lucide-react"
import type { Conversation } from "@/types/chat"
import { cn } from "@/lib/utils"
import type { User } from "@/types/auth"
import { useI18n } from "@/context/i18n-context"
import Link from "next/link"
import NextImage from "next/image"

interface ChatSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onClose: () => void
  isAuthenticated: boolean
  user: User | null
  onLogout: () => void
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onClose,
  isAuthenticated,
  user,
  onLogout,
}: ChatSidebarProps) {
  const [showSettings, setShowSettings] = useState(false)
  const { t } = useI18n()

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.hasImages) return <LucideImage className="h-4 w-4" />
    if (conversation.hasFiles) return <FileText className="h-4 w-4" />
    if (conversation.hasAudio) return <Mic className="h-4 w-4" />
    return <MessageSquare className="h-4 w-4" />
  }

  return (
    <div className="w-64 h-full glass-sidebar flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center">
          <div className="h-6 w-6 mr-2 flex items-center justify-center">
            <NextImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TOSCA_AI_removebg-preview-9RMszfr5iiGicaNpuyaZayXDtEioMF.png"
              alt="TOSCA AI Logo"
              width={24}
              height={24}
            />
          </div>
          <h2 className="font-bold text-primary">TOSCA AI</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3">
        <Button onClick={onNewConversation} className="w-full justify-start gap-2 hover-scale" variant="outline">
          <Plus className="h-4 w-4" />
          {t("new-conversation")}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant={currentConversationId === conversation.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left truncate hover-scale",
                currentConversationId === conversation.id && "glow-effect",
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-center gap-2 w-full overflow-hidden">
                {getConversationIcon(conversation)}
                <span className="truncate">{conversation.title}</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-white/10">
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-secondary/20">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">{t("login")}</Link>
            </Button>
            <Button asChild variant="default" className="w-full">
              <Link href="/register">{t("register")}</Link>
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 mt-2"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4" />
          {t("settings")}
        </Button>

        {showSettings && (
          <div className="mt-2 p-2 glass-card space-y-2 animate-accordion-down">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">API DeepSeek & Hugging Face</p>
              <div className="flex gap-1">
                <input
                  type="password"
                  className="w-full text-xs bg-background/50 border border-border rounded p-1"
                  placeholder="sk-0c26947361cf426a8776e21e0c3*****"
                  defaultValue={localStorage.getItem("tosca_api_key") || ""}
                  onChange={(e) => {
                    localStorage.setItem("tosca_api_key", e.target.value)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    const input = document.querySelector('input[type="password"]') as HTMLInputElement
                    input.type = input.type === "password" ? "text" : "password"
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button variant="destructive" size="sm" className="w-full mt-2 gap-1">
              <Trash2 className="h-3 w-3" />
              {t("clear-history")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

