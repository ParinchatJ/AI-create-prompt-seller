import { useState, useRef } from 'react'
import Head from 'next/head'

const ACCENTS = ['', 'กลาง', 'อีสาน', 'เหนือ', 'ใต้', 'English (American)', 'English (British)']
const PITCHES = ['แหลมมาก', 'แหลม', 'กลาง', 'ทุ้ม', 'ทุ้มมาก']
const VOICE_TYPES = ['ธรรมดา', 'ตะโกน', 'กระซิบ', 'ASMR', 'อ่านหนังสือ', 'ร้องไห้', 'หัวเราะ', 'โกรธ', 'ตื่นเต้น']
const MOODS = ['', 'สนุกสนาน', 'โรแมนติก', 'เศร้า', 'ตึงเครียด', 'ตื่นเต้น', 'ตลกขบขัน', 'อบอุ่น', 'ลึกลับ', 'ดราม่า', 'ซึ้ง']
const CAMS = ['extreme close-up', 'close-up', 'medium shot', 'wide shot', "overhead/bird's eye", 'low angle', 'high angle', 'POV']
const MOVES = ['static', 'slow pan left', 'slow pan right', 'tilt up', 'tilt down', 'zoom in', 'zoom out', 'dolly in', 'tracking shot', 'handheld']
const VSTYLES = ['cinematic', 'documentary', 'vlog/selfie', 'anime-style', 'vintage/film grain', 'dreamy/soft focus', 'high contrast', 'golden hour', 'neon/night']
const TIMES = ['dawn', 'morning', 'day', 'golden hour', 'dusk', 'night', 'midnight']

// Dark theme color tokens
const D = {
  page:    '#0A0A0A',
  surface: '#141414',
  raised:  '#1C1C1C',
  border:  '#2E2E2E',
  border2: '#3A3A3A',
  text:    '#F0F0F0',
  muted:   '#777777',
  yellow:  '#FFD600',
  orange:  '#FF5C00',
  purple:  '#7B2FFF',
  teal:    '#00E5C3',
  red:     '#FF3030',
  pink:    '#FF3CAC',
}

const mkChar  = id => ({ id, label: id, role: 'main', name: '', gender: 'female', age: '', accent: '', pitch: 'กลาง', vstyle: 'ธรรมดา', imgData: null, imgDesc: '' })
const mkScene = (id, num) => ({ id, num, start: '', end: '', loc: '', time: 'day', weather: '', mood: '', cam: 'medium shot', move: 'static', vstyle: 'cinematic', action: '', dialogue: [] })

const inputBase = {
  background: '#1C1C1C',
  border: '2px solid #2E2E2E',
  borderRadius: 0,
  color: '#F0F0F0',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  padding: '8px 10px',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
}

const selArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23777'/%3E%3C/svg%3E")`

function Btn({ col = 'yellow', onClick, children, disabled, full, pad = '8px 14px', style = {} }) {
  const [p, setP] = useState(false)
  const map = {
    yellow: { bg: '#FFD600', fg: '#0A0A0A', bd: '#FFD600' },
    orange: { bg: '#FF5C00', fg: '#F0F0F0', bd: '#FF5C00' },
    purple: { bg: '#7B2FFF', fg: '#F0F0F0', bd: '#7B2FFF' },
    teal:   { bg: '#00E5C3', fg: '#0A0A0A', bd: '#00E5C3' },
    red:    { bg: '#FF3030', fg: '#F0F0F0', bd: '#FF3030' },
    ghost:  { bg: '#1C1C1C', fg: '#F0F0F0', bd: '#3A3A3A' },
  }
  const c = map[col] || map.ghost
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseDown={() => setP(true)} onMouseUp={() => setP(false)} onMouseLeave={() => setP(false)}
      style={{
        background: c.bg, color: c.fg, border: `2px solid ${c.bd}`,
        fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 11,
        letterSpacing: 1, textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: pad,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        width: full ? '100%' : 'auto', justifyContent: full ? 'center' : 'flex-start',
        boxShadow: p ? 'none' : `3px 3px 0 ${c.bd}66`,
        transform: p ? 'translate(2px,2px)' : 'none',
        transition: 'transform .08s, box-shadow .08s',
        opacity: disabled ? 0.45 : 1,
        whiteSpace: 'nowrap', borderRadius: 0,
        ...style,
      }}>{children}</button>
  )
}

function Lbl({ children, req }) {
  return (
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4, color: '#777' }}>
      {children}{req && <span style={{ color: '#FF3030', fontSize: 13, lineHeight: 1 }}>*</span>}
    </div>
  )
}

function Inp({ value, onChange, placeholder, type = 'text' }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputBase} />
}
function Txt({ value, onChange, placeholder, rows = 2 }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...inputBase, resize: 'vertical' }} />
}
function Sel({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputBase, appearance: 'none', backgroundImage: selArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '10px', paddingRight: 28, cursor: 'pointer', backgroundColor: '#1C1C1C' }}>
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.v} value={typeof o === 'string' ? o : o.v} style={{ background: '#1C1C1C', color: '#F0F0F0' }}>
          {typeof o === 'string' ? o : o.l}
        </option>
      ))}
    </select>
  )
}

function Field({ label, req, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <Lbl req={req}>{label}</Lbl>}
      {children}
    </div>
  )
}

function Panel({ title, accent, textDark = false, children }) {
  return (
    <div style={{ border: `2px solid ${D.border}`, marginBottom: 20, background: D.surface }}>
      <div style={{ background: accent, padding: '9px 16px', borderBottom: `2px solid ${accent}` }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2, color: textDark ? '#0A0A0A' : '#F0F0F0' }}>{title}</span>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  )
}

// ── Character Card ────────────────────────────────────────────────────────────

function CharCard({ char, onChange, onRemove, onDescribeImg }) {
  const fileRef = useRef()
  const isMain = char.role === 'main'
  const acBg   = isMain ? D.purple : '#0A6B5A'
  const acBd   = isMain ? D.purple : D.teal

  const handleFile = file => {
    if (!file) return
    const r = new FileReader()
    r.onload = e => { onChange({ ...char, imgData: e.target.result, imgDesc: '' }); onDescribeImg(char.id, e.target.result) }
    r.readAsDataURL(file)
  }

  return (
    <div style={{ border: `2px solid ${D.border}`, marginBottom: 14, background: D.surface, boxShadow: `3px 3px 0 ${acBd}33` }}>
      <div style={{ background: acBg, borderBottom: `2px solid ${acBd}`, padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F0F0F0', letterSpacing: 2 }}>{char.label}</span>
          <span style={{ background: isMain ? D.yellow : D.pink, color: '#0A0A0A', padding: '2px 8px', fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {isMain ? 'Main' : 'Supporting'}
          </span>
        </div>
        <Btn col="red" onClick={onRemove} pad="4px 10px">✕ ลบ</Btn>
      </div>

      <div style={{ padding: 14 }}>
        <div className="grid2">
          <Field label="ชื่อตัวละคร" req><Inp value={char.name} onChange={v => onChange({ ...char, name: v })} placeholder="เช่น แม่ค้าอีสาน" /></Field>
          <Field label="บทบาท" req>
            <Sel value={char.role} onChange={v => onChange({ ...char, role: v })} options={[{ v: 'main', l: 'ตัวละครหลัก' }, { v: 'supporting', l: 'ตัวละครรอง/ฉากหลัง' }]} />
          </Field>
          <Field label="เพศ" req>
            <Sel value={char.gender} onChange={v => onChange({ ...char, gender: v })} options={[{ v: 'female', l: 'หญิง' }, { v: 'male', l: 'ชาย' }, { v: 'other', l: 'อื่นๆ' }]} />
          </Field>
          <Field label="อายุ"><Inp value={char.age} onChange={v => onChange({ ...char, age: v })} placeholder="เช่น 30" type="number" /></Field>
        </div>

        <Field label="📸 Reference Image — ไม่บังคับ">
          {char.imgData ? (
            <div>
              <div style={{ border: `2px solid ${D.border}`, overflow: 'hidden', marginBottom: 8 }}>
                <img src={char.imgData} alt="ref" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Btn col="teal" onClick={() => onDescribeImg(char.id, char.imgData)} style={{ flex: 1 }} pad="6px 10px">🔄 Describe ใหม่</Btn>
                <Btn col="red" onClick={() => onChange({ ...char, imgData: null, imgDesc: '' })} pad="6px 10px">ลบรูป</Btn>
              </div>
              {char.imgDesc === '__loading__' ? (
                <div style={{ border: `2px solid ${D.yellow}`, background: '#151200', padding: '8px 12px', fontFamily: "'Space Mono', monospace", fontSize: 11, color: D.yellow }}>
                  ⏳ AI กำลัง describe...
                </div>
              ) : (
                <Field label="AI Description — แก้ไขได้">
                  <Txt value={char.imgDesc} onChange={v => onChange({ ...char, imgDesc: v })} rows={3} placeholder="AI จะ describe รูปให้อัตโนมัติ..." />
                </Field>
              )}
            </div>
          ) : (
            <div>
              <div onClick={() => fileRef.current?.click()}
                style={{ border: `2px dashed ${D.border2}`, padding: '20px', textAlign: 'center', cursor: 'pointer', background: D.raised, marginBottom: 8, transition: 'border-color .15s, background .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = D.yellow; e.currentTarget.style.background = '#151200' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = D.border2; e.currentTarget.style.background = D.raised }}>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                <div style={{ fontSize: 24, marginBottom: 6 }}>📷</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: D.text }}>คลิกเพื่ออัปโหลดรูป</div>
                <div style={{ fontSize: 11, color: D.muted, marginTop: 3 }}>jpg, png, webp</div>
              </div>
              <Field label="หรือพิมพ์ลักษณะเอง">
                <Txt value={char.imgDesc} onChange={v => onChange({ ...char, imgDesc: v })} placeholder="รูปร่างหน้าตา การแต่งกาย... (ไม่บังคับ)" rows={2} />
              </Field>
            </div>
          )}
        </Field>

        {isMain && (
          <div style={{ borderTop: `2px dashed ${D.border}`, paddingTop: 12, marginTop: 4 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, marginBottom: 10, color: '#a67fff' }}>🎙 เสียงพูด</div>
            <div className="grid3">
              <Field label="สำเนียง" req><Sel value={char.accent} onChange={v => onChange({ ...char, accent: v })} options={ACCENTS} /></Field>
              <Field label="ระดับเสียง" req><Sel value={char.pitch} onChange={v => onChange({ ...char, pitch: v })} options={PITCHES} /></Field>
              <Field label="รูปแบบเสียง" req><Sel value={char.vstyle || 'ธรรมดา'} onChange={v => onChange({ ...char, vstyle: v })} options={VOICE_TYPES} /></Field>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Scene Card ────────────────────────────────────────────────────────────────

function SceneCard({ scene, onChange, onRemove, chars }) {
  const upLine  = (i, val) => { const d = [...scene.dialogue]; d[i] = { ...d[i], line: val };  onChange({ ...scene, dialogue: d }) }
  const upField = (i, f, v) => { const d = [...scene.dialogue]; d[i] = { ...d[i], [f]: v };    onChange({ ...scene, dialogue: d }) }
  const addDl   = () => onChange({ ...scene, dialogue: [...scene.dialogue, { cid: chars[0]?.id || 'A', line: '', vol: 'ธรรมดา' }] })
  const rmDl    = i  => onChange({ ...scene, dialogue: scene.dialogue.filter((_, idx) => idx !== i) })

  return (
    <div style={{ border: `2px solid ${D.border}`, marginBottom: 14, background: D.surface, boxShadow: `3px 3px 0 ${D.orange}33` }}>
      <div style={{ background: D.orange, borderBottom: `2px solid ${D.orange}`, padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#F0F0F0', letterSpacing: 2 }}>Scene {scene.num}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {['start', 'end'].map((k, i) => (
            <input key={k} type="number" value={scene[k]} onChange={e => onChange({ ...scene, [k]: e.target.value })} placeholder={i === 0 ? '0' : '15'}
              style={{ width: 46, textAlign: 'center', border: `2px solid ${D.border}`, background: D.raised, color: D.text, padding: '4px 4px', fontFamily: "'Space Mono', monospace", fontSize: 11, borderRadius: 0, outline: 'none' }} />
          ))}
          <span style={{ color: '#F0F0F0', fontWeight: 700 }}>วิ</span>
          <Btn col="red" onClick={onRemove} pad="4px 10px">✕</Btn>
        </div>
      </div>

      <div style={{ padding: 14 }}>
        <div className="grid2">
          <Field label="สถานที่" req><Inp value={scene.loc}     onChange={v => onChange({ ...scene, loc: v })}     placeholder="เช่น ตลาดนัด" /></Field>
          <Field label="ช่วงเวลา" req><Sel value={scene.time}   onChange={v => onChange({ ...scene, time: v })}    options={TIMES} /></Field>
          <Field label="สภาพอากาศ">  <Inp value={scene.weather} onChange={v => onChange({ ...scene, weather: v })} placeholder="เช่น แดดจัด" /></Field>
          <Field label="อารมณ์ฉาก">  <Sel value={scene.mood}    onChange={v => onChange({ ...scene, mood: v })}    options={MOODS} /></Field>
          <Field label="มุมกล้อง" req><Sel value={scene.cam}    onChange={v => onChange({ ...scene, cam: v })}     options={CAMS} /></Field>
          <Field label="การเคลื่อนกล้อง" req><Sel value={scene.move} onChange={v => onChange({ ...scene, move: v })} options={MOVES} /></Field>
        </div>
        <Field label="Visual Style" req><Sel value={scene.vstyle} onChange={v => onChange({ ...scene, vstyle: v })} options={VSTYLES} /></Field>
        <Field label="Action — ตัวละครทำอะไร" req>
          <Txt value={scene.action} onChange={v => onChange({ ...scene, action: v })} placeholder="เช่น A ยืนเรียกลูกค้า B เดินผ่านแล้วหยุด" rows={2} />
        </Field>

        <div style={{ borderTop: `2px dashed ${D.border}`, paddingTop: 12, marginTop: 4 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, marginBottom: 10, color: '#ff8c4a' }}>💬 บทพูด</div>
          {scene.dialogue.map((d, i) => (
            <div key={i} style={{ border: `2px solid ${D.border}`, padding: 10, marginBottom: 8, background: D.raised }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <select value={d.cid} onChange={e => upField(i, 'cid', e.target.value)}
                  style={{ flex: 1, background: D.purple, border: `2px solid ${D.purple}`, borderRadius: 0, padding: '6px 10px', color: '#F0F0F0', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, cursor: 'pointer', appearance: 'none', minWidth: 0, outline: 'none' }}>
                  {chars.map(c => <option key={c.id} value={c.id} style={{ background: '#1C1C1C' }}>{c.label}{c.name ? ` (${c.name})` : ''}</option>)}
                </select>
                <select value={d.vol || 'ธรรมดา'} onChange={e => upField(i, 'vol', e.target.value)}
                  style={{ width: 110, background: D.orange, border: `2px solid ${D.orange}`, borderRadius: 0, padding: '6px 8px', color: '#F0F0F0', fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, cursor: 'pointer', appearance: 'none', flexShrink: 0, outline: 'none' }}>
                  {VOICE_TYPES.map(v => <option key={v} value={v} style={{ background: '#1C1C1C' }}>{v}</option>)}
                </select>
                <button onClick={() => rmDl(i)} style={{ background: D.red, border: `2px solid ${D.red}`, color: '#F0F0F0', padding: '6px 10px', cursor: 'pointer', fontWeight: 700, flexShrink: 0, fontFamily: "'Space Mono', monospace", fontSize: 11, borderRadius: 0 }}>✕</button>
              </div>
              <input value={d.line} onChange={e => upLine(i, e.target.value)} placeholder="พิมพ์บทพูดภาษาไทย..."
                style={{ width: '100%', border: `2px solid ${D.border}`, background: D.surface, color: D.text, borderRadius: 0, padding: '7px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, display: 'block', boxSizing: 'border-box', outline: 'none' }} />
            </div>
          ))}
          <Btn col="teal" onClick={addDl} pad="6px 12px">+ เพิ่มบทพูด</Btn>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [meta, setMeta]       = useState({ duration: 45, ratio: '9:16', style: 'cinematic', concept: '', music: '', notes: '' })
  const [chars, setChars]     = useState([mkChar('A'), mkChar('B')])
  const [scenes, setScenes]   = useState([mkScene(1, 1), mkScene(2, 2)])
  const [charCC, setCharCC]   = useState(2)
  const [sceneSC, setSceneSC] = useState(2)
  const [tab, setTab]         = useState('build')
  const [prompt, setPrompt]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)
  const [error, setError]     = useState('')

  const addChar    = () => { const L = 'ABCDEFGHIJKLMNOP'; setChars(p => [...p, mkChar(L[charCC] || `X${charCC}`)]); setCharCC(n => n + 1) }
  const updateChar = (id, u) => setChars(p => p.map(c => c.id === id ? u : c))
  const removeChar = id => setChars(p => p.filter(c => c.id !== id))

  const addScene    = () => { const nid = sceneSC + 1; setScenes(p => [...p, mkScene(nid, p.length + 1)]); setSceneSC(nid) }
  const updateScene = (id, u) => setScenes(p => p.map(s => s.id === id ? u : s))
  const removeScene = id => setScenes(p => p.filter(s => s.id !== id).map((s, i) => ({ ...s, num: i + 1 })))

  // Image describe — routed through /api/describe (server-side, API key never exposed)
  const describeImg = async (charId, dataUrl) => {
    updateChar(charId, { ...chars.find(c => c.id === charId), imgDesc: '__loading__' })
    try {
      const res  = await fetch('/api/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: dataUrl.split(',')[1], mimeType: dataUrl.split(';')[0].split(':')[1] }),
      })
      const data = await res.json()
      updateChar(charId, { ...chars.find(c => c.id === charId), imgDesc: data.description || '(describe ไม่ได้)' })
    } catch {
      updateChar(charId, { ...chars.find(c => c.id === charId), imgDesc: '(เกิดข้อผิดพลาด)' })
    }
  }

  const buildRaw = () => {
    const L = ['== SHORT VIDEO PROMPT ==', `Platform: Sora/Veo | Duration: ~${meta.duration}s | Ratio: ${meta.ratio} | Style: ${meta.style}`]
    if (meta.concept) L.push(`Concept: ${meta.concept}`)
    L.push('', '-- CHARACTERS --')
    chars.filter(c => c.role === 'main').forEach(c => {
      L.push(`[${c.label}] ${c.name || 'Unnamed'} | MAIN`)
      L.push(`  Gender: ${c.gender}, Age: ~${c.age || '?'}`)
      L.push(`  Visual Reference: ${c.imgDesc && c.imgDesc !== '__loading__' ? c.imgDesc : '(not provided)'}`)
      L.push(`  Voice: Thai, ${c.accent || 'กลาง'} accent, ${c.pitch} pitch, ${c.vstyle || 'ธรรมดา'}`)
    })
    chars.filter(c => c.role === 'supporting').forEach(c => {
      const d = c.imgDesc && c.imgDesc !== '__loading__' ? c.imgDesc : ''
      L.push(`[${c.label}] ${c.name || 'Supporting'} | BACKGROUND${d ? ' — ' + d : ''}`)
    })
    L.push('', '-- SCENES --')
    scenes.forEach(s => {
      const t = s.start !== '' && s.end !== '' ? `[${s.start}s–${s.end}s]` : ''
      L.push(`SCENE ${s.num} ${t}`, `  ${s.loc || 'TBD'} | ${s.time} | ${s.weather || 'clear'} | Mood: ${s.mood || 'neutral'}`, `  Visual: ${s.vstyle} | Camera: ${s.cam}, ${s.move}`)
      if (s.action) L.push(`  Action: ${s.action}`)
      if (s.dialogue.length) {
        L.push('  Dialogue:')
        s.dialogue.forEach(d => {
          const ch = chars.find(c => c.id === d.cid)
          const tag = ch?.role === 'main' ? ` [${ch.accent || 'กลาง'}, ${ch.pitch}, ${d.vol || 'ธรรมดา'}]` : `[${d.vol || 'ธรรมดา'}]`
          L.push(`    ${ch ? ch.label + (ch.name ? ` (${ch.name})` : '') : d.cid}${tag}: "${d.line}"`)
        })
      }
      L.push('')
    })
    if (meta.music) L.push(`Music: ${meta.music}`)
    if (meta.notes) L.push(`Notes: ${meta.notes}`)
    return L.join('\n')
  }

  // Prompt generation — routed through /api/generate (server-side, API key never exposed)
  const generate = async () => {
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawPrompt: buildRaw() }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setPrompt(buildRaw()) }
      else setPrompt(data.prompt)
    } catch (err) { setError(err.message); setPrompt(buildRaw()) }
    setLoading(false)
    setTab('preview')
  }

  const copy = () => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <>
      <Head>
        <title>Video Prompt Builder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { background: #0A0A0A; color: #F0F0F0; min-height: 100vh; }
          ::placeholder { color: #444 !important; }
          input:focus, textarea:focus, select:focus { border-color: #FFD600 !important; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-thumb { background: #2E2E2E; border-radius: 0; }
          ::-webkit-scrollbar-track { background: #0A0A0A; }
          .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
          .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 12px; }
        `}</style>
      </Head>

      {/* Header */}
      <header style={{ background: '#0A0A0A', borderBottom: '3px solid #FFD600', padding: '0 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: D.yellow, padding: '2px 10px' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: '#0A0A0A' }}>🎬 VIDEO</span>
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: D.text }}>PROMPT BUILDER</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[[D.purple, '#F0F0F0', 'SORA'], [D.orange, '#F0F0F0', 'VEO'], [D.teal, '#0A0A0A', '30–60s']].map(([bg, fg, t]) => (
              <span key={t} style={{ background: bg, color: fg, padding: '2px 8px', fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>{t}</span>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: 24, border: `1px solid ${D.border}`, width: 'fit-content' }}>
          {[['build', '🛠 สร้าง Prompt'], ['preview', '📋 ดู Prompt']].map(([key, lbl], i) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ background: tab === key ? D.yellow : 'transparent', color: tab === key ? '#0A0A0A' : D.muted, border: 'none', borderRight: i === 0 ? `1px solid ${D.border}` : 'none', padding: '9px 22px', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 11, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase', transition: 'background .1s, color .1s' }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Build */}
        {tab === 'build' && (
          <>
            <Panel title="🎞 ข้อมูลภาพรวม" accent={D.yellow} textDark>
              <div className="grid3">
                <Field label="ความยาว (วินาที)" req><Inp value={meta.duration} onChange={v => setMeta({ ...meta, duration: v })} type="number" /></Field>
                <Field label="อัตราส่วนภาพ" req><Sel value={meta.ratio} onChange={v => setMeta({ ...meta, ratio: v })} options={['9:16', '16:9', '1:1', '4:5']} /></Field>
                <Field label="Visual Style" req><Sel value={meta.style} onChange={v => setMeta({ ...meta, style: v })} options={VSTYLES} /></Field>
              </div>
              <Field label="Story Concept / แก่นเรื่อง" req>
                <Txt value={meta.concept} onChange={v => setMeta({ ...meta, concept: v })} placeholder="เช่น แม่ค้าอีสานขายหมูกระทะดึงดูดลูกค้าด้วยภาษาถิ่น" rows={2} />
              </Field>
              <div className="grid2">
                <Field label="ดนตรี / เสียงประกอบ"><Inp value={meta.music} onChange={v => setMeta({ ...meta, music: v })} placeholder="เช่น เพลงลูกทุ่งเบาๆ" /></Field>
                <Field label="หมายเหตุ"><Inp value={meta.notes} onChange={v => setMeta({ ...meta, notes: v })} placeholder="เช่น slow motion ตอนท้าย" /></Field>
              </div>
            </Panel>

            <Panel title="👤 ตัวละคร" accent={D.purple}>
              {chars.map(c => <CharCard key={c.id} char={c} onChange={u => updateChar(c.id, u)} onRemove={() => removeChar(c.id)} onDescribeImg={describeImg} />)}
              <Btn col="purple" onClick={addChar}>+ เพิ่มตัวละคร</Btn>
            </Panel>

            <Panel title="🎬 ฉาก (Scenes)" accent={D.orange}>
              {scenes.map(s => <SceneCard key={s.id} scene={s} onChange={u => updateScene(s.id, u)} onRemove={() => removeScene(s.id)} chars={chars} />)}
              <Btn col="orange" onClick={addScene}>+ เพิ่มฉาก</Btn>
            </Panel>

            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Btn col="yellow" onClick={generate} disabled={loading} full style={{ maxWidth: 460, fontSize: 14, letterSpacing: 2, margin: '0 auto' }} pad="14px 24px">
                {loading ? '⏳ AI กำลังสร้าง Prompt...' : '✨ สร้าง & เสริม Prompt ด้วย AI'}
              </Btn>
            </div>
          </>
        )}

        {/* Preview */}
        {tab === 'preview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ background: D.yellow, color: '#0A0A0A', padding: '2px 10px', fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>✓ Prompt พร้อมใช้งาน</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn col={copied ? 'teal' : 'ghost'} onClick={copy} pad="7px 14px">{copied ? '✓ Copied!' : 'Copy'}</Btn>
                <Btn col="yellow" onClick={() => setTab('build')} pad="7px 14px">← แก้ไข</Btn>
              </div>
            </div>
            {error && (
              <div style={{ border: `2px solid ${D.red}`, background: '#150000', padding: '10px 14px', marginBottom: 12, fontFamily: "'Space Mono', monospace", fontSize: 11, color: D.red }}>⚠ {error}</div>
            )}
            {prompt ? (
              <>
                <pre style={{ border: `2px solid ${D.border}`, background: '#0D0D0D', color: D.yellow, padding: '20px 22px', fontSize: 12, lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 560, overflowY: 'auto', fontFamily: "'Space Mono', monospace" }}>
                  {prompt}
                </pre>
                <div style={{ marginTop: 12, border: `2px solid ${D.teal}`, background: '#001512', padding: '10px 14px', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: D.teal }}>
                  💡 คัดลอก Prompt นี้แล้ววางใน SORA หรือ VEO ได้เลย
                </div>
              </>
            ) : (
              <div style={{ border: `2px dashed ${D.border}`, padding: '50px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3, color: D.muted }}>ยังไม่มี Prompt</div>
                <div style={{ marginTop: 12 }}><Btn col="yellow" onClick={() => setTab('build')} pad="10px 20px">← กลับไปกรอกข้อมูล</Btn></div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}
