"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic, ImageIcon, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  onUploadFile: (file: File) => void
  onRecordAudio: () => void
  onStopRecording: () => void
  isRecording: boolean
  onGenerateImage: (prompt: string) => void
  t: (key: string) => string
}

export function ChatInput({
  onSendMessage,
  isLoading,
  onUploadFile,
  onRecordAudio,
  onStopRecording,
  isRecording,
  onGenerateImage,
  t,
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    if (isGeneratingImage) {
      onGenerateImage(message)
      setIsGeneratingImage(false)
    } else {
      onSendMessage(message)
    }

    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUploadFile(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRecordToggle = () => {
    if (isRecording) {
      onStopRecording()
    } else {
      onRecordAudio()
    }
  }

  const toggleImageGeneration = () => {
    setIsGeneratingImage(!isGeneratingImage)
    if (!isGeneratingImage) {
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={cn("glass-card p-1 transition-all duration-300", isGeneratingImage && "border-primary glow-effect")}
      >
        {isGeneratingImage && (
          <div className="px-3 py-1.5 text-xs font-medium text-primary flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" />
            {t("image-generation-mode")}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-auto"
              onClick={toggleImageGeneration}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGeneratingImage ? t("generate-image-prompt") : t("send-message")}
            className="min-h-12 max-h-36 bg-transparent border-0 focus-visible:ring-0 resize-none"
          />

          <div className="flex gap-1.5 pb-1.5 pr-1.5">
            {!isGeneratingImage && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "ghost"}
                  size="icon"
                  className={cn("h-8 w-8 rounded-full", isRecording && "animate-pulse")}
                  onClick={handleRecordToggle}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 rounded-full", isGeneratingImage && "bg-primary text-primary-foreground")}
                  onClick={toggleImageGeneration}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </>
            )}

            <Button type="submit" size="icon" className="h-8 w-8 rounded-full" disabled={!message.trim() || isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

