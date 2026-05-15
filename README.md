# 🎬 Video Prompt Builder

Short video prompt builder สำหรับ Sora / Veo พร้อม AI enhancement

## Deploy บน Vercel

### 1. Push ขึ้น GitHub
```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USER/video-prompt-builder.git
git push -u origin main
```

### 2. Import บน Vercel
- ไปที่ https://vercel.com/new
- เลือก repo จาก GitHub
- กด Deploy

### 3. ตั้ง Environment Variable
ใน Vercel Dashboard → Project → Settings → Environment Variables:
```
ANTHROPIC_API_KEY = sk-ant-xxxxxxxx
```

### 4. Redeploy
กด Redeploy หลังใส่ API key แล้ว

---

## Run ในเครื่อง

```bash
npm install
cp .env.example .env.local
# แก้ .env.local ใส่ ANTHROPIC_API_KEY จริง
npm run dev
```

เปิด http://localhost:3000

---

## โครงสร้างไฟล์

```
pages/
  index.js          ← หน้าหลัก
  api/
    generate.js     ← API สร้าง prompt (ผ่าน Anthropic server-side)
    describe.js     ← API describe รูปตัวละคร
styles/
  globals.css       ← global styles
```
