import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    // Récupérer la clé API depuis les en-têtes
    const authHeader = req.headers.get("authorization") || ""
    const apiKey = "sk-0c26947361cf426a8776e21e0c3cd3d0";

    // Dans une implémentation réelle, vous appelleriez l'API DeepSeek pour la génération d'images
    // en utilisant la clé API fournie

    // Pour la démo, nous simulons une réponse
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

