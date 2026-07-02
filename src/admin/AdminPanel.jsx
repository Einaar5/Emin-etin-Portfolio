import { useEffect, useRef, useState } from "react"
import { useContent } from "../content/ContentContext"
import { exportContent, importContent } from "../content/storage"
import { checkApiHealth } from "../content/api"
import { AUTH_KEY, ADMIN_PW_KEY } from "./AuthGate"
import ImageField from "./ImageField"
import LivePreview from "./LivePreview"
import "./admin.css"

const TABS = [
  { id: "live", label: "🖥 Canlı Site" },
  { id: "hero", label: "Vitrin (Header)" },
  { id: "about", label: "Hakkımda" },
  { id: "collections", label: "Koleksiyonlar" },
  { id: "services", label: "Hizmetler" },
  { id: "arc", label: "Arc Galeri" },
  { id: "video", label: "Video" },
  { id: "contact", label: "İletişim & Footer" },
  { id: "general", label: "Genel" },
  { id: "backup", label: "Kaydet / Yedek" },
]

// Diziyi kopyalayıp i. ve j. elemanı taşır.
const move = (arr, i, j) => {
  if (j < 0 || j >= arr.length) return arr
  const copy = arr.slice()
  const [el] = copy.splice(i, 1)
  copy.splice(j, 0, el)
  return copy
}
const uid = (p) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

export default function AdminPanel() {
  const { content, update, reset, replace, publishNow, syncFromServer, dbState, dbError, saveError } = useContent()
  const [tab, setTab] = useState("live")
  const [apiOk, setApiOk] = useState(null) // null: kontrol ediliyor, true/false: sonuç

  // Açılışta API sunucusunun gerçekten ayakta olduğunu doğrula.
  useEffect(() => {
    checkApiHealth().then(setApiOk)
  }, [])

  const dbLabel = { idle: "", saving: "⏳ DB'ye kaydediliyor…", saved: "✓ DB'ye kaydedildi", error: "⚠ DB'ye kaydedilemedi!" }[dbState]

  const exit = async () => {
    // Bekleyen değişiklikler kaybolmasın: çıkmadan önce DB'ye gönder.
    try { await publishNow() } catch { /* kaydedilemese de çıkışa devam */ }
    try {
      sessionStorage.removeItem(AUTH_KEY)
      sessionStorage.removeItem(ADMIN_PW_KEY)
    } catch { /* yoksay */ }
    window.location.hash = ""
    window.location.reload()
  }

  return (
    <div className="adm">
      <div className="adm-top">
        <span className="adm-brand">Yönetim Paneli <span>· {content.nav.logo}</span></span>
        {dbLabel && <span className={`adm-db-state ${dbState}`}>{dbLabel}</span>}
        <div className="adm-top-spacer" />
        <a className="adm-btn" href="#" onClick={() => (window.location.hash = "")}>← Siteyi gör</a>
        <button className="adm-btn danger" onClick={exit}>Çıkış</button>
      </div>

      <div className="adm-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`adm-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="adm-body">
        {apiOk === false && (
          <div className="adm-warn">
            🚫 <strong>API sunucusuna ulaşılamıyor!</strong> Değişiklikler veritabanına KAYDEDİLEMEZ.
            Site büyük ihtimalle "statik site" olarak yayınlanmış. Render'da <strong>Web Service</strong> olarak
            deploy edilmeli: Build Command <code>npm install &amp;&amp; npm run build</code>, Start Command{" "}
            <code>npm start</code>, Environment'a <code>DATABASE_URL</code> ve <code>ADMIN_PASSWORD</code> eklenmeli.
            (Yerelde çalışıyorsan ayrı terminalde <code>npm run server</code> açık olmalı.)
          </div>
        )}
        {dbState === "error" && dbError && (
          <div className="adm-warn">
            ⚠ <strong>Veritabanına kaydedilemedi:</strong> {dbError}
          </div>
        )}
        {saveError && (
          <div className="adm-warn">
            ⚠ Değişiklik tarayıcı hafızasına kaydedilemedi (alan dolmuş olabilir). Çok sayıda büyük
            görsel yüklediyseniz, bazılarını silin veya "Mevcuttan seç" ile public görselleri kullanın.
          </div>
        )}

        {tab === "live" && <LivePreview />}
        {tab === "hero" && <HeroTab content={content} update={update} />}
        {tab === "about" && <AboutTab content={content} update={update} />}
        {tab === "collections" && <CollectionsTab content={content} update={update} />}
        {tab === "services" && <ServicesTab content={content} update={update} />}
        {tab === "arc" && <ArcTab content={content} update={update} />}
        {tab === "video" && <VideoTab content={content} update={update} />}
        {tab === "contact" && <ContactTab content={content} update={update} />}
        {tab === "general" && <GeneralTab content={content} update={update} />}
        {tab === "backup" && <BackupTab content={content} reset={reset} replace={replace} publishNow={publishNow} syncFromServer={syncFromServer} />}
      </div>
    </div>
  )
}

/* ------------------------- Koleksiyonlar ------------------------- */
function CollectionsTab({ content, update }) {
  const setCols = (fn) => update((c) => ({ ...c, collections: fn(c.collections) }))

  const addCollection = () =>
    setCols((cols) => [...cols, { id: uid("col"), title: "Yeni Koleksiyon", desc: "", works: [] }])

  const editCol = (idx, patch) =>
    setCols((cols) => cols.map((c, i) => (i === idx ? { ...c, ...patch } : c)))

  const removeCol = (idx) => {
    if (!confirm("Bu koleksiyonu ve içindeki tüm çalışmaları silmek istiyor musunuz?")) return
    setCols((cols) => cols.filter((_, i) => i !== idx))
  }

  const setWorks = (cIdx, fn) =>
    setCols((cols) => cols.map((c, i) => (i === cIdx ? { ...c, works: fn(c.works) } : c)))

  const addWork = (cIdx) =>
    setWorks(cIdx, (w) => [...w, { id: uid("work"), title: "Yeni Çalışma", image: "" }])
  const editWork = (cIdx, wIdx, patch) =>
    setWorks(cIdx, (w) => w.map((x, i) => (i === wIdx ? { ...x, ...patch } : x)))
  const removeWork = (cIdx, wIdx) => setWorks(cIdx, (w) => w.filter((_, i) => i !== wIdx))

  return (
    <>
      <div className="adm-card-head">
        <h3>Koleksiyonlar</h3>
        <div className="adm-top-spacer" />
        <button className="adm-btn primary" onClick={addCollection}>+ Koleksiyon Ekle</button>
      </div>

      {content.collections.map((col, cIdx) => (
        <div className="adm-card" key={col.id}>
          <div className="adm-card-head">
            <h3>{col.title || "(başlıksız)"}</h3>
            <div className="adm-top-spacer" />
            <div className="adm-actions">
              <button className="adm-btn icon" disabled={cIdx === 0} onClick={() => setCols((c) => move(c, cIdx, cIdx - 1))}>↑</button>
              <button className="adm-btn icon" disabled={cIdx === content.collections.length - 1} onClick={() => setCols((c) => move(c, cIdx, cIdx + 1))}>↓</button>
              <button className="adm-btn danger" onClick={() => removeCol(cIdx)}>Sil</button>
            </div>
          </div>

          <div className="adm-row">
            <div className="adm-field">
              <label>Başlık</label>
              <input className="adm-input" value={col.title} onChange={(e) => editCol(cIdx, { title: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Açıklama</label>
              <input className="adm-input" value={col.desc} onChange={(e) => editCol(cIdx, { desc: e.target.value })} />
            </div>
          </div>

          <p className="adm-hint">{col.works.length} çalışma</p>

          {col.works.map((w, wIdx) => (
            <div className="adm-work" key={w.id}>
              <ImageField value={w.image} onChange={(img) => editWork(cIdx, wIdx, { image: img })} />
              <div className="adm-work-fields">
                <div className="adm-field">
                  <label>Çalışma başlığı</label>
                  <input className="adm-input" value={w.title} onChange={(e) => editWork(cIdx, wIdx, { title: e.target.value })} />
                </div>
                <div className="adm-actions">
                  <button className="adm-btn icon" disabled={wIdx === 0} onClick={() => setWorks(cIdx, (x) => move(x, wIdx, wIdx - 1))}>↑</button>
                  <button className="adm-btn icon" disabled={wIdx === col.works.length - 1} onClick={() => setWorks(cIdx, (x) => move(x, wIdx, wIdx + 1))}>↓</button>
                  <button className="adm-btn danger" onClick={() => removeWork(cIdx, wIdx)}>Sil</button>
                </div>
              </div>
            </div>
          ))}

          <button className="adm-btn" onClick={() => addWork(cIdx)}>+ Çalışma Ekle</button>
        </div>
      ))}
    </>
  )
}

/* ------------------------- Vitrin (Header) ------------------------- */
function HeroTab({ content, update }) {
  const hero = content.hero
  const items = hero.items || []
  const editHero = (patch) => update((c) => ({ ...c, hero: { ...c.hero, ...patch } }))
  const setItems = (fn) => update((c) => ({ ...c, hero: { ...c.hero, items: fn(c.hero.items || []) } }))

  const defaultFit = hero.fit || "cover"
  const allWorks = content.collections.flatMap((c) => c.works)

  const addItem = () =>
    setItems((it) => [...it, { id: uid("hero"), image: "", title: "", fit: defaultFit }])
  const editItem = (idx, patch) =>
    setItems((it) => it.map((x, i) => (i === idx ? { ...x, ...patch } : x)))
  const removeItem = (idx) => setItems((it) => it.filter((_, i) => i !== idx))

  // Çalışmalardan otomatik doldur: ilk N görseli listeye kopyalar.
  const fillFromWorks = () => {
    const n = Math.max(1, parseInt(hero.count, 10) || 15)
    const seeded = allWorks.slice(0, n).map((w) => ({
      id: uid("hero"),
      image: w.image,
      title: w.title || "",
      fit: defaultFit,
    }))
    setItems(() => seeded)
  }
  const clearItems = () => {
    if (confirm("Vitrin görsel listesi temizlenecek. Liste boşken çalışmaların ilk görselleri otomatik kullanılır. Devam edilsin mi?")) {
      setItems(() => [])
    }
  }

  return (
    <>
      <div className="adm-card">
        <h3>Başlık & Slogan</h3>
        <p className="adm-hint" style={{ marginBottom: 12 }}>
          Header'ın ortasındaki büyük yazılar ve altındaki slogan. Slogan olarak "Grafik Tasarım" yazan yer burasıdır.
        </p>
        <div className="adm-row">
          <div className="adm-field">
            <label>Büyük başlık — 1. satır</label>
            <input className="adm-input" value={hero.title1 ?? ""} onChange={(e) => editHero({ title1: e.target.value })} />
          </div>
          <div className="adm-field">
            <label>Büyük başlık — 2. satır</label>
            <input className="adm-input" value={hero.title2 ?? ""} onChange={(e) => editHero({ title2: e.target.value })} />
          </div>
        </div>
        <div className="adm-field">
          <label>Slogan (başlığın altındaki küçük yazı)</label>
          <input className="adm-input" value={hero.slogan ?? ""} onChange={(e) => editHero({ slogan: e.target.value })} />
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>Vitrin Görselleri (kayan kartlar)</h3>
          <div className="adm-top-spacer" />
          <div className="adm-actions">
            <button className="adm-btn" onClick={fillFromWorks}>⤵ Çalışmalardan doldur</button>
            <button className="adm-btn primary" onClick={addItem}>+ Görsel Ekle</button>
          </div>
        </div>

        <p className="adm-hint" style={{ marginBottom: 12 }}>
          Aşağı kaydırınca kayan kartlar bu listeden gelir. Sıralama, sayfada soldan sağa/üstten alta dağılır.
          Liste <strong>boşsa</strong> otomatik olarak çalışmaların ilk görselleri kullanılır — buradan
          hangi görsellerin görüneceğini ve nasıl görüneceğini tam olarak sen belirle.
        </p>

        <div className="adm-field" style={{ maxWidth: 320 }}>
          <label>Varsayılan görüntüleme biçimi</label>
          <select className="adm-input" value={defaultFit} onChange={(e) => editHero({ fit: e.target.value })}>
            <option value="cover">Alanı doldur / kırp (cover)</option>
            <option value="contain">Tamamı görünsün / kırpma (contain)</option>
          </select>
          <p className="adm-hint">Yeni eklenen görseller bu biçimle başlar. Her görselin biçimini ayrıca değiştirebilirsin.</p>
        </div>

        {items.length === 0 && (
          <p className="adm-hint">Liste boş — şu an çalışmaların ilk {hero.count} görseli otomatik gösteriliyor. "Çalışmalardan doldur" ile başlayabilirsin.</p>
        )}

        {items.map((it, idx) => (
          <div className="adm-work" key={it.id || idx}>
            <ImageField value={it.image} onChange={(img) => editItem(idx, { image: img })} />
            <div className="adm-work-fields">
              <div className="adm-field">
                <label>Başlık (kartın üzerinde, opsiyonel)</label>
                <input className="adm-input" value={it.title || ""} onChange={(e) => editItem(idx, { title: e.target.value })} />
              </div>
              <div className="adm-field" style={{ maxWidth: 260 }}>
                <label>Görüntüleme biçimi</label>
                <select className="adm-input" value={it.fit || defaultFit} onChange={(e) => editItem(idx, { fit: e.target.value })}>
                  <option value="cover">Alanı doldur / kırp</option>
                  <option value="contain">Tamamı görünsün / kırpma</option>
                </select>
              </div>
              <div className="adm-actions">
                <button className="adm-btn icon" disabled={idx === 0} onClick={() => setItems((x) => move(x, idx, idx - 1))}>↑</button>
                <button className="adm-btn icon" disabled={idx === items.length - 1} onClick={() => setItems((x) => move(x, idx, idx + 1))}>↓</button>
                <button className="adm-btn danger" onClick={() => removeItem(idx)}>Sil</button>
              </div>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <button className="adm-btn danger" style={{ marginTop: 12 }} onClick={clearItems}>Listeyi temizle (otomatiğe dön)</button>
        )}
      </div>

      <HeroPreview items={items.length > 0 ? items : allWorks.slice(0, Math.max(1, parseInt(hero.count, 10) || 15)).map((w) => ({ image: w.image, title: w.title, fit: defaultFit }))} defaultFit={defaultFit} />
    </>
  )
}

// Sitede nasıl görüneceğine dair birebir (kırpma/sığdırma) önizleme.
function HeroPreview({ items, defaultFit }) {
  const shown = items.filter((it) => it && it.image)
  return (
    <div className="adm-card">
      <h3>Önizleme — sitede nasıl görünecek</h3>
      <p className="adm-hint" style={{ marginBottom: 12 }}>
        Kartların en-boy oranı sitedekiyle aynıdır (geniş dikdörtgen). "Kırp" seçilirse görsel taşan
        kısımdan kesilir; "kırpma" seçilirse görselin tamamı sığdırılır (kenarlarda boşluk olabilir).
      </p>
      {shown.length === 0 ? (
        <p className="adm-hint">Gösterilecek görsel yok.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {shown.map((it, i) => {
            const fit = (it.fit || defaultFit) === "contain" ? "contain" : "cover"
            return (
              <div key={i} style={{
                position: "relative",
                width: 200,
                height: 160, // 30rem x 24rem oranına yakın (5:4)
                borderRadius: 12,
                overflow: "hidden",
                background: fit === "contain" ? "#f1f5f9" : "#0f172a",
                border: "1px solid var(--adm-border, #33415522)",
              }}>
                <img src={it.image} alt="" loading="lazy" style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: fit, objectPosition: fit === "cover" ? "left top" : "center",
                }} />
                <span style={{
                  position: "absolute", top: 6, left: 6,
                  fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                  background: "rgba(0,0,0,.6)", color: "#fff",
                }}>{fit === "contain" ? "Tamamı" : "Kırpılmış"}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ------------------------- Hakkımda ------------------------- */
function AboutTab({ content, update }) {
  const a = content.about
  const edit = (patch) => update((c) => ({ ...c, about: { ...c.about, ...patch } }))
  const setStats = (fn) => update((c) => ({ ...c, about: { ...c.about, stats: fn(c.about.stats || []) } }))
  const editStat = (idx, patch) => setStats((s) => s.map((x, i) => (i === idx ? { ...x, ...patch } : x)))
  const addStat = () => setStats((s) => [...s, { value: "0", label: "Yeni" }])
  const removeStat = (idx) => setStats((s) => s.filter((_, i) => i !== idx))

  return (
    <>
      <div className="adm-card">
        <h3>Hakkımda Bölümü</h3>
        <div className="adm-row">
          <ImageField value={a.image} onChange={(img) => edit({ image: img })} />
          <div className="adm-work-fields">
            <div className="adm-field">
              <label>Üst etiket (eyebrow)</label>
              <input className="adm-input" value={a.eyebrow} onChange={(e) => edit({ eyebrow: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Başlık (&lt;em&gt;...&lt;/em&gt; ile vurgu)</label>
              <input className="adm-input" value={a.heading} onChange={(e) => edit({ heading: e.target.value })} />
            </div>
            <p className="adm-hint">Görsel opsiyonel — boş bırakılırsa metin tam genişlik olur.</p>
          </div>
        </div>
        <div className="adm-field">
          <label>Tanıtım metni</label>
          <textarea className="adm-textarea" style={{ minHeight: 120 }} value={a.body} onChange={(e) => edit({ body: e.target.value })} />
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>İstatistikler</h3>
          <div className="adm-top-spacer" />
          <button className="adm-btn primary" onClick={addStat}>+ Ekle</button>
        </div>
        {(a.stats || []).map((s, idx) => (
          <div className="adm-row" key={idx} style={{ alignItems: "flex-end" }}>
            <div className="adm-field" style={{ maxWidth: 140, flex: "0 0 140px" }}>
              <label>Değer</label>
              <input className="adm-input" value={s.value} onChange={(e) => editStat(idx, { value: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Etiket</label>
              <input className="adm-input" value={s.label} onChange={(e) => editStat(idx, { label: e.target.value })} />
            </div>
            <div className="adm-field" style={{ flex: "0 0 auto" }}>
              <button className="adm-btn danger" onClick={() => removeStat(idx)}>Sil</button>
            </div>
          </div>
        ))}
        {(!a.stats || a.stats.length === 0) && <p className="adm-hint">Henüz istatistik yok.</p>}
      </div>
    </>
  )
}

/* ------------------------- Hizmetler ------------------------- */
function ServicesTab({ content, update }) {
  const setSrv = (fn) => update((c) => ({ ...c, services: fn(c.services) }))
  const edit = (idx, patch) => setSrv((s) => s.map((x, i) => (i === idx ? { ...x, ...patch } : x)))
  const add = () => setSrv((s) => [...s, { no: String(s.length + 1).padStart(2, "0"), title: "Yeni Hizmet", desc: "" }])
  const remove = (idx) => setSrv((s) => s.filter((_, i) => i !== idx))

  return (
    <>
      <div className="adm-card-head">
        <h3>Hizmetler</h3>
        <div className="adm-top-spacer" />
        <button className="adm-btn primary" onClick={add}>+ Hizmet Ekle</button>
      </div>

      {content.services.map((s, idx) => (
        <div className="adm-card" key={idx}>
          <div className="adm-row">
            <div className="adm-field" style={{ maxWidth: 90, flex: "0 0 90px" }}>
              <label>No</label>
              <input className="adm-input" value={s.no} onChange={(e) => edit(idx, { no: e.target.value })} />
            </div>
            <div className="adm-field">
              <label>Başlık</label>
              <input className="adm-input" value={s.title} onChange={(e) => edit(idx, { title: e.target.value })} />
            </div>
          </div>
          <div className="adm-field">
            <label>Açıklama</label>
            <textarea className="adm-textarea" value={s.desc} onChange={(e) => edit(idx, { desc: e.target.value })} />
          </div>
          <div className="adm-actions">
            <button className="adm-btn icon" disabled={idx === 0} onClick={() => setSrv((x) => move(x, idx, idx - 1))}>↑</button>
            <button className="adm-btn icon" disabled={idx === content.services.length - 1} onClick={() => setSrv((x) => move(x, idx, idx + 1))}>↓</button>
            <button className="adm-btn danger" onClick={() => remove(idx)}>Sil</button>
          </div>
        </div>
      ))}
    </>
  )
}

/* ------------------------- Arc Galeri ------------------------- */
function ArcTab({ content, update }) {
  const arc = content.arc || {}
  const images = arc.images || []
  const editArc = (patch) => update((c) => ({ ...c, arc: { ...c.arc, ...patch } }))
  const setImages = (fn) => update((c) => ({ ...c, arc: { ...c.arc, images: fn(c.arc.images || []) } }))

  const allWorks = content.collections.flatMap((c) => c.works)

  const addImage = () => setImages((imgs) => [...imgs, ""])
  const editImage = (idx, val) => setImages((imgs) => imgs.map((img, i) => (i === idx ? val : img)))
  const removeImage = (idx) => setImages((imgs) => imgs.filter((_, i) => i !== idx))

  const fillFromWorks = () => {
    const n = Math.max(1, parseInt(content.zoom?.count, 10) || 13)
    const seeded = allWorks.slice(0, n).map((w) => w.image)
    setImages(() => seeded)
  }

  const clearImages = () => {
    if (confirm("Arc galeri görsel listesi temizlenecek. Liste boşken çalışmaların ilk görselleri otomatik kullanılır. Devam edilsin mi?")) {
      setImages(() => [])
    }
  }

  return (
    <>
      <div className="adm-card">
        <h3>Arc Galeri Metinler</h3>
        <div className="adm-field">
          <label>Başlık</label>
          <input className="adm-input" value={arc.heading || ""} onChange={(e) => editArc({ heading: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Alt başlık</label>
          <textarea className="adm-textarea" value={arc.subtitle || ""} onChange={(e) => editArc({ subtitle: e.target.value })} />
        </div>
        <div className="adm-row">
          <div className="adm-field">
            <label>Buton 1 Metni</label>
            <input className="adm-input" value={arc.button1Text || ""} onChange={(e) => editArc({ button1Text: e.target.value })} />
          </div>
          <div className="adm-field">
            <label>Buton 2 Metni</label>
            <input className="adm-input" value={arc.button2Text || ""} onChange={(e) => editArc({ button2Text: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>Arc Galeri Görselleri</h3>
          <div className="adm-top-spacer" />
          <div className="adm-actions">
            <button className="adm-btn" onClick={fillFromWorks}>⤵ Çalışmalardan doldur</button>
            <button className="adm-btn primary" onClick={addImage}>+ Görsel Ekle</button>
          </div>
        </div>

        <p className="adm-hint" style={{ marginBottom: 12 }}>
          Arc şeklinde görünen görseller bu listeden gelir. Liste <strong>boşsa</strong> otomatik olarak 
          çalışmaların ilk {content.zoom?.count || 13} görseli kullanılır.
        </p>

        {images.length === 0 && (
          <p className="adm-hint">Liste boş — şu an çalışmaların ilk {content.zoom?.count || 13} görseli otomatik gösteriliyor.</p>
        )}

        {images.map((img, idx) => (
          <div className="adm-work" key={idx}>
            <ImageField value={img} onChange={(val) => editImage(idx, val)} />
            <div className="adm-work-fields">
              <div className="adm-actions">
                <button className="adm-btn icon" disabled={idx === 0} onClick={() => setImages((x) => move(x, idx, idx - 1))}>↑</button>
                <button className="adm-btn icon" disabled={idx === images.length - 1} onClick={() => setImages((x) => move(x, idx, idx + 1))}>↓</button>
                <button className="adm-btn danger" onClick={() => removeImage(idx)}>Sil</button>
              </div>
            </div>
          </div>
        ))}

        {images.length > 0 && (
          <button className="adm-btn danger" style={{ marginTop: 12 }} onClick={clearImages}>Listeyi temizle (otomatiğe dön)</button>
        )}
      </div>
    </>
  )
}

/* ------------------------- Video ------------------------- */
function VideoTab({ content, update }) {
  const v = content.video
  const edit = (patch) => update((c) => ({ ...c, video: { ...c.video, ...patch } }))
  return (
    <div className="adm-card">
      <h3>Video Bölümü</h3>
      <div className="adm-field">
        <label>Üst etiket (eyebrow)</label>
        <input className="adm-input" value={v.eyebrow} onChange={(e) => edit({ eyebrow: e.target.value })} />
      </div>
      <div className="adm-field">
        <label>Başlık (vurgu için &lt;em&gt;...&lt;/em&gt; kullanılabilir)</label>
        <input className="adm-input" value={v.heading} onChange={(e) => edit({ heading: e.target.value })} />
      </div>
      <div className="adm-field">
        <label>Açıklama</label>
        <textarea className="adm-textarea" value={v.desc} onChange={(e) => edit({ desc: e.target.value })} />
      </div>
      <div className="adm-field">
        <label>Buton etiketi</label>
        <input className="adm-input" value={v.label} onChange={(e) => edit({ label: e.target.value })} />
      </div>
      <div className="adm-field">
        <label>1. Buton — kanal linki</label>
        <input className="adm-input" value={v.channelUrl} onChange={(e) => edit({ channelUrl: e.target.value })} />
      </div>
      <div className="adm-row">
        <div className="adm-field">
          <label>2. Buton etiketi</label>
          <input className="adm-input" value={v.button2Label ?? ""} onChange={(e) => edit({ button2Label: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>2. Buton linki (URL)</label>
          <input className="adm-input" value={v.button2Url ?? ""} onChange={(e) => edit({ button2Url: e.target.value })} />
        </div>
      </div>
      <p className="adm-hint">2. buton alanları boş bırakılırsa 1. butonun etiketi/linki kullanılır.</p>
      <div className="adm-field">
        <label>Önizleme URL etiketi</label>
        <input className="adm-input" value={v.previewUrl} onChange={(e) => edit({ previewUrl: e.target.value })} />
      </div>
      <div className="adm-field">
        <label>Gömülü oynatıcı (embed) URL</label>
        <input className="adm-input" value={v.embedUrl} onChange={(e) => edit({ embedUrl: e.target.value })} />
        <p className="adm-hint">youtube-nocookie embed linki. Oynatma listesi için ...videoseries?list=UU... biçimi.</p>
      </div>
    </div>
  )
}

/* ------------------------- İletişim & Footer ------------------------- */
function ContactTab({ content, update }) {
  const editContact = (patch) => update((c) => ({ ...c, contact: { ...c.contact, ...patch } }))
  const editFooter = (patch) => update((c) => ({ ...c, footer: { ...c.footer, ...patch } }))
  return (
    <>
      <div className="adm-card">
        <h3>İletişim</h3>
        <div className="adm-field">
          <label>Başlık (&lt;br /&gt; ve &lt;em&gt;...&lt;/em&gt; kullanılabilir)</label>
          <textarea className="adm-textarea" value={content.contact.heading} onChange={(e) => editContact({ heading: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>E-posta</label>
          <input className="adm-input" value={content.contact.email} onChange={(e) => editContact({ email: e.target.value })} />
        </div>
      </div>
      <div className="adm-card">
        <h3>Footer</h3>
        <div className="adm-row">
          <div className="adm-field">
            <label>Sol yazı</label>
            <input className="adm-input" value={content.footer.left} onChange={(e) => editFooter({ left: e.target.value })} />
          </div>
          <div className="adm-field">
            <label>Sağ yazı</label>
            <input className="adm-input" value={content.footer.right} onChange={(e) => editFooter({ right: e.target.value })} />
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------- Genel ------------------------- */
function GeneralTab({ content, update }) {
  const editNav = (patch) => update((c) => ({ ...c, nav: { ...c.nav, ...patch } }))
  const editPortfolio = (patch) => update((c) => ({ ...c, portfolio: { ...c.portfolio, ...patch } }))
  const editNum = (key, val) => update((c) => ({ ...c, [key]: { count: Math.max(1, parseInt(val, 10) || 1) } }))
  return (
    <>
      <div className="adm-card">
        <h3>Site Genel</h3>
        <div className="adm-field">
          <label>Logo / İsim (nav)</label>
          <input className="adm-input" value={content.nav.logo} onChange={(e) => editNav({ logo: e.target.value })} />
        </div>
      </div>
      <div className="adm-card">
        <h3>Portfolyo Bölümü</h3>
        <div className="adm-field">
          <label>Başlık</label>
          <input className="adm-input" value={content.portfolio.heading} onChange={(e) => editPortfolio({ heading: e.target.value })} />
        </div>
        <div className="adm-field">
          <label>Alt başlık</label>
          <input className="adm-input" value={content.portfolio.subtitle} onChange={(e) => editPortfolio({ subtitle: e.target.value })} />
        </div>
      </div>
      <div className="adm-card">
        <h3>Hero & Kayan Görseller</h3>
        <div className="adm-row">
          <div className="adm-field">
            <label>Hero görsel sayısı</label>
            <input className="adm-input" type="number" min="1" value={content.hero.count} onChange={(e) => editNum("hero", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Zoom/Arc görsel sayısı</label>
            <input className="adm-input" type="number" min="1" value={content.zoom.count} onChange={(e) => editNum("zoom", e.target.value)} />
          </div>
        </div>
        <p className="adm-hint">Bu bölümler çalışmaların ilk N görselini kullanır.</p>
      </div>
    </>
  )
}

/* ------------------------- Kaydet / Yedek ------------------------- */
function BackupTab({ content, reset, replace, publishNow, syncFromServer }) {
  const fileRef = useRef(null)
  const [msg, setMsg] = useState(null)

  const onPublish = async () => {
    try {
      await publishNow()
      setMsg({ type: "ok", text: "İçerik veritabanına (DB) kaydedildi. Tüm ziyaretçiler artık bunu görür." })
    } catch (e) {
      setMsg({ type: "err", text: `DB'ye kaydedilemedi: ${e.message}` })
    }
  }

  const onSync = async () => {
    if (!confirm("Veritabanındaki güncel içerik çekilecek ve bu tarayıcıdaki düzenlemeler onunla değiştirilecek. Devam edilsin mi?")) return
    const ok = await syncFromServer()
    setMsg(ok
      ? { type: "ok", text: "Veritabanındaki içerik çekildi." }
      : { type: "err", text: "Veritabanında içerik bulunamadı; varsayılana dönüldü." })
  }

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const next = await importContent(file)
      replace(next)
      setMsg({ type: "ok", text: "İçerik başarıyla yüklendi." })
    } catch {
      setMsg({ type: "err", text: "Dosya okunamadı veya geçersiz JSON." })
    } finally {
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const onReset = () => {
    if (confirm("Tüm değişiklikler silinip varsayılan içeriğe dönülecek. Emin misiniz?")) {
      reset()
      setMsg({ type: "ok", text: "Varsayılan içeriğe dönüldü." })
    }
  }

  return (
    <div className="adm-card">
      <h3>Kaydet / Yedek</h3>
      <p className="adm-hint" style={{ marginBottom: 16 }}>
        Yaptığın değişiklikler <strong>otomatik olarak veritabanına (DB) kaydedilir</strong> ve tüm ziyaretçilere
        anında yansır — dosya indirmene gerek yok. Aşağıdaki butonlar yedekleme/onarım içindir.
      </p>

      {msg && <div className={msg.type === "ok" ? "adm-hint" : "adm-warn"} style={msg.type === "ok" ? { color: "var(--adm-green)" } : undefined}>{msg.text}</div>}

      <div className="adm-actions" style={{ gap: 10, flexWrap: "wrap" }}>
        <button className="adm-btn green" onClick={onPublish}>💾 Şimdi DB'ye Kaydet</button>
        <button className="adm-btn" onClick={onSync}>⟳ DB'den Yenile</button>
        <button className="adm-btn" onClick={() => exportContent(content)}>⬇ JSON Yedek İndir</button>
        <button className="adm-btn" onClick={() => fileRef.current?.click()}>⬆ JSON Yükle</button>
        <button className="adm-btn danger" onClick={onReset}>↺ Varsayılana Sıfırla</button>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={onImport} style={{ display: "none" }} />
      </div>
    </div>
  )
}
