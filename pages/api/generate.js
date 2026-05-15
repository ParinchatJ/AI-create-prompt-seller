export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { rawPrompt } = req.body
  if (!rawPrompt) return res.status(400).json({ error: 'rawPrompt is required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in environment' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `You are a professional AI video prompt engineer for Sora and Veo.

Polish this prompt:
1. Keep ALL character visual descriptions EXACTLY — critical for character consistency across clips
2. Fill missing context intelligently based on the concept
3. Add vivid cinematic detail: lighting, colors, textures, atmosphere
4. Keep Thai dialogue lines as-is; annotate each line with voice style in parentheses
5. Add smooth camera transitions between scenes
6. Reinforce character consistency instructions so the AI generates the same person in every scene

Format clearly: VIDEO INFO → CHARACTERS (with full visual reference) → SCENES (numbered)

${rawPrompt}`
        }]
      })
    })

    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message })

    const text = data.content?.map(b => b.text || '').join('\n') || rawPrompt
    return res.status(200).json({ prompt: text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
