export const ACCENTS = ['', 'กลาง', 'อีสาน', 'เหนือ', 'ใต้', 'English (American)', 'English (British)']
export const PITCHES = ['แหลมมาก', 'แหลม', 'กลาง', 'ทุ้ม', 'ทุ้มมาก']
export const VOICE_TYPES = ['ธรรมดา', 'ตะโกน', 'กระซิบ', 'ASMR', 'อ่านหนังสือ', 'ร้องไห้', 'หัวเราะ', 'โกรธ', 'ตื่นเต้น']
export const MOODS = ['', 'สนุกสนาน', 'โรแมนติก', 'เศร้า', 'ตึงเครียด', 'ตื่นเต้น', 'ตลกขบขัน', 'อบอุ่น', 'ลึกลับ', 'ดราม่า', 'ซึ้ง']
export const CAMERAS = ['extreme close-up', 'close-up', 'medium shot', 'wide shot', 'overhead/bird\'s eye', 'low angle', 'high angle', 'POV']
export const MOVES = ['static', 'slow pan left', 'slow pan right', 'tilt up', 'tilt down', 'zoom in', 'zoom out', 'dolly in', 'tracking shot', 'handheld']
export const VSTYLES = ['cinematic', 'documentary', 'vlog/selfie', 'anime-style', 'vintage/film grain', 'dreamy/soft focus', 'high contrast', 'golden hour', 'neon/night']
export const TIMES = ['dawn', 'morning', 'day', 'golden hour', 'dusk', 'night', 'midnight']

export const makeChar = (id, label) => ({
  id, label, role: 'main', name: '', gender: 'female', age: '',
  accent: '', pitch: 'กลาง', vstyle: 'ธรรมดา', imgData: null, imgDesc: ''
})

export const makeScene = (id, num) => ({
  id, num, start: '', end: '', loc: '', time: 'day', weather: '',
  mood: '', cam: 'medium shot', move: 'static', vstyle: 'cinematic',
  action: '', dialogue: []
})

export function buildRaw(meta, chars, scenes) {
  const out = ['== SHORT VIDEO PROMPT ==']
  out.push(`Platform: Sora/Veo | Duration: ~${meta.duration}s | Ratio: ${meta.ratio} | Style: ${meta.style}`)
  if (meta.concept) out.push(`Concept: ${meta.concept}`)
  out.push('')
  out.push('-- CHARACTERS --')
  chars.filter(c => c.role === 'main').forEach(c => {
    out.push(`[${c.label}] ${c.name || 'Unnamed'} | MAIN`)
    out.push(`  Gender: ${c.gender}, Age: ~${c.age || '?'}`)
    const desc = c.imgDesc && c.imgDesc !== '__loading__' ? c.imgDesc : ''
    out.push(`  Visual Reference: ${desc || '(not provided)'}`)
    out.push(`  Voice: Thai, ${c.accent || 'กลาง'} accent, ${c.pitch} pitch, ${c.vstyle}`)
  })
  chars.filter(c => c.role === 'supporting').forEach(c => {
    const desc = c.imgDesc && c.imgDesc !== '__loading__' ? c.imgDesc : ''
    out.push(`[${c.label}] ${c.name || 'Supporting'} | BACKGROUND${desc ? ' — ' + desc : ''}`)
  })
  out.push('')
  out.push('-- SCENES --')
  scenes.forEach(s => {
    const t = s.start !== '' && s.end !== '' ? `[${s.start}s–${s.end}s]` : ''
    out.push(`SCENE ${s.num} ${t}`)
    out.push(`  ${s.loc || 'TBD'} | ${s.time} | ${s.weather || 'clear'} | Mood: ${s.mood || 'neutral'}`)
    out.push(`  Visual: ${s.vstyle} | Camera: ${s.cam}, ${s.move}`)
    if (s.action) out.push(`  Action: ${s.action}`)
    if (s.dialogue.length) {
      out.push('  Dialogue:')
      s.dialogue.forEach(d => {
        const ch = chars.find(c => c.id === d.cid)
        const label = ch ? `${ch.label}${ch.name ? ' (' + ch.name + ')' : ''}` : d.cid
        const vTag = ch?.role === 'main'
          ? ` [${ch.accent || 'กลาง'}, ${ch.pitch}, ${d.vol || 'ธรรมดา'}]`
          : ` [${d.vol || 'ธรรมดา'}]`
        out.push(`    ${label}${vTag}: "${d.line}"`)
      })
    }
    out.push('')
  })
  if (meta.music) out.push(`Music: ${meta.music}`)
  if (meta.notes) out.push(`Notes: ${meta.notes}`)
  return out.join('\n')
}
