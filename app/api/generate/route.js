import { NextResponse } from "next/server";
import { groq } from "groq-sdk";

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

export async function POST(req) {
    const groqClient = new groq.Client();
    const data = await req.text();

    try {
        const completion = await groqClient.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: data },
            ],
            model: "groq-model-id", // replace with the actual GROQ model ID
        });

        if (completion && completion.choices && completion.choices.length > 0) {
            const messageContent = completion.choices[0].message.content;
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
