
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { transcript } = await req.json();

        if (!transcript || !transcript.trim()) {
            return NextResponse.json({
                summary: "Interview ended, but no transcript was available.",
            });
        }

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({
                summary:
                    "Interview completed.\n\n" +
                    "You ended the interview early, so a full evaluation could not be generated.",
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are an interviewer evaluating a mock interview for educational purposes.",
                        },
                        {
                            role: "user",
                            content: `
Generate a short interview evaluation in this format:

Strengths:
- ...

Weaknesses:
- ...

Overall Score: X/10

Transcript:
${transcript}
`,
                        },
                    ],
                    temperature: 0.3,
                    max_tokens: 400,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API error:", data);
            return NextResponse.json({
                summary:
                    "Interview completed.\n\n" +
                    "You ended the interview early, or the interview was too short to generate a full evaluation.\n\n" +
                    "Tip:\n" +
                    "• Answer at least 3–4 questions\n" +
                    "• Speak in complete sentences",
            });
        }

        const summary = data?.choices?.[0]?.message?.content;

        if (!summary || !summary.trim()) {
            return NextResponse.json({
                summary:
                    "Interview completed.\n\n" +
                    "You ended the interview early, so a full evaluation could not be generated.\n\n" +
                    "Tip:\n" +
                    "• Try answering at least 3–4 questions\n" +
                    "• Speak in complete sentences",
            });
        }

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Groq summary error:", error);

        return NextResponse.json({
            summary:
                "Interview completed.\n\n" +
                "You ended the interview early, so a full evaluation could not be generated.",
        });
    }
}
