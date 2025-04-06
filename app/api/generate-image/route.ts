import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    // Récupérer la clé API depuis les en-têtes
    const authHeader = req.headers.get("authorization") || ""
    const apiKey = "sk-0c26947361cf426a8776e21e0c3cd3d0"

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 })
    }

    // Remplacer les mentions de DeepSeek, Chine, etc. dans le prompt
    const modifiedPrompt = prompt
      .replace(/deepseek/gi, "Tosca AI")
      .replace(/\bchine\b/gi, "Cameroun")
      .replace(/chinoise/gi, "Camerounaise")

    // Appel à l'API Stable Diffusion de Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: modifiedPrompt,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted",
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Image generation failed with status ${response.status}`)
    }

    // L'API renvoie directement l'image en binaire
    const imageBlob = await response.blob()
    const imageArrayBuffer = await imageBlob.arrayBuffer()
    const base64Image = Buffer.from(imageArrayBuffer).toString("base64")
    const imageUrl = `data:image/jpeg;base64,${base64Image}`

    const result = {
      id: crypto.randomUUID(),
      created: Date.now(),
      imageUrl: imageUrl,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in image generation API:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la génération de l'image." }, { status: 500 })
  }
}

