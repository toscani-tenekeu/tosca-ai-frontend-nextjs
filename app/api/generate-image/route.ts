import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    // In a real implementation, this would call the DeepSeek API
    // for image generation using the API key

    // For now, we'll simulate a response
    const response = {
      id: crypto.randomUUID(),
      created: Date.now(),
      imageUrl: "/placeholder.svg?height=512&width=512", // This would be a real image URL in production
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in image generation API:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la génération de l'image." }, { status: 500 })
  }
}

