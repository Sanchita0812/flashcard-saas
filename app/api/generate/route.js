import { NextResponse } from "next/server";
import { Client } from "groq-sdk"; // Correct import statement

// Initialize the GROQ Client
const groqClient = new Client({
    apiKey: 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, // Replace with your actual API key
});

export async function POST(req) {
    const { topic, cardNum } = await req.json();

    const systemPrompt = `
    Your task is to generate flashcards based on given prompts. 
    Each flashcard should have a question and an answer. 
    The question should be a concise and clear statement, 
    while the answer should provide a detailed explanation up to 15 words or solution. 
    Use your expertise to create high-quality flashcards that are informative and helpful for learning.

    Only generate 9 flashcards at a time.

    Remember to follow the best practices for flashcard creation and ensure that the content 
    is accurate and well-structured.

    Return in the following JSON format:
    {
        flashcards: [{front : str, back : str}]
    }
    `;

    try {
        const completion = await groqClient.createCompletion({
            prompt: systemPrompt + "\n\n" + topic,
            model: "llama3-70b-8192",
         // Replace with the actual model you want to use
            max_tokens: 150,
        });

        if (completion && completion.choices && completion.choices.length > 0) {
            const messageContent = completion.choices[0].text;
            const flashcards = JSON.parse(messageContent);
            return NextResponse.json(flashcards.flashcards);
        } else {
            throw new Error("No choices found in the API response");
        }
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return NextResponse.json({ error: "Failed to generate flashcards" });
    }
}
