import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { loadContent, saveContent, resetContent, deepMerge } from "./storage"
import { fetchServerContent, saveServerContent } from "./api"
import { DEFAULT_CONTENT } from "./defaultContent"

const ContentContext = createContext(null)

const isAdminMode = () => typeof window !== "undefined" && window.location.hash === "#admin"

export function ContentProvider({ children }) {
  // İlk render: hızlı gösterim için yerel önbellek (admin) ya da varsayılan (canlı).
  const [content, setContent] = useState(() => (isAdminMode() ? loadContent() : structuredClone(DEFAULT_CONTENT)))
  const [saveError, setSaveError] = useState(null)
  // DB kayıt durumu: 'idle' | 'saving' | 'saved' | 'error'
  const [dbState, setDbState] = useState("idle")

  const loaded = useRef(false)      // ilk DB yüklemesi tamamlandı mı
  const skipNextSave = useRef(false) // yüklenen içeriği tekrar DB'ye yazma
  const saveTimer = useRef(null)

  // Açılışta içeriği DB'den (Postgres) çek — tek doğruluk kaynağı.
  useEffect(() => {
    let cancelled = false
    fetchServerContent().then((server) => {
      if (cancelled) return
      const base = server ? deepMerge(DEFAULT_CONTENT, server) : structuredClone(DEFAULT_CONTENT)
      skipNextSave.current = true
      setContent(base)
      // yerel önbelleğe de yaz (çevrimdışı/anlık gösterim için)
      saveContent(base)
      loaded.current = true
    })
    return () => { cancelled = true }
  }, [])

  // Admin düzenledikçe içeriği otomatik DB'ye kaydet (debounce).
  useEffect(() => {
    if (!isAdminMode() || !loaded.current) return
    if (skipNextSave.current) { skipNextSave.current = false; return }
    setDbState("saving")
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveServerContent(content)
        .then(() => setDbState("saved"))
        .catch((e) => { setDbState("error"); setSaveError(e) })
    }, 700)
    return () => clearTimeout(saveTimer.current)
  }, [content])

  // İçeriği güncelle + yerel önbelleğe yaz. DB kaydı yukarıdaki efektle olur.
  const update = useCallback((next) => {
    setContent((prev) => {
      const value = typeof next === "function" ? next(prev) : next
      const res = saveContent(value)
      if (!res.ok) setSaveError(res.error)
      return value
    })
  }, [])

  const reset = useCallback(() => {
    const def = resetContent()
    setContent(def)
    setSaveError(null)
  }, [])

  // İçe aktarılan tam içeriği uygula (import sırasında deepMerge yapıldı).
  const replace = useCallback((value) => {
    saveContent(value)
    setContent(value)
  }, [])

  // İçeriği elle hemen DB'ye kaydet (manuel "Kaydet" butonu için).
  const publishNow = useCallback(async () => {
    setDbState("saving")
    try {
      await saveServerContent(content)
      setDbState("saved")
      return true
    } catch (e) {
      setDbState("error"); setSaveError(e)
      throw e
    }
  }, [content])

  // DB'deki güncel içeriği tekrar çek ve yereli onunla değiştir.
  const syncFromServer = useCallback(async () => {
    const server = await fetchServerContent()
    const base = server ? deepMerge(DEFAULT_CONTENT, server) : structuredClone(DEFAULT_CONTENT)
    skipNextSave.current = true
    saveContent(base)
    setContent(base)
    setSaveError(null)
    return !!server
  }, [])

  return (
    <ContentContext.Provider value={{ content, update, reset, replace, publishNow, syncFromServer, dbState, saveError }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error("useContent must be used within ContentProvider")
  return ctx
}
