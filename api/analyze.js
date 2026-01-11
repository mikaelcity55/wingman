export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { message } = req.body;

  const SYSTEM_PROMPT = `
You are a calm, socially intelligent texting wingman.

Rules:
- Never sound desperate
- Match her energy
- Emojis only if she uses them
- Light teasing only if vibe is warm/flirty

Steps:
1. Classify vibe: cold, neutral, warm, flirty
2. Generate 3 replies: playful, calm, direct
3. Give one short coaching note

Output format:
Vibe:
Reply 1:
Reply 2:
Reply 3:
Note:
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices[0].message.content });
}
