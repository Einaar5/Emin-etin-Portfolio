// Sunucu (Postgres) ile içerik alışverişi.
import { ADMIN_PW_KEY } from "../admin/AuthGate"

// İçeriği DB'den getir. Yoksa/başarısızsa null.
export async function fetchServerContent() {
  try {
    const res = await fetch("/api/content", { cache: "no-store" })
    if (!res.ok) return null
    const json = await res.json()
    return json?.content ?? null
  } catch {
    return null
  }
}

// İçeriği DB'ye kaydet. Şifre sessionStorage'dan (girişte saklanır) alınır.
export async function saveServerContent(content) {
  let password = ""
  try { password = sessionStorage.getItem(ADMIN_PW_KEY) || "" } catch { /* yoksay */ }
  const res = await fetch("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-password": password },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    const detail = res.status === 401 ? "Şifre hatalı/eksik" : `Sunucu ${res.status}`
    throw new Error(detail)
  }
  return true
}
