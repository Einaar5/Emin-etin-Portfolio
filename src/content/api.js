// Sunucu (Postgres) ile içerik alışverişi.
import { ADMIN_PW_KEY } from "../admin/AuthGate"

// Yanıtın GERÇEKTEN bizim API'den gelen JSON olduğunu doğrula.
// Statik hostlarda /api/* istekleri index.html (200) döndürür — bunu başarı sanmayalım.
async function strictJson(res) {
  const ct = res.headers.get("content-type") || ""
  if (!ct.includes("application/json")) {
    throw new Error("API bulunamadı — sunucu yanıtı JSON değil. Site muhtemelen statik yayınlanmış; Render'da 'Web Service' (npm start) olarak deploy edilmeli.")
  }
  return res.json()
}

// API sunucusu ayakta mı? (admin açılış kontrolü)
export async function checkApiHealth() {
  try {
    const res = await fetch("/api/health", { cache: "no-store" })
    if (!res.ok) return false
    const j = await strictJson(res)
    return j?.ok === true
  } catch {
    return false
  }
}

// İçeriği DB'den getir. Yoksa/başarısızsa null.
export async function fetchServerContent() {
  try {
    const res = await fetch("/api/content", { cache: "no-store" })
    if (!res.ok) return null
    const json = await strictJson(res)
    return json?.content ?? null
  } catch {
    return null
  }
}

// İçeriği DB'ye kaydet. Şifre sessionStorage'dan (girişte saklanır) alınır.
// Başarı ancak sunucu { ok: true } döndürürse kabul edilir.
export async function saveServerContent(content) {
  let password = ""
  try { password = sessionStorage.getItem(ADMIN_PW_KEY) || "" } catch { /* yoksay */ }
  // NOT: keepalive kullanma — tarayıcılar keepalive'lı istek gövdesini 64KB ile
  // sınırlar; data-URL görseller bunu aşınca fetch "Failed to fetch" ile patlar.
  const res = await fetch("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-password": password },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    let detail = `Sunucu hatası (${res.status})`
    if (res.status === 401) detail = "Yazma şifresi hatalı/eksik — çıkıp admin şifresiyle yeniden giriş yapın (sunucudaki ADMIN_PASSWORD ile aynı olmalı)."
    else {
      try { const j = await strictJson(res); if (j?.error) detail += `: ${j.error}` } catch { /* yoksay */ }
    }
    throw new Error(detail)
  }
  const j = await strictJson(res)
  if (j?.ok !== true) throw new Error("Sunucu kaydı doğrulamadı (ok:true dönmedi).")
  return true
}
