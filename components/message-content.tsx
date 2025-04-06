"use client"

import { type Message, MessageType } from "@/types/chat"
import Image from "next/image"
import { FileText, Download, Play, Pause } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface MessageContentProps {
  message: Message
}

export function MessageContent({ message }: MessageContentProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  switch (message.type) {
    case MessageType.TEXT:
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      )

    case MessageType.IMAGE:
      return (
        <div className="space-y-2">
          {message.content && <p className="text-sm mb-2">{message.content}</p>}
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src={message.imageUrl || "/placeholder.svg?height=300&width=400"}
              alt="Image générée"
              width={400}
              height={300}
              className="object-cover hover-scale"
            />
          </div>
        </div>
      )

    case MessageType.FILE:
      return (
        <div className="space-y-2">
          {message.content && <p className="text-sm mb-2">{message.content}</p>}
          <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              <p className="text-xs text-muted-foreground">{message.fileSize}</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <a href={message.fileUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )

    case MessageType.AUDIO:
      return (
        <div className="space-y-2">
          {message.content && <p className="text-sm mb-2">{message.content}</p>}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleAudio}
              className={cn("h-10 w-10 rounded-full", isPlaying && "bg-primary text-primary-foreground")}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 h-10 bg-secondary/30 rounded-full overflow-hidden">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn("h-1 w-full bg-secondary/50", isPlaying && "animate-pulse")}>
                    <div className="h-full bg-primary" style={{ width: isPlaying ? "30%" : "0%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <audio ref={audioRef} src={message.audioUrl} onEnded={handleAudioEnded} className="hidden" />
          </div>
        </div>
      )

    default:
      return <p>{message.content}</p>
  }
}

