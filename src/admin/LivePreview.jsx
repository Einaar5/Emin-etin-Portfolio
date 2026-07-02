import { useEffect, useState } from "react"
import { useContent } from "../content/ContentContext"
import ImageField from "./ImageField"

// Benzersiz id üretici (koleksiyon/çalışma/vitrin öğeleri için)
const uid = (p) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

/* ---------------------------------------------------------------
   Tıkla-düzenle metin. Tek/çok satır ve HTML (em/br) desteği var.
--------------------------------------------------------------- */
function EditableText({ value = "", onSave, multiline = false, html = false, className = "", style, as = "span", placeholder = "(boş)" }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])

  const commit = () => { setEditing(false); if (draft !== value) onSave(draft) }
  const cancel = () => { setDraft(value); setEditing(false) }
  const useTextarea = multiline || html

  if (editing) {
    return useTextarea ? (
      <textarea
        className="lp-input" autoFocus value={draft}
        onChange={(e) => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Escape") cancel() }}
      />
    ) : (
      <input
        className="lp-input" autoFocus value={draft}
        onChange={(e) => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel() }}
      />
    )
  }

  const Tag = as
  const common = { className: `lp-edit ${className}`, style, onClick: () => setEditing(true), title: "Düzenlemek için tıkla" }
  if (html) return <Tag {...common} dangerouslySetInnerHTML={{ __html: value || placeholder }} />
  return <Tag {...common}>{value || placeholder}</Tag>
}

/* ---------------------------------------------------------------
   Görsel seçim modalı (yükle / mevcuttan seç)
--------------------------------------------------------------- */
function ImageModal({ value, onChange, onClose }) {
  return (
    <div className="lp-modal-back" onClick={onClose}>
      <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lp-modal-head">
          <h3>Görsel Seç / Yükle</h3>
          <div className="adm-top-spacer" />
          <button className="adm-btn" onClick={onClose}>Bitti</button>
        </div>
        <ImageField value={value} onChange={onChange} />
        <p className="adm-hint" style={{ marginTop: 10 }}>Seçtiğin görsel anında yansır. Bittiğinde "Bitti"ye bas.</p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------
   Tıkla-değiştir görsel. İsteğe bağlı fit (kırp/tam) düğmesi.
--------------------------------------------------------------- */
function EditableImage({ value, onChange, className = "", style, imgStyle, fit, onFitToggle, alt = "" }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`lp-img ${className}`} style={style}>
      {value
        ? <img src={value} alt={alt} style={imgStyle} />
        : <div style={{ ...imgStyle, display: "flex", alignItems: "center", justifyContent: "center", background: "#e2e2de", color: "#6b6b65", fontSize: 13 }}>Görsel yok</div>}
      {onFitToggle && (
        <button className="lp-img-fit" onClick={onFitToggle} title="Kırpma biçimini değiştir">
          {fit === "contain" ? "Tamamı" : "Kırp"}
        </button>
      )}
      <div className="lp-img-overlay" onClick={() => setOpen(true)}>
        <span className="lp-img-btn">✎ Görseli değiştir</span>
      </div>
      {open && <ImageModal value={value} onChange={onChange} onClose={() => setOpen(false)} />}
    </div>
  )
}

const SectionTag = ({ children }) => <div style={{ textAlign: "center" }}><span className="lp-section-tag">{children}</span></div>

/* ===============================================================
   CANLI SİTE EDİTÖRÜ
=============================================================== */
export default function LivePreview() {
  const { content, update } = useContent()
  const [device, setDevice] = useState("desktop")

  // --- Güncelleyiciler ---
  const setNav = (patch) => update((c) => ({ ...c, nav: { ...c.nav, ...patch } }))
  const setHero = (patch) => update((c) => ({ ...c, hero: { ...c.hero, ...patch } }))
  const setHeroItems = (fn) => update((c) => ({ ...c, hero: { ...c.hero, items: fn(c.hero.items || []) } }))
  const setAbout = (patch) => update((c) => ({ ...c, about: { ...c.about, ...patch } }))
  const setStats = (fn) => update((c) => ({ ...c, about: { ...c.about, stats: fn(c.about.stats || []) } }))
  const setPortfolio = (patch) => update((c) => ({ ...c, portfolio: { ...c.portfolio, ...patch } }))
  const setCols = (fn) => update((c) => ({ ...c, collections: fn(c.collections) }))
  const setServices = (fn) => update((c) => ({ ...c, services: fn(c.services) }))
  const setVideo = (patch) => update((c) => ({ ...c, video: { ...c.video, ...patch } }))
  const setContact = (patch) => update((c) => ({ ...c, contact: { ...c.contact, ...patch } }))
  const setFooter = (patch) => update((c) => ({ ...c, footer: { ...c.footer, ...patch } }))

  const allWorks = content.collections.flatMap((c) => c.works)
  const defaultFit = content.hero.fit || "cover"

  // Vitrin (hero) görselleri: liste boşsa otomatik türetilmiş; doluysa gerçek liste.
  const heroAuto = !(content.hero.items && content.hero.items.length > 0)
  const heroItems = heroAuto
    ? allWorks.slice(0, Math.max(1, parseInt(content.hero.count, 10) || 15)).map((w) => ({ image: w.image, title: w.title, fit: defaultFit }))
    : content.hero.items

  const seedHeroItems = () => {
    setHeroItems(() => heroItems.map((it) => ({ id: uid("hero"), image: it.image, title: it.title || "", fit: it.fit || defaultFit })))
  }
  const editHeroItem = (idx, patch) => setHeroItems((it) => it.map((x, i) => (i === idx ? { ...x, ...patch } : x)))
  const addHeroItem = () => setHeroItems((it) => [...it, { id: uid("hero"), image: "", title: "", fit: defaultFit }])
  const removeHeroItem = (idx) => setHeroItems((it) => it.filter((_, i) => i !== idx))

  return (
    <div>
      <div className="lp-toolbar">
        <strong>Canlı Site</strong>
        <span className="lp-hint">Yazılara ve görsellere tıklayarak doğrudan düzenle — değişiklikler anında kaydedilir.</span>
        <div className="lp-device-btns">
          <button className={`adm-btn ${device === "desktop" ? "primary" : ""}`} onClick={() => setDevice("desktop")}>🖥 Masaüstü</button>
          <button className={`adm-btn ${device === "tablet" ? "primary" : ""}`} onClick={() => setDevice("tablet")}>📱 Tablet</button>
          <button className={`adm-btn ${device === "phone" ? "primary" : ""}`} onClick={() => setDevice("phone")}>📲 Telefon</button>
        </div>
      </div>

      <div className={`lp-canvas ${device}`}>
        {/* ---------- NAV ---------- */}
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 0" }}>
          <div className="nav" style={{ position: "static", transform: "none" }}>
            <EditableText className="nav-logo" value={content.nav.logo} onSave={(v) => setNav({ logo: v })} />
            <div className="nav-links">
              <a>Hakkımda</a><a>Çalışmalar</a><a>Hizmetler</a><a>Galeri</a><a>Video</a><a>İletişim</a>
            </div>
          </div>
        </div>

        {/* ---------- HERO ---------- */}
        <SectionTag>Header · Vitrin</SectionTag>
        <section style={{ padding: "40px 24px 56px", textAlign: "center" }}>
          <EditableText as="div" value={content.hero.title1 ?? ""} onSave={(v) => setHero({ title1: v })}
            style={{ fontFamily: "'Fira Code', monospace", fontWeight: 800, color: "#7DD3FC", fontSize: "clamp(48px,11vw,150px)", lineHeight: 0.85, letterSpacing: "-0.04em", textTransform: "uppercase" }} />
          <EditableText as="div" value={content.hero.title2 ?? ""} onSave={(v) => setHero({ title2: v })}
            style={{ fontFamily: "'Fira Code', monospace", fontWeight: 800, color: "#7DD3FC", fontSize: "clamp(48px,11vw,150px)", lineHeight: 0.85, letterSpacing: "-0.04em", textTransform: "uppercase" }} />
          <EditableText as="div" value={content.hero.slogan ?? ""} onSave={(v) => setHero({ slogan: v })}
            style={{ marginTop: 22, color: "#6b6b65", fontSize: "clamp(15px,2vw,22px)", fontFamily: "'Antic', sans-serif" }} />

          {/* Vitrin görselleri */}
          <div style={{ marginTop: 34 }}>
            <p className="adm-hint" style={{ color: "#6b6b65", marginBottom: 6 }}>
              Aşağı kaydırınca kayan kartlar {heroAuto ? "(şu an otomatik: çalışmaların ilk görselleri)" : "(özel liste)"}
            </p>
            {heroAuto && (
              <button className="lp-mini add" style={{ marginBottom: 12 }} onClick={seedHeroItems}>
                ✎ Bu görselleri özelleştir (listeye al)
              </button>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              {heroItems.map((it, idx) => {
                const fit = (it.fit || defaultFit) === "contain" ? "contain" : "cover"
                return (
                  <div key={it.id || idx} style={{ width: 210 }}>
                    <EditableImage
                      value={it.image}
                      onChange={(img) => (heroAuto ? null : editHeroItem(idx, { image: img }))}
                      className=""
                      style={{ width: "100%", height: 168, borderRadius: 16, overflow: "hidden", background: fit === "contain" ? "#f1f5f9" : "#0f172a", pointerEvents: heroAuto ? "none" : "auto", opacity: heroAuto ? 0.85 : 1 }}
                      imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit, objectPosition: fit === "cover" ? "left top" : "center" }}
                      fit={fit}
                      onFitToggle={heroAuto ? null : () => editHeroItem(idx, { fit: fit === "contain" ? "cover" : "contain" })}
                    />
                    {!heroAuto && (
                      <div className="lp-tools-row">
                        <button className="lp-mini danger" onClick={() => removeHeroItem(idx)}>Sil ×</button>
                      </div>
                    )}
                  </div>
                )
              })}
              {!heroAuto && (
                <button className="lp-mini add" style={{ width: 210, height: 168, borderRadius: 16, fontSize: 15 }} onClick={addHeroItem}>+ Görsel ekle</button>
              )}
            </div>
          </div>
        </section>

        {/* ---------- HAKKIMDA ---------- */}
        <SectionTag>Hakkımda</SectionTag>
        <section className="about-section">
          <div className="about-inner">
            <div className="about-text">
              <EditableText as="p" className="section-eyebrow" value={content.about.eyebrow} onSave={(v) => setAbout({ eyebrow: v })} />
              <EditableText as="h2" className="section-heading" html value={content.about.heading} onSave={(v) => setAbout({ heading: v })} />
              <EditableText as="p" className="about-body" multiline value={content.about.body} onSave={(v) => setAbout({ body: v })} />
              {(content.about.stats || []).length > 0 && (
                <div className="about-stats">
                  {content.about.stats.map((s, i) => (
                    <div className="about-stat" key={i}>
                      <EditableText className="about-stat-value" value={s.value} onSave={(v) => setStats((st) => st.map((x, j) => j === i ? { ...x, value: v } : x))} />
                      <EditableText className="about-stat-label" value={s.label} onSave={(v) => setStats((st) => st.map((x, j) => j === i ? { ...x, label: v } : x))} />
                      <button className="lp-mini danger" onClick={() => setStats((st) => st.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                  <button className="lp-mini add" onClick={() => setStats((st) => [...st, { value: "0", label: "Yeni" }])}>+ istatistik</button>
                </div>
              )}
            </div>
            {content.about.image && (
              <EditableImage
                className="about-media"
                value={content.about.image}
                onChange={(img) => setAbout({ image: img })}
                imgStyle={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
          </div>
        </section>

        {/* ---------- PORTFOLYO / ÇALIŞMALAR ---------- */}
        <SectionTag>Tasarım Portfolyom</SectionTag>
        <section style={{ background: "#f8fafc", padding: "56px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <EditableText as="h2" value={content.portfolio.heading} onSave={(v) => setPortfolio({ heading: v })}
              style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }} />
            <EditableText as="p" value={content.portfolio.subtitle} onSave={(v) => setPortfolio({ subtitle: v })}
              style={{ color: "#64748b", fontWeight: 500, marginTop: 8 }} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
            {content.collections.map((col, cIdx) => (
              <div key={col.id} style={{ width: 300, background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 6px 24px rgba(0,0,0,.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <EditableText value={col.title} onSave={(v) => setCols((cols) => cols.map((c, i) => i === cIdx ? { ...c, title: v } : c))}
                    style={{ fontWeight: 700, color: "#0f172a", flex: 1 }} />
                  <button className="lp-mini danger" title="Koleksiyonu sil" onClick={() => {
                    if (confirm("Bu koleksiyon ve içindeki çalışmalar silinsin mi?")) setCols((cols) => cols.filter((_, i) => i !== cIdx))
                  }}>×</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                  {col.works.map((w, wIdx) => (
                    <div key={w.id}>
                      <EditableImage
                        value={w.image}
                        onChange={(img) => setCols((cols) => cols.map((c, i) => i === cIdx ? { ...c, works: c.works.map((x, j) => j === wIdx ? { ...x, image: img } : x) } : c))}
                        style={{ width: "100%", height: 90, borderRadius: 10, overflow: "hidden", background: "#e2e2de" }}
                        imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <EditableText value={w.title} onSave={(v) => setCols((cols) => cols.map((c, i) => i === cIdx ? { ...c, works: c.works.map((x, j) => j === wIdx ? { ...x, title: v } : x) } : c))}
                          style={{ fontSize: 11, color: "#64748b", flex: 1 }} />
                        <button className="lp-mini danger" style={{ minWidth: 20, height: 20 }} onClick={() => setCols((cols) => cols.map((c, i) => i === cIdx ? { ...c, works: c.works.filter((_, j) => j !== wIdx) } : c))}>×</button>
                      </div>
                    </div>
                  ))}
                  <button className="lp-mini add" style={{ height: 90 }} onClick={() => setCols((cols) => cols.map((c, i) => i === cIdx ? { ...c, works: [...c.works, { id: uid("work"), title: "Yeni Çalışma", image: "" }] } : c))}>+ ekle</button>
                </div>
              </div>
            ))}
            <button className="lp-mini add" style={{ width: 300, minHeight: 120, fontSize: 15 }} onClick={() => setCols((cols) => [...cols, { id: uid("col"), title: "Yeni Koleksiyon", desc: "", works: [] }])}>+ Koleksiyon ekle</button>
          </div>
        </section>

        {/* ---------- HİZMETLER ---------- */}
        <SectionTag>Hizmetler</SectionTag>
        <section className="services-section">
          <p className="section-eyebrow">Neler Yapıyorum</p>
          <h2 className="section-heading">Hizmet<em>lerim</em></h2>
          <div className="services-grid">
            {content.services.map((s, i) => (
              <div className="service-card" key={i}>
                <EditableText className="service-no" value={s.no} onSave={(v) => setServices((sv) => sv.map((x, j) => j === i ? { ...x, no: v } : x))} />
                <EditableText as="h3" className="service-title" value={s.title} onSave={(v) => setServices((sv) => sv.map((x, j) => j === i ? { ...x, title: v } : x))} />
                <EditableText as="p" className="service-desc" multiline value={s.desc} onSave={(v) => setServices((sv) => sv.map((x, j) => j === i ? { ...x, desc: v } : x))} />
                <button className="lp-mini danger" style={{ position: "absolute", top: 12, right: 12 }} onClick={() => setServices((sv) => sv.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
            <button className="lp-mini add" style={{ minHeight: 120, fontSize: 15 }} onClick={() => setServices((sv) => [...sv, { no: String(sv.length + 1).padStart(2, "0"), title: "Yeni Hizmet", desc: "" }])}>+ Hizmet ekle</button>
          </div>
        </section>

        {/* ---------- VIDEO ---------- */}
        <SectionTag>Video</SectionTag>
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
          <EditableText as="p" className="section-eyebrow" value={content.video.eyebrow} onSave={(v) => setVideo({ eyebrow: v })} />
          <EditableText as="h2" className="section-heading" html value={content.video.heading} onSave={(v) => setVideo({ heading: v })} />
          <EditableText as="p" className="about-body" multiline value={content.video.desc} onSave={(v) => setVideo({ desc: v })} />
          <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6b6b65" }}>1. Buton:</span>
            <EditableText value={content.video.label} onSave={(v) => setVideo({ label: v })} style={{ fontWeight: 600 }} />
            <span style={{ fontSize: 13, color: "#6b6b65" }}>· Link:</span>
            <EditableText value={content.video.channelUrl} onSave={(v) => setVideo({ channelUrl: v })} style={{ fontSize: 13, color: "#2f6feb" }} />
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6b6b65" }}>2. Buton:</span>
            <EditableText value={content.video.button2Label ?? ""} onSave={(v) => setVideo({ button2Label: v })} style={{ fontWeight: 600 }} placeholder="(1. butonla aynı)" />
            <span style={{ fontSize: 13, color: "#6b6b65" }}>· Link:</span>
            <EditableText value={content.video.button2Url ?? ""} onSave={(v) => setVideo({ button2Url: v })} style={{ fontSize: 13, color: "#2f6feb" }} placeholder="(1. butonla aynı)" />
          </div>
          <p className="adm-hint" style={{ color: "#94a3b8", marginTop: 8 }}>Gömülü oynatıcı (embed) linkini "Video" sekmesinden değiştirebilirsin.</p>
        </section>

        {/* ---------- İLETİŞİM ---------- */}
        <SectionTag>İletişim</SectionTag>
        <section className="contact-section">
          <EditableText as="h2" className="contact-heading" html value={content.contact.heading} onSave={(v) => setContact({ heading: v })} />
          <EditableText className="contact-link" value={content.contact.email} onSave={(v) => setContact({ email: v })} />
        </section>

        {/* ---------- FOOTER ---------- */}
        <footer className="footer">
          <EditableText className="footer-text" value={content.footer.left} onSave={(v) => setFooter({ left: v })} />
          <EditableText className="footer-text" value={content.footer.right} onSave={(v) => setFooter({ right: v })} />
        </footer>
      </div>
    </div>
  )
}
