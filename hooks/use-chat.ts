"use client"

import { useState, useEffect } from "react"
import { type Message, MessageType, type Conversation } from "@/types/chat"
import { v4 as uuidv4 } from "uuid"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem("tosca_conversations")
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations))
    } else {
      startNewConversation()
    }
  }, [])

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      const savedMessages = localStorage.getItem(`tosca_messages_${currentConversationId}`)
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      } else {
        setMessages([])
      }
    }
  }, [currentConversationId])

  // Save messages when they change
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      localStorage.setItem(`tosca_messages_${currentConversationId}`, JSON.stringify(messages))

      // Update conversation title if it's "Nouvelle conversation"
      if (
        conversations.find((c) => c.id === currentConversationId)?.title === "Nouvelle conversation" &&
        messages.length > 0
      ) {
        const firstUserMessage = messages.find((m) => m.role === "user")
        if (firstUserMessage) {
          const newTitle = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
          updateConversationTitle(currentConversationId, newTitle)
        }
      }
    }
  }, [messages, currentConversationId, conversations])

  // Save conversations when they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("tosca_conversations", JSON.stringify(conversations))
    }
  }, [conversations])

  const startNewConversation = () => {
    const newId = uuidv4()
    const newConversation: Conversation = {
      id: newId,
      title: "Nouvelle conversation",
      timestamp: new Date().toISOString(),
      hasImages: false,
      hasFiles: false,
      hasAudio: false,
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newId)
    setMessages([])
  }

  const updateConversationTitle = (id: string, title: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === id ? { ...conv, title } : conv)))
  }

  const updateConversationFlags = (
    id: string,
    flags: Partial<Pick<Conversation, "hasImages" | "hasFiles" | "hasAudio">>,
  ) => {
    setConversations((prev) => prev.map((conv) => (conv.id === id ? { ...conv, ...flags } : conv)))
  }

  const sendMessage = async (content: string) => {
    if (!currentConversationId) return

    // Remplacer les mentions de DeepSeek, Chine, etc.
    const modifiedContent = content
      .replace(/deepseek/gi, "Tosca AI")
      .replace(/\bchine\b/gi, "Cameroun")
      .replace(/chinoise/gi, "Camerounaise")

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: modifiedContent,
      type: MessageType.TEXT,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Récupérer la clé API depuis le localStorage
      const apiKey = "sk-0c26947361cf426a8776e21e0c3cd3d0"

      // Call DeepSeek API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey ? `Bearer ${apiKey}` : "",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from API")
      }

      const data = await response.json()

      // Add assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.choices[0].message.content,
        type: MessageType.TEXT,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Désolé, j'ai rencontré une erreur en traitant votre demande. Veuillez réessayer.",
        type: MessageType.TEXT,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const uploadFile = async (file: File) => {
    if (!currentConversationId) return

    // Add user message with file
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: `J'ai partagé un fichier: ${file.name}`,
      type: MessageType.FILE,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileUrl: URL.createObjectURL(file),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    updateConversationFlags(currentConversationId, { hasFiles: true })

    setIsLoading(true)

    try {
      // Si c'est une image, on peut extraire le texte avec l'OCR
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string

          // Récupérer la clé API depuis le localStorage
          const apiKey = "sk-0c26947361cf426a8776e21e0c3cd3d0"

          // Appeler l'API OCR
          const response = await fetch("/api/ocr", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: apiKey ? `Bearer ${apiKey}` : "",
            },
            body: JSON.stringify({
              imageUrl: base64Image,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to extract text from image")
          }

          const data = await response.json()

          // Add assistant response
          const assistantMessage: Message = {
            id: uuidv4(),
            role: "assistant",
            content: `J'ai analysé votre image et j'ai extrait le texte suivant:\n\n${data.text}`,
            type: MessageType.TEXT,
            timestamp: new Date().toISOString(),
          }

          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
        }

        reader.readAsDataURL(file)
      } else {
        // Pour les autres types de fichiers, simuler une réponse
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Add assistant response
        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: `J'ai analysé votre fichier "${file.name}". Que souhaitez-vous savoir à son sujet ?`,
          type: MessageType.TEXT,
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error processing file:", error)

      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Désolé, j'ai rencontré une erreur en traitant votre fichier. Veuillez réessayer.",
        type: MessageType.TEXT,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const recordAudio = () => {
    setIsRecording(true)
    // In a real implementation, this would start recording audio
    console.log("Recording started")
  }

  const stopRecording = async () => {
    if (!currentConversationId) return

    setIsRecording(false)
    console.log("Recording stopped")

    // Simulate recorded audio
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: "J'ai enregistré un message audio",
      type: MessageType.AUDIO,
      audioUrl: "/sample-audio.mp3", // This would be a real audio URL in production
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    updateConversationFlags(currentConversationId, { hasAudio: true })

    setIsLoading(true)

    try {
      // In a real implementation, you would send the audio to a server
      // for speech-to-text processing and then to DeepSeek API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Add assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "J'ai bien reçu votre message audio. Comment puis-je vous aider ?",
        type: MessageType.TEXT,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing audio:", error)

      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Désolé, j'ai rencontré une erreur en traitant votre audio. Veuillez réessayer.",
        type: MessageType.TEXT,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateImage = async (prompt: string) => {
    if (!currentConversationId) return

    // Remplacer les mentions de DeepSeek, Chine, etc.
    const modifiedPrompt = prompt
      .replace(/deepseek/gi, "Tosca AI")
      .replace(/\bchine\b/gi, "Cameroun")
      .replace(/chinoise/gi, "Camerounaise")

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: `Génère une image: ${modifiedPrompt}`,
      type: MessageType.TEXT,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Récupérer la clé API depuis le localStorage
      const apiKey = "sk-0c26947361cf426a8776e21e0c3cd3d0"

      // Call the image generation API
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey ? `Bearer ${apiKey}` : "",
        },
        body: JSON.stringify({ prompt: modifiedPrompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()

      // Add assistant response with generated image
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: `Voici l'image générée selon votre description: "${modifiedPrompt}"`,
        type: MessageType.IMAGE,
        imageUrl: data.imageUrl || "/placeholder.svg?height=512&width=512",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      updateConversationFlags(currentConversationId, { hasImages: true })
    } catch (error) {
      console.error("Error generating image:", error)

      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Désolé, j'ai rencontré une erreur en générant l'image. Veuillez réessayer.",
        type: MessageType.TEXT,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  return {
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
  }
}

