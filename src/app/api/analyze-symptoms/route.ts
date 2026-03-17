import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const LANGUAGE_MAP: Record<string, string> = {
  "en-US": "English",
  "hi-IN": "Hindi",
  "mr-IN": "Marathi",
  "gu-IN": "Gujarati",
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
}

export async function POST(req: Request) {
  const { conversation, language } = await req.json()

  if (
    !conversation ||
    !Array.isArray(conversation) ||
    conversation.length === 0
  ) {
    return NextResponse.json(
      { error: "Conversation is required" },
      { status: 400 }
    )
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const languageName = LANGUAGE_MAP[language] || "English"
    const chatHistory = conversation
      .map(
        (msg) => `${msg.role === "user" ? "Patient" : "Doctor"}: ${msg.content}`
      )
      .join("\n")

    const prompt = `You are an empathetic, interactive, and highly qualified medical doctor. Respond in ${languageName}.

Instructions:
- Greet the patient only in your very first message.
- In your first 1-2 messages, always ask for and extract the patient's name, age, and gender if not already provided. If the patient provides a name, infer gender if possible (e.g., 'Anuj Kumar' is male, 'Priya Sharma' is female). If gender cannot be confidently inferred, politely ask for it. If age is missing, ask for it. If any info is missing, ask for it early.
- Remember and use these details in your analysis and prescription.
- Ask 2–3 relevant, concise questions at a time to clarify symptoms and get a complete picture.
- As soon as you have enough information, suggest possible medications (including over-the-counter or home remedies if appropriate) and next steps.
- If you need more details, ask your questions first, then wait for the patient's reply.
- When you are ready, provide a structured analysis including possible conditions, recommendations, red flags, and next steps. Always include the patient's name, age, and gender if available.
- Always include a disclaimer that this is an AI analysis and not a substitute for professional medical advice at last in the final analysis.
- Be robust to edge cases: if the patient only provides a name, try to infer gender; if only age, ask for name and gender, etc.

Conversation so far:
${chatHistory}

Your next message as the doctor:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysis = await response.text()

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to analyze symptoms" },
      { status: 500 }
    )
  }
}
