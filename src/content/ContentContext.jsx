import { createContext, useCallback, useContext, useState } from "react"
import { loadContent, saveContent, resetContent } from "./storage"

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent)
  const [saveError, setSaveError] = useState(null)

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
