export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { base64, mimeType } = req.body
  if (!base64 || !mimeType) return res.status(400).json({ error: 'base64 and mimeType are required' })

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
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64
                }
              },
              {
                text: 'Describe this person for AI video character consistency. Cover: face shape, skin tone, hair (color/length/style), eye color, build, distinctive features, then full outfit detail (every item, colors, patterns, accessories, footwear). One dense paragraph, plain English, no bullets.'
              }
            ]
          }],
          generationConfig: { maxOutputTokens: 400 }
        })
      }
    )

    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message })

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return res.status(200).json({ description: text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
