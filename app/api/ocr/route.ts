import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()

    // Récupérer la clé API depuis les en-têtes
    const authHeader = req.headers.get("authorization") || ""
    const apiKey = "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"

    if (!apiKey || !imageUrl) {
      return NextResponse.json({ error: "API key and image URL are required" }, { status: 400 })
    }

    // Appel à l'API OCR de Hugging Face (Microsoft's Donut model for OCR)
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/donut-base-finetuned-cord-v2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error(`OCR failed with status ${response.status}`)
    }

    const data = await response.json()

    // Effectuer les remplacements demandés dans la réponse
    let extractedText = data[0]?.generated_text || "Je n'ai pas pu extraire de texte de cette image."
    extractedText = extractedText
      .replace(/deepseek/gi, "Tosca AI")
      .replace(/\bchine\b/gi, "Cameroun")
      .replace(/chinoise/gi, "Camerounaise")

    const result = {
      id: crypto.randomUUID(),
      created: Date.now(),
      text: extractedText,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in OCR API:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'extraction de texte de l'image." },
      { status: 500 },
    )
  }
}

