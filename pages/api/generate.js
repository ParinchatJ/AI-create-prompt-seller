export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { rawPrompt } = req.body
  if (!rawPrompt) return res.status(400).json({ error: 'rawPrompt is required' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set in environment' })

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional AI video prompt engineer specializing in Google Veo and Sora.

Convert the structured input below into a **Veo-ready video prompt** in English. Output format must be:

1. **One rich cinematic paragraph per scene** — written as a camera direction, not a list. Include: exact location, time of day, lighting, weather/atmosphere, character appearance (face, hair, outfit — exact details), action/movement, camera angle, camera movement, lens feel, color grade, mood. Be extremely specific and visual.

2. **Character consistency block** at the top — describe each main character in one dense paragraph so Veo generates the same person every scene. Include: skin tone, face shape, hair, eyes, build, exact outfit with colors and textures.

3. **Dialogue** — write each line as: [CHARACTER NAME, Thai language, ACCENT accent, PITCH pitch, VOICE STYLE]: "dialogue line"

4. **No bullet points, no headers, no structured text** — pure cinematic prose that a filmmaker would write.

5. Fill ALL missing details creatively based on the concept. Make it vivid, specific, and production-ready.

6. Output in English only (keep Thai dialogue lines as-is inside quotes).

INPUT:
${rawPrompt}`
            }]
          }],
          generationConfig: { maxOutputTokens: 1500 }
        })
      }
    )

    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message })

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || rawPrompt
    return res.status(200).json({ prompt: text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
