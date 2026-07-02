import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { loadContent, saveContent, resetContent, fetchPublishedContent, loadLocalDraft, deepMerge } from "./storage"
import { DEFAULT_CONTENT } from "./defaultContent"

const ContentContext = createContext(null)

const isAdminMode = () => typeof window !== "undefined" && window.location.hash === "#admin"

export function ContentProvider({ children }) {
  // Başlangıç: admin isek yerel taslak, değilsek varsayılan (canlıda localStorage'a bakma).
  const [content, setContent] = useState(() => (isAdminMode() ? loadContent() : structuredClone(DEFAULT_CONTENT)))
  const [saveError, setSaveError] = useState(null)

  // Açılışta yayınlanmış content.json'ı getir. Model:
  //  • CANLI SİTE (ziyaretçi)  → yalnızca content.json (DB gibi). localStorage'a BAKMAZ.
  //  • ADMIN (#admin)          → content.json'un üzerine kendi düzenleme taslağını uygular.
  // Böylece canlıda herkes content.json'ı görür; eski yerel taslaklar canlıya karışmaz.
  useEffect(() => {
    let cancelled = false
    fetchPublishedContent().then((published) => {
      if (cancelled) return
      const base = published ? deepMerge(DEFAULT_CONTENT, published) : structuredClone(DEFAULT_CONTENT)
      if (isAdminMode()) {
        const draft = loadLocalDraft()
        setContent(draft ? deepMerge(base, draft) : base)
      } else {
        setContent(base) // canlı: sadece yayınlanmış içerik
      }
    })
    return () => { cancelled = true }
  }, [])

  // İçeriği güncelle + localStorage'a kaydet. Sınır aşılırsa hata sinyali tut.
  const update = useCallback((next) => {
    setContent((prev) => {
      const value = typeof next === "function" ? next(prev) : next
      const res = saveContent(value)
      setSaveError(res.ok ? null : res.error)
      return value
    })
  }, [])

  const reset = useCallback(() => {
    setContent(resetContent())
    setSaveError(null)
  }, [])

  // İçe aktarılan tam içeriği uygula (deepMerge importContent içinde yapıldı).
  const replace = useCallback((value) => {
    const res = saveContent(value)
    setSaveError(res.ok ? null : res.error)
    setContent(value)
  }, [])

  // Yayınlanmış content.json'ı çekip yereli onunla değiştir (eski taslağı siler).
  const syncFromPublished = useCallback(async () => {
    const published = await fetchPublishedContent()
    const base = published ? deepMerge(DEFAULT_CONTENT, published) : structuredClone(DEFAULT_CONTENT)
    saveContent(base)
    setContent(base)
    setSaveError(null)
    return !!published
  }, [])

  return (
    <ContentContext.Provider value={{ content, update, reset, replace, syncFromPublished, saveError }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error("useContent must be used within ContentProvider")
  return ctx
}
