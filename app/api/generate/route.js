export const runtime = 'edge'

export async function POST(req) {
  const { raw } = await req.json()
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
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are a professional AI video prompt engineer for Sora and Veo.\n\nPolish this prompt:\n1. Keep ALL character visual descriptions EXACTLY — critical for consistency\n2. Fill missing context intelligently\n3. Add vivid cinematic detail (lighting, colors, atmosphere)\n4. Keep Thai dialogue lines as-is; annotate each line with voice style\n5. Add smooth camera transitions between scenes\n6. Reinforce character consistency across all scenes\n\nFormat: VIDEO INFO → CHARACTERS → SCENES\n\n${raw}`
      }]
    })
  })

  const data = await res.json()
  const text = data.content?.map(b => b.text || '').join('\n') || raw
  return new Response(JSON.stringify({ result: text }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
