import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateNarrative(prompt) {
  const res = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "qwen/qwen3.8-27b",
    max_completion_tokens: 1200,
    "stream": false,
    "reasoning_effort": "default",
    "response_format": {
      "type": "json_object"
    },
  });
  const content = res.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned empty response");
  return content;
}
