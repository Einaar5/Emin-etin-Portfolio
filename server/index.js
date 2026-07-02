// Basit içerik API'si + statik site sunucusu.
// İçerik tek satırda (id=1) jsonb olarak Postgres'te tutulur.
// Ortam değişkenleri (Render → Environment):
//   DATABASE_URL     : Postgres bağlantı adresi (Render Internal Database URL)
//   ADMIN_PASSWORD   : Admin panel yazma şifresi (frontend'deki şifreyle aynı olmalı)
import express from "express"
import pkg from "pg"
import path from "path"
import { fileURLToPath } from "url"

const { Pool } = pkg
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("HATA: DATABASE_URL ortam değişkeni tanımlı değil.")
  process.exit(1)
}
// Render'ın harici (.render.com) adresi SSL ister; dahili adres istemez.
const useSSL = /\.render\.com/.test(connectionString)
const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
})

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ""

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `)
}

const app = express()
app.use(express.json({ limit: "30mb" })) // yüklü görseller data: URL olabilir, limit yüksek

// İçeriği getir (herkese açık — sitenin okuduğu kaynak)
app.get("/api/content", async (_req, res) => {
  try {
    const r = await pool.query("SELECT data, updated_at FROM site_content WHERE id = 1")
    res.json({ content: r.rows[0]?.data ?? null, updatedAt: r.rows[0]?.updated_at ?? null })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// İçeriği kaydet (yalnızca doğru şifreyle)
app.put("/api/content", async (req, res) => {
  if (!ADMIN_PASSWORD || req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "unauthorized" })
  }
  const content = req.body?.content
  if (!content || typeof content !== "object") {
    return res.status(400).json({ error: "invalid content" })
  }
  try {
    await pool.query(
      `INSERT INTO site_content (id, data, updated_at) VALUES (1, $1, now())
       ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = now()`,
      [JSON.stringify(content)]
    )
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// Basit sağlık kontrolü
app.get("/api/health", (_req, res) => res.json({ ok: true }))

// Statik site (Vite build çıktısı) + SPA yönlendirmesi
const dist = path.join(__dirname, "..", "dist")
app.use(express.static(dist))
app.use((_req, res) => res.sendFile(path.join(dist, "index.html")))

const PORT = process.env.PORT || 3001
initDb()
  .then(() => app.listen(PORT, () => console.log(`Sunucu çalışıyor: http://localhost:${PORT}`)))
  .catch((e) => { console.error("DB başlatılamadı:", e); process.exit(1) })
