export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { base64, mimeType } = req.body
  if (!base64 || !mimeType) return res.status(400).json({ error: 'base64 and mimeType are required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' })

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
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
            { type: 'text', text: 'Describe this person for AI video character consistency. Cover: face shape, skin tone, hair (color/length/style), eye color, build, distinctive features, then full outfit detail (every item, colors, patterns, accessories, footwear). One dense paragraph, plain English, no bullets.' }
          ]
        }]
      })
    })

    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message })

    const text = data.content?.map(b => b.text || '').join('') || ''
    return res.status(200).json({ description: text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
