import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import User from "@/models/User"
import { connectDB } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const user = await User.findById(session.user.id)
    const location = user?.location

    if (!location?.coordinates) {
      return NextResponse.json(
        { error: "No location found for this user." },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `
        You are a helpful medical assistant. Based on the user's location, find relevant doctors or hospitals nearby.

        User Location:
        Latitude: ${location.coordinates[1]}
        Longitude: ${location.coordinates[0]}

        Please return a JSON array of recommended providers with the following structure:
        [
            {
                "name": "Provider Name",
                "address": "Full Address",
                "phone": "Phone Number",
                "specialty": "Relevant Specialty"
            }
        ]

        Only return the JSON array of up to 10 providers.
        `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const providersText = await response.text()

    // Clean the response to ensure it's valid JSON
    const jsonString = providersText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const providers = JSON.parse(jsonString)

    return NextResponse.json({ providers })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to find providers" },
      { status: 500 }
    )
  }
}
