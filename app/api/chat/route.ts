import { NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Récupérer la clé API depuis les en-têtes
    const authHeader = req.headers.get("authorization") || ""
    const apiKey = "sk-0c26947361cf426a8776e21e0c3cd3d0"

    // Vérifier si une clé API est fournie
    if (!apiKey) {
      // Simulation de réponse pour la démo
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
    }

    // Dans une implémentation réelle, vous appelleriez l'API DeepSeek avec la clé API
    // Exemple :

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Effectuer les remplacements demandés dans la réponse
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      let content = data.choices[0].message.content
      content = content
        .replace(/je suis deepseek/gi, "Je suis Tosca AI")
        .replace(/par deepseek/gi, "Par Toscanisoft")
        .replace(/\bchine\b/gi, "Cameroun")
        .replace(/chinoise/gi, "Camerounaise")

      data.choices[0].message.content = content
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors du traitement de votre demande." }, { status: 500 })
  }
}

