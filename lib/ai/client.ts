import { AI_MODEL, OPENROUTER_BASE_URL } from "@/constants/ai";

const OPENROUTER_API_KEY = process.env.HACKCLUB_AIAPI;

export async function callAI(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("AI API error:", error);
    throw error;
  }
}
