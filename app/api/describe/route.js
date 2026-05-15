export const runtime = 'edge'

export async function POST(req) {
  const { base64, mime } = await req.json()
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return new Response(JSON.stringify({ error: 'No API key' }), { status: 500 })

  const res = await fetch('https://api.anthropic.com/v1/messages', {
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
          { type: 'image', source: { type: 'base64', media_type: mime, data: base64 } },
          { type: 'text', text: 'Describe this person for AI video character consistency. Cover: face shape, skin tone, hair (color/length/style), eye color, build, distinctive features, then full outfit detail (every item, colors, patterns, accessories, footwear). One dense paragraph, plain English, no bullets.' }
        ]
      }]
    })
  })

  const data = await res.json()
  const text = data.content?.map(b => b.text || '').join('') || ''
  return new Response(JSON.stringify({ result: text }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
