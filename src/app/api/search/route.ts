import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
    try {
        const { query } = await request.json()
        console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant analyzing journal entries."
                },
                {
                    role: "user",
                    content: query
                }
            ],
        })

        const result = completion.choices[0]?.message?.content || "No response generated"

        return NextResponse.json({ result })
    } catch (error) {
        console.error('OpenAI API error:', error)
        return NextResponse.json(
            { error: 'Failed to process the request' },
            { status: 500 }
        )
    }
} 