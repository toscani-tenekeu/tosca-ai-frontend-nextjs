import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { imageUrl, question } = await req.json()

    // Récupérer la clé API depuis les en-têtes
    const authHeader = req.headers.get("authorization") || ""
    const apiKey = "sk-0c26947361cf426a8776e21e0c3cd3d0"

    if (!apiKey || !imageUrl) {
      return NextResponse.json({ error: "API key and image URL are required" }, { status: 400 })
    }

    // Remplacer les mentions dans la question
    const modifiedQuestion = question
      .replace(/deepseek/gi, "Tosca AI")
      .replace(/\bchine\b/gi, "Cameroun")
      .replace(/chinoise/gi, "Camerounaise")

    // Appel à l'API de vision de Hugging Face
    const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          image: imageUrl,
          text: modifiedQuestion || "Décris cette image en détail.",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Image analysis failed with status ${response.status}`)
    }

    const data = await response.json()

    // Effectuer les remplacements demandés dans la réponse
    let content = data[0]?.generated_text || "Je ne peux pas analyser cette image."
    content = content
      .replace(/je suis deepseek/gi, "Je suis Tosca AI")
      .replace(/par deepseek/gi, "Par Toscanisoft")
      .replace(/\bchine\b/gi, "Cameroun")
      .replace(/chinoise/gi, "Camerounaise")

    const result = {
      id: crypto.randomUUID(),
      created: Date.now(),
      analysis: content,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in image analysis API:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de l'analyse de l'image." }, { status: 500 })
  }
}

