import { useEffect, useState, useCallback } from "react"

// Galeri sayfası — folderlara tıklayınca buraya gelinir.
// Site tasarımına dokunmadan, kendi izole stilleriyle çalışır.
export default function GalleryPage({ collections, initialId, onBack }) {
  const [activeId, setActiveId] = useState(initialId || collections[0]?.id)
  const [lightbox, setLightbox] = useState(null)

  const active = collections.find((c) => c.id === activeId) || collections[0]
  const works = active?.works ?? []

  const close = useCallback(() => {
    setLightbox(null)
    // Hash'i temizle ama history'ye ekleme
    if (window.location.hash === '#lightbox') {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  const openLightbox = useCallback((index) => {
    setLightbox(index)
    // Lightbox açıldığında hash ekle (geri tuşu için)
    history.pushState(null, '', '#lightbox')
  }, [])

  const next = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % works.length)),
    [works.length]
  )
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + works.length) % works.length)),
    [works.length]
  )

  useEffect(() => { window.scrollTo(0, 0) }, [activeId])
  useEffect(() => { setActiveId(initialId || collections[0]?.id) }, [initialId, collections])

  // Geri tuşu için popstate event listener
  useEffect(() => {
    const handlePopState = () => {
      if (lightbox !== null) {
        setLightbox(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [lightbox])

  useEffect(() => {
    if (lightbox === null) return
    document.body.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightbox, close, next, prev])

  return (
    <main style={{ minHeight: "100vh", background: "#fff", padding: "8rem 1.5rem 5rem", maxWidth: 1280, margin: "0 auto" }}>
      {/* Üst başlık */}
      <button onClick={onBack} className="gp-back">
        <span style={{ fontSize: "1.1rem" }}>←</span> Anasayfaya dön
      </button>

      <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a0a09a", margin: "1.5rem 0 0.75rem" }}>
        Galeri
      </p>
      <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#0d0d0b", marginBottom: "0.5rem" }}>
        {active?.title}
      </h1>
      <p style={{ color: "#6b6b65", fontSize: "1.02rem", marginBottom: "2rem" }}>
        {active?.desc} · {works.length} çalışma
      </p>

      {/* Kategori sekmeleri */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "2.5rem" }}>
        {collections.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className="gp-chip"
            style={{
              background: c.id === activeId ? "#0d0d0b" : "#fff",
              color: c.id === activeId ? "#fff" : "#1a1a18",
              borderColor: c.id === activeId ? "#0d0d0b" : "#e2e2de",
            }}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Masonry galeri */}
      <div className="gp-grid">
        {works.map((w, i) => (
          <figure key={w.id} className="gp-card" onClick={() => openLightbox(i)} style={{ animationDelay: `${i * 50}ms` }}>
            <img src={w.image} alt={w.title} loading="lazy" />
            <figcaption>
              <span>{w.title}</span>
              <span className="gp-card-zoom">Büyüt ↗</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && works[lightbox] && (
        <div className="gp-lb" onClick={close}>
          <button className="gp-lb-close" onClick={close} aria-label="Kapat">✕</button>
          {works.length > 1 && (
            <>
              <button className="gp-lb-nav gp-lb-prev" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Önceki">‹</button>
              <button className="gp-lb-nav gp-lb-next" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Sonraki">›</button>
            </>
          )}
          <figure className="gp-lb-stage" onClick={(e) => e.stopPropagation()}>
            <img src={works[lightbox].image} alt={works[lightbox].title} />
            <figcaption>
              {works[lightbox].title} <span>{lightbox + 1} / {works.length}</span>
            </figcaption>
          </figure>
        </div>
      )}

      <style>{`
        .gp-back { display:inline-flex; align-items:center; gap:8px; background:#fff; border:1px solid #e2e2de; color:#0d0d0b; font-family:inherit; font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:999px; cursor:none; transition:transform .25s, box-shadow .25s; }
        .gp-back:hover { transform:translateX(-4px); box-shadow:0 8px 40px rgba(0,0,0,.10); }
        .gp-chip { font-family:inherit; font-size:0.85rem; font-weight:600; padding:9px 18px; border-radius:999px; border:1px solid #e2e2de; cursor:none; transition:transform .2s, background .2s, color .2s; }
        .gp-chip:hover { transform:translateY(-2px); }
        .gp-grid { columns: 3 300px; column-gap: 1.25rem; }
        .gp-card { position:relative; break-inside:avoid; margin-bottom:1.25rem; border-radius:16px; overflow:hidden; background:#f0f0ee; cursor:none; box-shadow:0 4px 20px rgba(0,0,0,.06); opacity:0; transform:translateY(20px); animation:gpIn .6s cubic-bezier(.22,1,.36,1) forwards; transition:transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s; }
        .gp-card:hover { transform:translateY(-5px); box-shadow:0 8px 40px rgba(0,0,0,.14); }
        .gp-card img { display:block; width:100%; height:auto; }
        .gp-card figcaption { position:absolute; inset:auto 0 0 0; display:flex; align-items:center; justify-content:space-between; gap:.5rem; padding:1.6rem 1rem .9rem; background:linear-gradient(to top, rgba(0,0,0,.7), transparent); opacity:0; transform:translateY(8px); transition:opacity .3s, transform .3s; font-size:.85rem; font-weight:600; color:#fff; }
        .gp-card:hover figcaption { opacity:1; transform:translateY(0); }
        .gp-card-zoom { color:rgba(255,255,255,.8); white-space:nowrap; }
        @keyframes gpIn { to { opacity:1; transform:translateY(0); } }
        .gp-lb { position:fixed; inset:0; z-index:2000; display:flex; align-items:center; justify-content:center; padding:2rem; background:rgba(13,13,11,.92); backdrop-filter:blur(10px); animation:lbFade .3s ease; }
        @keyframes lbFade { from { opacity:0; } to { opacity:1; } }
        .gp-lb-stage { max-width:92vw; max-height:88vh; display:flex; flex-direction:column; align-items:center; gap:1rem; }
        .gp-lb-stage img { max-width:92vw; max-height:80vh; object-fit:contain; border-radius:10px; box-shadow:0 30px 80px rgba(0,0,0,.5); }
        .gp-lb-stage figcaption { color:#fff; font-size:.9rem; font-weight:500; display:flex; align-items:center; gap:12px; }
        .gp-lb-stage figcaption span { color:rgba(255,255,255,.5); font-size:.82rem; }
        .gp-lb-close { position:fixed; top:22px; right:24px; width:46px; height:46px; border-radius:50%; border:none; background:rgba(255,255,255,.12); color:#fff; font-size:1.1rem; cursor:none; transition:background .2s, transform .2s; }
        .gp-lb-close:hover { background:rgba(255,255,255,.25); transform:rotate(90deg); }
        .gp-lb-nav { position:fixed; top:50%; transform:translateY(-50%); width:54px; height:54px; border-radius:50%; border:none; background:rgba(255,255,255,.12); color:#fff; font-size:1.8rem; line-height:1; cursor:none; transition:background .2s; }
        .gp-lb-nav:hover { background:rgba(255,255,255,.25); }
        .gp-lb-prev { left:24px; } .gp-lb-next { right:24px; }
        @media (max-width:600px){ .gp-lb-nav{ width:44px; height:44px; font-size:1.4rem; } .gp-lb-prev{ left:10px; } .gp-lb-next{ right:10px; } }
      `}</style>
    </main>
  )
}
