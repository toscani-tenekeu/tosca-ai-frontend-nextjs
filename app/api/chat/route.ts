import { NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // In a real implementation, this would call the DeepSeek API
    // using the API key: sk-0c26947361cf426a8776e21e0c3cd3d0

    // For now, we'll simulate a response
    const response = {
      id: crypto.randomUUID(),
      object: "chat.completion",
      created: Date.now(),
      model: "deepseek-chat",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Je suis TOSCA AI, votre assistant IA futuriste. Comment puis-je vous aider aujourd'hui ?",
          },
          finish_reason: "stop",
        },
      ],
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors du traitement de votre demande." }, { status: 500 })
  }
}

