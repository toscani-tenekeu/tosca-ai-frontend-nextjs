export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  AUDIO = "audio",
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  type: MessageType
  timestamp: string

  // For image messages
  imageUrl?: string

  // For file messages
  fileName?: string
  fileSize?: string
  fileUrl?: string

  // For audio messages
  audioUrl?: string
}

export interface Conversation {
  id: string
  title: string
  timestamp: string
  hasImages: boolean
  hasFiles: boolean
  hasAudio: boolean
}

