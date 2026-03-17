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

    const prompt = `You are an experienced medical doctor. Based on the following conversation with the patient, write a formal medical prescription in ${languageName}. The prescription should include:
- Patient name, age, gender (if available)
- Date
- Diagnosis/Assessment
- Medications (with dosage, frequency, and duration)
- Advice/Instructions
- Follow-up instructions
- Doctor's name: Dr. Medicare AI
- Signature: (AI generated)

Do NOT use markdown, asterisks, or bullet points. Format the prescription as a real doctor would, with clear sections and line breaks. Use only plain text. If any information is missing, use placeholders or leave blank.

Conversation:
${chatHistory}

Write the prescription below:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const prescription = await response.text()

    return NextResponse.json({ prescription })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to generate prescription" },
      { status: 500 }
    )
  }
}
