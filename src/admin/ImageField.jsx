import { useRef, useState } from "react"
import { AVAILABLE_IMAGES } from "../content/defaultContent"

// Bir görseli yükleyip küçülterek data: URL'e çevirir (localStorage'ı şişirmemek için).
function fileToDownscaledDataUrl(file, maxSize = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)
        // PNG'de şeffaflık varsa korunamaz; JPEG küçük tutar. Şeffaflık önemliyse PNG'yi
        // "mevcuttan seç" ile public'ten kullanmak gerekir.
        resolve(canvas.toDataURL("image/jpeg", quality))
      }
      img.onerror = reject
      img.src = String(reader.result)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export default function ImageField({ value, onChange }) {
  const [tab, setTab] = useState("upload") // 'upload' | 'pick'
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const dataUrl = await fileToDownscaledDataUrl(file)
      onChange(dataUrl)
    } catch {
      alert("Görsel okunamadı.")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="imgf">
      <div className="imgf-preview">
        {value ? <img src={value} alt="önizleme" /> : <span className="imgf-empty">Görsel yok</span>}
      </div>

      <div className="imgf-tabs">
        <button type="button" className={`imgf-tab ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>Yükle</button>
        <button type="button" className={`imgf-tab ${tab === "pick" ? "active" : ""}`} onClick={() => setTab("pick")}>Mevcuttan</button>
      </div>

      {tab === "upload" ? (
        <div className="imgf-file">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          <button
            type="button"
            className="adm-btn primary"
            style={{ width: "100%" }}
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? "İşleniyor…" : "📁 Bilgisayardan seç"}
          </button>
          <p className="adm-hint" style={{ marginTop: 6 }}>JPG / PNG / WEBP</p>
        </div>
      ) : (
        <div className="imgf-grid">
          {AVAILABLE_IMAGES.map((src) => (
            <button
              type="button"
              key={src}
              className={`imgf-thumb ${value === src ? "sel" : ""}`}
              onClick={() => onChange(src)}
              title={decodeURIComponent(src.split("/").pop())}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
