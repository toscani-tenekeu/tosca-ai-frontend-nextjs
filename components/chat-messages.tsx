"use client"

import type { Message } from "@/types/chat"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ToscaLogo } from "./tosca-logo"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"
import { MessageContent } from "./message-content"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  t: (key: string) => string
}

export function ChatMessages({ messages, isLoading, t }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <ToscaLogo className="h-16 w-16 mb-6 animate-float" />
        <h2 className="text-2xl font-bold text-primary mb-2">{t("welcome")}</h2>
        <p className="text-muted-foreground max-w-md mb-6">{t("welcome-subtitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { title: t("ask-question"), description: t("ask-anything") },
            { title: t("share-file"), description: t("analyze-documents") },
            { title: t("record-audio"), description: t("speak-instead") },
            { title: t("generate-image"), description: t("create-visuals") },
          ].map((item, i) => (
            <Card key={i} className="p-4 glass-card hover-scale">
              <h3 className="font-medium text-primary">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn("flex gap-3 message-animation", message.role === "user" ? "justify-end" : "justify-start")}
        >
          {message.role !== "user" && (
            <Avatar className="h-8 w-8 bg-primary">
              <ToscaLogo className="h-5 w-5 text-white" />
            </Avatar>
          )}

          <div className={cn("max-w-[80%]", message.role === "user" ? "order-1" : "order-2")}>
            <div
              className={cn(
                "glass-card p-3",
                message.role === "user"
                  ? "bg-primary bg-opacity-20 border-primary/20"
                  : "bg-secondary bg-opacity-20 border-secondary/20",
              )}
            >
              <MessageContent message={message} />
            </div>
            <div className="text-xs text-muted-foreground mt-1 px-1">
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ""}
            </div>
          </div>

          {message.role === "user" && (
            <Avatar className="h-8 w-8 bg-secondary order-3">
              <User className="h-4 w-4" />
            </Avatar>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 bg-primary">
            <ToscaLogo className="h-5 w-5 text-white" />
          </Avatar>
          <div className="glass-card p-4 bg-secondary bg-opacity-20 border-secondary/20">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

