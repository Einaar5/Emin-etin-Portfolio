import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { loadContent, saveContent, resetContent, fetchPublishedContent, loadLocalDraft, deepMerge } from "./storage"
import { DEFAULT_CONTENT } from "./defaultContent"

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent)
  const [saveError, setSaveError] = useState(null)

  // Açılışta yayınlanmış content.json'ı getir (tüm ziyaretçiler için canlı içerik).
  // Öncelik: bu tarayıcıdaki taslak (varsa) > yayınlanmış content.json > varsayılan.
  // Böylece ziyaretçiler content.json'ı görür; admin ise kendi taslağını görmeye devam eder.
  useEffect(() => {
    let cancelled = false
    fetchPublishedContent().then((published) => {
      if (cancelled || !published) return
      const draft = loadLocalDraft()
      const base = deepMerge(DEFAULT_CONTENT, published)
      setContent(draft ? deepMerge(base, draft) : base)
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

  return (
    <ContentContext.Provider value={{ content, update, reset, replace, saveError }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error("useContent must be used within ContentProvider")
  return ctx
}
