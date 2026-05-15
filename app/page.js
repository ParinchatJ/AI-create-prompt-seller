'use client'
import { useState, useRef, useCallback } from 'react'
import { ACCENTS, PITCHES, VOICE_TYPES, MOODS, CAMERAS, MOVES, VSTYLES, TIMES, makeChar, makeScene, buildRaw } from '../lib/constants'

// ─── small helpers ───────────────────────────────────────────────
function Sel({ label, value, onChange, options }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => {
          const v = typeof o === 'string' ? o : o.value
          const l = typeof o === 'string' ? o : o.label
          return <option key={v} value={v}>{l}</option>
        })}
      </select>
    </div>
  )
}
function Inp({ label, value, onChange, placeholder, type = 'text', style }) {
  return (
    <div className="field" style={style}>
      {label && <label>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}
function TA({ label, value, onChange, placeholder, rows = 2 }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

// ─── Character card ───────────────────────────────────────────────
function CharCard({ char, onChange, onRemove, allChars }) {
  const isMain = char.role === 'main'
  const fileRef = useRef()

  const toBase64 = file => new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })

  const handleFile = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await toBase64(file)
    onChange({ ...char, imgData: dataUrl, imgDesc: '__loading__' })
    describeImg(char.id, dataUrl)
  }

  const describeImg = async (cid, dataUrl) => {
    const base64 = dataUrl.split(',')[1]
    const mime = dataUrl.split(';')[0].split(':')[1]
    try {
      const res = await fetch('/api/describe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mime })
      })
      const data = await res.json()
      onChange(prev => ({ ...prev, imgDesc: data.result || '(ไม่สามารถ describe ได้)' }))
    } catch {
      onChange(prev => ({ ...prev, imgDesc: '(เกิดข้อผิดพลาด)' }))
    }
  }

  const redescribe = () => {
    if (!char.imgData) return
    onChange({ ...char, imgDesc: '__loading__' })
    describeImg(char.id, char.imgData)
  }

  const accentColor = isMain ? 'var(--purple)' : 'var(--cyan)'

  return (
    <div className={`char-card ${isMain ? 'char-card-main' : 'char-card-support'}`}>
      {/* header row */}
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div className="flex" style={{ gap: 10 }}>
          <span className="char-label-badge" style={{ color: accentColor }}>{char.label}</span>
          <span className="tag" style={{ color: accentColor, borderColor: accentColor }}>
            {isMain ? 'ตัวละครหลัก' : 'ตัวละครรอง'}
          </span>
        </div>
        <button className="btn btn-red btn-sm" onClick={onRemove}>✕ ลบ</button>
      </div>

      {/* basic info */}
      <div className="grid2">
        <Inp label="ชื่อตัวละคร" value={char.name} onChange={v => onChange({ ...char, name: v })} placeholder="เช่น แม่ค้าอีสาน" />
        <Sel label="บทบาท" value={char.role} onChange={v => onChange({ ...char, role: v })}
          options={[{ value: 'main', label: 'ตัวละครหลัก' }, { value: 'supporting', label: 'ตัวละครรอง' }]} />
        <Sel label="เพศ" value={char.gender} onChange={v => onChange({ ...char, gender: v })}
          options={[{ value: 'female', label: 'หญิง' }, { value: 'male', label: 'ชาย' }, { value: 'other', label: 'อื่นๆ' }]} />
        <Inp label="อายุ" value={char.age} onChange={v => onChange({ ...char, age: v })} placeholder="เช่น 30" />
      </div>

      {/* image reference */}
      <div className="field">
        <label>📸 รูปตัวละคร — <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>ไม่บังคับ, AI จะ describe ให้</span></label>
        {char.imgData ? (
          <>
            <div className="upload-zone has-img">
              <img src={char.imgData} className="upload-thumb" alt="ref" />
            </div>
            <div className="flex" style={{ gap: 6, marginTop: 7 }}>
              <button className="btn btn-cyan btn-sm" style={{ flex: 1 }} onClick={redescribe}>🔄 Describe ใหม่</button>
              <button className="btn btn-red btn-sm" onClick={() => onChange({ ...char, imgData: null, imgDesc: '' })}>ลบรูป</button>
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="ai-badge">✦ AI DESCRIPTION</div>
              {char.imgDesc === '__loading__'
                ? <div className="ai-desc-loading">AI กำลัง describe รูปภาพ...</div>
                : <textarea className="ai-desc-ta" rows={3} value={char.imgDesc}
                    onChange={e => onChange({ ...char, imgDesc: e.target.value })}
                    placeholder="AI description จะแสดงที่นี่ หรือพิมพ์เองก็ได้" />
              }
            </div>
          </>
        ) : (
          <>
            <div className="upload-zone" onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              <div style={{ color: '#999', fontSize: 11, padding: '8px 0' }}>
                <div style={{ fontSize: 22, marginBottom: 5 }}>📷</div>
                คลิกเพื่ออัปโหลดรูปตัวละคร<br />
                <span style={{ fontSize: 10, color: '#bbb' }}>jpg, png, webp</span>
              </div>
            </div>
            <textarea className="ai-desc-ta" rows={2} value={char.imgDesc}
              onChange={e => onChange({ ...char, imgDesc: e.target.value })}
              placeholder="หรือพิมพ์บรรยายลักษณะ/การแต่งกายเอง (ไม่บังคับ)"
              style={{ marginTop: 6 }} />
          </>
        )}
      </div>

      {/* voice (main only) */}
      {isMain && (
        <>
          <hr className="divider" />
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: accentColor, marginBottom: 8 }}>🎙 เสียงพูด</div>
          <div className="grid3">
            <Sel label="สำเนียง" value={char.accent} onChange={v => onChange({ ...char, accent: v })} options={ACCENTS} />
            <Sel label="ระดับเสียง" value={char.pitch} onChange={v => onChange({ ...char, pitch: v })} options={PITCHES} />
            <Sel label="รูปแบบเสียง" value={char.vstyle} onChange={v => onChange({ ...char, vstyle: v })} options={VOICE_TYPES} />
          </div>
        </>
      )}
    </div>
  )
}

// ─── Scene card ───────────────────────────────────────────────────
function DialogueRow({ d, idx, sid, chars, onChange, onRemove }) {
  return (
    <div className="dl-block">
      <div className="dl-top">
        <select className="dl-who" value={d.cid} onChange={e => onChange('cid', e.target.value)}>
          {chars.map(c => <option key={c.id} value={c.id}>{c.label}{c.name ? ` (${c.name})` : ''}</option>)}
        </select>
        <select className="dl-vol" value={d.vol} onChange={e => onChange('vol', e.target.value)}>
          {VOICE_TYPES.map(v => <option key={v}>{v}</option>)}
        </select>
        <button className="dl-del" onClick={onRemove}>✕</button>
      </div>
      <input className="dl-input" value={d.line} onChange={e => onChange('line', e.target.value)}
        placeholder="พิมพ์บทพูดภาษาไทย..." />
    </div>
  )
}

function SceneCard({ scene, onChange, onRemove, allChars }) {
  const updDl = (i, field, val) => {
    const d = [...scene.dialogue]
    d[i] = { ...d[i], [field]: val }
    onChange({ ...scene, dialogue: d })
  }
  const addDl = () => onChange({ ...scene, dialogue: [...scene.dialogue, { cid: allChars[0]?.id || 'A', line: '', vol: 'ธรรมดา' }] })
  const remDl = i => onChange({ ...scene, dialogue: scene.dialogue.filter((_, idx) => idx !== i) })

  return (
    <div className="scene-card">
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div className="flex" style={{ gap: 10 }}>
          <span className="scene-number">SCENE {scene.num}</span>
        </div>
        <div className="flex" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div className="flex" style={{ gap: 6, alignItems: 'center' }}>
            <input type="number" value={scene.start} onChange={e => onChange({ ...scene, start: e.target.value })}
              placeholder="0" style={{ width: 52, textAlign: 'center' }} />
            <span style={{ color: '#999', fontWeight: 700 }}>–</span>
            <input type="number" value={scene.end} onChange={e => onChange({ ...scene, end: e.target.value })}
              placeholder="15" style={{ width: 52, textAlign: 'center' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#666' }}>วิ</span>
          </div>
          <button className="btn btn-red btn-sm" onClick={onRemove}>✕ ลบ</button>
        </div>
      </div>

      <div className="grid2">
        <Inp label="สถานที่" value={scene.loc} onChange={v => onChange({ ...scene, loc: v })} placeholder="เช่น ตลาดนัด" />
        <Sel label="ช่วงเวลา" value={scene.time} onChange={v => onChange({ ...scene, time: v })} options={TIMES} />
        <Inp label="สภาพอากาศ" value={scene.weather} onChange={v => onChange({ ...scene, weather: v })} placeholder="เช่น แดดจัด" />
        <Sel label="อารมณ์ฉาก" value={scene.mood} onChange={v => onChange({ ...scene, mood: v })} options={MOODS} />
        <Sel label="มุมกล้อง" value={scene.cam} onChange={v => onChange({ ...scene, cam: v })} options={CAMERAS} />
        <Sel label="การเคลื่อนกล้อง" value={scene.move} onChange={v => onChange({ ...scene, move: v })} options={MOVES} />
      </div>
      <Sel label="Visual Style" value={scene.vstyle} onChange={v => onChange({ ...scene, vstyle: v })} options={VSTYLES} />
      <TA label="Action — ตัวละครทำอะไร" value={scene.action}
        onChange={v => onChange({ ...scene, action: v })}
        placeholder="เช่น A ยืนเรียกลูกค้า พลางยกชิ้นหมู B เดินผ่านแล้วหยุด" />

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--orange)', margin: '10px 0 8px' }}>
        💬 บทพูด
      </div>
      {scene.dialogue.map((d, i) => (
        <DialogueRow key={i} d={d} idx={i} sid={scene.id} chars={allChars}
          onChange={(field, val) => updDl(i, field, val)}
          onRemove={() => remDl(i)} />
      ))}
      <button className="btn btn-cyan btn-sm" style={{ marginTop: 4 }} onClick={addDl}>+ เพิ่มบทพูด</button>
    </div>
  )
}

// ─── Main app ─────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState('build')
  const [meta, setMeta] = useState({ duration: '45', ratio: '9:16', style: 'cinematic', concept: '', music: '', notes: '' })
  const [chars, setChars] = useState([makeChar('A', 'A'), makeChar('B', 'B')])
  const [scenes, setScenes] = useState([makeScene(1, 1), makeScene(2, 2)])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const charCounter = useRef(2)
  const sceneCounter = useRef(2)

  const addChar = () => {
    const labels = 'ABCDEFGHIJKLMNOP'
    const id = labels[charCounter.current] || `X${charCounter.current}`
    charCounter.current++
    setChars(prev => [...prev, makeChar(id, id)])
  }
  const updChar = (id, updated) => {
    setChars(prev => prev.map(c => c.id === id ? (typeof updated === 'function' ? updated(c) : updated) : c))
  }
  const remChar = id => setChars(prev => prev.filter(c => c.id !== id))

  const addScene = () => {
    sceneCounter.current++
    setScenes(prev => [...prev, makeScene(sceneCounter.current, prev.length + 1)])
  }
  const updScene = (id, updated) => setScenes(prev => prev.map(s => s.id === id ? updated : s))
  const remScene = id => setScenes(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, num: i + 1 })))

  const generate = async () => {
    setLoading(true)
    const raw = buildRaw(meta, chars, scenes)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw })
      })
      const data = await res.json()
      setPrompt(data.result || raw)
    } catch { setPrompt(raw) }
    setLoading(false)
    setTab('preview')
  }

  const copy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="header-bar">
        <div>
          <div className="header-logo">🎬 PROMPT BUILDER</div>
          <div className="header-sub">FOR SORA / VEO · AI-ENHANCED · 30–60s</div>
        </div>
        <div className="flex" style={{ gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--yellow)', display: 'inline-block', border: '1.5px solid #fff' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block', border: '1.5px solid #fff' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', border: '1.5px solid #fff' }} />
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 16px 60px' }}>
        {/* Tabs */}
        <div className="flex" style={{ gap: 8, marginBottom: 20 }}>
          <button className={`tab ${tab === 'build' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('build')}>🛠 สร้าง</button>
          <button className={`tab ${tab === 'preview' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('preview')}>📋 Prompt</button>
        </div>

        {tab === 'build' && (
          <>
            {/* ── Meta ── */}
            <div className="section stripe-yellow">
              <div className="section-title" style={{ color: 'var(--black)' }}>🎞 ภาพรวม</div>
              <div className="grid3">
                <Inp label="ความยาว (วินาที)" type="number" value={meta.duration} onChange={v => setMeta({ ...meta, duration: v })} />
                <Sel label="อัตราส่วน" value={meta.ratio} onChange={v => setMeta({ ...meta, ratio: v })} options={['9:16', '16:9', '1:1', '4:5']} />
                <Sel label="Visual Style" value={meta.style} onChange={v => setMeta({ ...meta, style: v })} options={VSTYLES} />
              </div>
              <TA label="Story Concept" value={meta.concept} onChange={v => setMeta({ ...meta, concept: v })}
                placeholder="เช่น แม่ค้าอีสานขายหมูกระทะดึงดูดลูกค้าด้วยภาษาถิ่น" />
              <div className="grid2">
                <Inp label="ดนตรี / เสียงประกอบ" value={meta.music} onChange={v => setMeta({ ...meta, music: v })} placeholder="เช่น เพลงลูกทุ่งเบาๆ" />
                <Inp label="หมายเหตุ" value={meta.notes} onChange={v => setMeta({ ...meta, notes: v })} placeholder="เช่น slow motion ตอนท้าย" />
              </div>
            </div>

            {/* ── Characters ── */}
            <div className="section stripe-purple">
              <div className="section-title" style={{ color: 'var(--purple)' }}>👤 ตัวละคร</div>
              {chars.map(c => (
                <CharCard key={c.id} char={c}
                  onChange={updated => updChar(c.id, updated)}
                  onRemove={() => remChar(c.id)}
                  allChars={chars} />
              ))}
              <button className="btn btn-purple btn-md" onClick={addChar}>+ เพิ่มตัวละคร</button>
            </div>

            {/* ── Scenes ── */}
            <div className="section stripe-orange">
              <div className="section-title" style={{ color: 'var(--orange)' }}>🎬 ฉาก</div>
              {scenes.map(s => (
                <SceneCard key={s.id} scene={s}
                  onChange={updated => updScene(s.id, updated)}
                  onRemove={() => remScene(s.id)}
                  allChars={chars} />
              ))}
              <button className="btn btn-orange btn-md" onClick={addScene}>+ เพิ่มฉาก</button>
            </div>

            <button className="btn btn-black btn-lg" disabled={loading} onClick={generate}
              style={{ width: '100%', justifyContent: 'center', fontSize: 16, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ AI กำลังสร้าง Prompt...' : '✨ สร้าง & เสริม Prompt ด้วย AI'}
            </button>
          </>
        )}

        {tab === 'preview' && (
          <div>
            <div className="flex-between" style={{ marginBottom: 14, alignItems: 'center' }}>
              <span className="tag" style={{ color: 'var(--purple)', borderColor: 'var(--purple)', fontSize: 11 }}>✦ PROMPT READY</span>
              <div className="flex" style={{ gap: 8 }}>
                <button className="btn btn-sm" style={{ background: copied ? 'var(--green)' : 'var(--black)', color: copied ? 'var(--black)' : 'var(--white)', border: 'var(--border)' }}
                  onClick={copy}>{copied ? '✓ Copied!' : 'Copy'}</button>
                <button className="btn btn-yellow btn-sm" onClick={() => setTab('build')}>← แก้ไข</button>
              </div>
            </div>
            {prompt
              ? <pre className="prompt-out">{prompt}</pre>
              : <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
                  <div>กลับไปกรอกข้อมูลแล้วกด "สร้าง & เสริม Prompt"</div>
                  <button className="btn btn-black btn-md" style={{ marginTop: 16 }} onClick={() => setTab('build')}>← กลับ</button>
                </div>
            }
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#fff', border: 'var(--border)', borderRadius: 'var(--radius)', fontSize: 12, color: '#555' }}>
              💡 คัดลอก Prompt แล้ววางใน <strong>Sora</strong> หรือ <strong>Veo</strong> ได้เลย
            </div>
          </div>
        )}
      </div>
    </>
  )
}
