import { DEFAULT_CONTENT } from "./defaultContent"

export const STORAGE_KEY = "site-content-v1"

const isObject = (v) => v && typeof v === "object" && !Array.isArray(v)

// Derin birleştirme: objeler iç içe birleşir, diziler tamamen değiştirilir.
// Böylece DEFAULT_CONTENT'e yeni alan eklendiğinde eski kayıtta da görünür.
export function deepMerge(base, override) {
  if (Array.isArray(override)) return override.slice()
  if (!isObject(base)) return override
  if (!isObject(override)) return override
  const out = { ...base }
  for (const key of Object.keys(override)) {
    out[key] = key in base ? deepMerge(base[key], override[key]) : override[key]
  }
  return out
}

// Açılışta içeriği yükle: localStorage varsa varsayılanla birleştir, yoksa varsayılan.
export function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredCloneSafe(DEFAULT_CONTENT)
    const parsed = JSON.parse(raw)
    return deepMerge(DEFAULT_CONTENT, parsed)
  } catch {
    return structuredCloneSafe(DEFAULT_CONTENT)
  }
}

// Sadece bu tarayıcıdaki taslağı (localStorage) döndürür. Yoksa null.
export function loadLocalDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Yayınlanmış içeriği (public/content.json) getirir. Yoksa/başarısızsa null.
// Bu dosya tüm ziyaretçiler için ortak (canlı) içeriktir.
export async function fetchPublishedContent() {
  try {
    const base = import.meta.env.BASE_URL || "/"
    const res = await fetch(`${base}content.json`, { cache: "no-store" })
    if (!res.ok) return null
    const parsed = await res.json()
    return isObject(parsed) ? parsed : null
  } catch {
    return null
  }
}

// localStorage'a kaydet. Sınır aşılırsa { ok:false, error } döner.
export function saveContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e }
  }
}

// Kaydı sil, varsayılana dön.
export function resetContent() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* yoksay */
  }
  return structuredCloneSafe(DEFAULT_CONTENT)
}

// content.json olarak indir.
export function exportContent(content) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "content.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Dosyadan içe aktar: JSON parse + temel doğrulama, varsayılanla birleştir.
export function importContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!isObject(parsed)) throw new Error("Geçersiz içerik dosyası")
        resolve(deepMerge(DEFAULT_CONTENT, parsed))
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

function structuredCloneSafe(obj) {
  if (typeof structuredClone === "function") return structuredClone(obj)
  return JSON.parse(JSON.stringify(obj))
}
