import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import './App.css'
import HeroParallax from './HeroParallax'
import ArcGalleryHero from './Arcgalleryhero'
import ZoomParallax from './Zoomparallax'
import BentoCard from './BentoCard'
import AnimatedFolder from './AnimatedFolder'
import Slider from "./Slider";
import GalleryPage from './GalleryPage'
import VideoEdit from './VideoEdit'

// Web için optimize edilmiş görseller (public/images/opt) — boşluk/Türkçe karakterler encode edilir
const img = (name) => `/images/opt/${encodeURIComponent(name)}`

// Tüm çalışmalar — ürün adı değil, tasarım iş başlıkları kullanıldı
const collections = [
  {
    id: "logo",
    title: "Logo & Marka",
    desc: "Marka kimliği ve logo çalışmaları",
    works: [
      { id: "logo-1", title: "Marka Kimliği 01", image: img("165c7dd7-c5bf-459e-bfb5-e97072556d15.jpg") },
      { id: "logo-2", title: "Marka Kimliği 02", image: img("c163fc0c-ae43-40c3-96dc-f782bcd9dacb.jpg") },
      { id: "logo-3", title: "Marka Kimliği 03", image: img("Screenshot_6.png") },
    ],
  },
  {
    id: "afis",
    title: "Afiş Tasarımları",
    desc: "Tanıtım ve reklam afişleri",
    works: [
      { id: "afis-1", title: "Afiş Tasarımı 01", image: img("adaptör.png") },
      { id: "afis-2", title: "Afiş Tasarımı 02", image: img("kulaklık mcdodo.png") },
      { id: "afis-3", title: "Afiş Tasarımı 03", image: img("şarj kablosu.png") },
      { id: "afis-4", title: "Afiş Tasarımı 04", image: img("1e9dcf07-ec8c-480e-9251-9510bf261dcc.png") },
      { id: "afis-5", title: "Afiş Tasarımı 05", image: img("4b453f16-d42a-49d5-aaf0-40970cf8bf9c.jpg") },
    ],
  },
  {
    id: "banner",
    title: "Banner Çalışmaları",
    desc: "Web banner ve kampanya görselleri",
    works: [
      { id: "banner-1", title: "Web Bannerı 01", image: img("girişsağ 1.png") },
      { id: "banner-2", title: "Web Bannerı 02", image: img("turunculu yeni - Kopya.png") },
      { id: "banner-3", title: "Web Bannerı 03", image: img("s - Kopya.png") },
    ],
  },
  {
    id: "dergi",
    title: "Dergi & Katalog",
    desc: "Katalog kapağı ve dergi sayfa tasarımları",
    works: [
      { id: "dergi-1", title: "Katalog Tasarımı 01", image: img("güneş masa sandalye katolog kapak-1.png") },
      { id: "dergi-2", title: "Katalog Tasarımı 02", image: img("513aace3-fb42-4bb5-8315-336bc9ddde84.jpg") },
      { id: "dergi-3", title: "Katalog Tasarımı 03", image: img("80240309-ab22-460d-bbb0-55d6e755c245.jpg") },
      { id: "dergi-4", title: "Katalog Tasarımı 04", image: img("82b80cf2-80f7-467d-8c68-bdbd3edebace.jpg") },
    ],
  },
  {
    id: "diger",
    title: "Diğer Çalışmalar",
    desc: "Ürün görselleri ve çeşitli tasarımlar",
    works: [
      { id: "diger-1", title: "Ürün Görseli 01", image: img("kompakt lens.png") },
      { id: "diger-2", title: "Ürün Görseli 02", image: img("ekran koruyucu.png") },
      { id: "diger-3", title: "Ürün Görseli 03", image: img("telefon kılıf 1.png") },
      { id: "diger-4", title: "Ürün Görseli 04", image: img("powerbank.png") },
      { id: "diger-5", title: "Ürün Görseli 05", image: img("kulaklık.png") },
      { id: "diger-6", title: "Ürün Görseli 06", image: img("ses bombası.png") },
      { id: "diger-7", title: "Ürün Görseli 07", image: img("806180d4-af03-4969-9479-2edac78b2066.jpg") },
      { id: "diger-8", title: "Ürün Görseli 08", image: img("takiped.png") },
    ],
  },
]

const allWorks = collections.flatMap((c) => c.works)

// HeroParallax kayan kartları (15 adet, jenerik başlıklar)
const products = allWorks.slice(0, 15).map((w, i) => ({
  title: `Çalışma ${String(i + 1).padStart(2, "0")}`,
  link: "#",
  thumbnail: w.image,
}))

// ArcGalleryHero / ZoomParallax görselleri
const images = allWorks.slice(0, 13).map((w) => w.image)

function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => el.classList.add('visible')
    if (typeof IntersectionObserver === 'undefined') { show(); return }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { show(); obs.disconnect() } },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    )
    obs.observe(el)
    // Güvenlik ağı: gözlemci bir sebeple tetiklenmezse bölüm gizli kalmasın
    const fallback = setTimeout(() => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) show()
    }, 1500)
    return () => { obs.disconnect(); clearTimeout(fallback) }
  }, [])
  return ref
}

const SERVICES = [
  { no: '01', title: 'Logo & Marka Kimliği', desc: 'Markanı yansıtan özgün logo ve kurumsal kimlik tasarımı.' },
  { no: '02', title: 'Afiş & Banner', desc: 'Dikkat çeken tanıtım, kampanya ve web banner görselleri.' },
  { no: '03', title: 'Katalog & Dergi', desc: 'Akıcı ve düzenli katalog kapağı ile dergi sayfa tasarımı.' },
  { no: '04', title: 'Sosyal Medya', desc: 'Post, story ve reels için bütünlüklü içerik tasarımı.' },
  { no: '05', title: 'Ambalaj Tasarımı', desc: 'Ürünü rafta öne çıkaran ambalaj ve etiket görselleri.' },
  { no: '06', title: 'Video Düzenleme', desc: 'Kurgu, renk ve efektle akıcı hareketli içerik üretimi.' },
  { no: '07', title: 'Sosyal Medya Yönetimi', desc: 'İçerik planlama, paylaşım takvimi ve hesap büyütme yönetimi.' },
]

export default function App() {
  const [lenis, setLenis] = useState(null)
  const [view, setView] = useState({ page: 'home' }) // 'home' | { page:'gallery', id }
  const [menuOpen, setMenuOpen] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const ringPos = useRef({ x: -100, y: -100, tx: -100, ty: -100 })
  const rafRef = useRef(null)

  const contactRef = useFadeIn()

  /* Lenis */
  useEffect(() => {
    const l = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    setLenis(l)
    let raf
    const tick = time => { l.raf(time); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); l.destroy() }
  }, [])

  /* Cursor */
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t
    const onMove = ({ clientX: x, clientY: y }) => {
      if (dotRef.current) { dotRef.current.style.left = x + 'px'; dotRef.current.style.top = y + 'px' }
      ringPos.current.tx = x; ringPos.current.ty = y
    }
    const tick = () => {
      const r = ringPos.current
      r.x = lerp(r.x, r.tx, 0.1); r.y = lerp(r.y, r.ty, 0.1)
      if (ringRef.current) { ringRef.current.style.left = r.x + 'px'; ringRef.current.style.top = r.y + 'px' }
      rafRef.current = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    tick()
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [])

  /* Görsel indirmeyi zorlaştırma: sağ tık + indirme/devtools kısayolları engellenir */
  useEffect(() => {
    const blockContext = (e) => e.preventDefault()
    const blockDrag = (e) => { if (e.target.tagName === 'IMG') e.preventDefault() }
    const blockKeys = (e) => {
      const k = e.key
      if (
        k === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(k.toUpperCase())) ||
        ((e.ctrlKey || e.metaKey) && ['U', 'S'].includes(k.toUpperCase()))
      ) {
        e.preventDefault()
        return false
      }
    }
    document.addEventListener('contextmenu', blockContext)
    document.addEventListener('dragstart', blockDrag)
    document.addEventListener('keydown', blockKeys)
    return () => {
      document.removeEventListener('contextmenu', blockContext)
      document.removeEventListener('dragstart', blockDrag)
      document.removeEventListener('keydown', blockKeys)
    }
  }, [])

  const openGallery = (id) => setView({ page: 'gallery', id })
  const goHome = () => setView({ page: 'home' })
  const scrollTo = (sel) => {
    goHome()
    setTimeout(() => document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' }), 60)
  }

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />

      <nav className="nav">
        <span className="nav-logo" onClick={() => { goHome(); setMenuOpen(false) }}>Emin Çetin</span>
        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menü"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a onClick={() => { scrollTo('#calismalar'); setMenuOpen(false) }}>Çalışmalar</a>
          <a onClick={() => { scrollTo('#hizmetler'); setMenuOpen(false) }}>Hizmetler</a>
          <a onClick={() => { openGallery(); setMenuOpen(false) }}>Galeri</a>
          <a onClick={() => { scrollTo('#video'); setMenuOpen(false) }}>Video</a>
          <a onClick={() => { scrollTo('#contact'); setMenuOpen(false) }}>İletişim</a>
        </div>
      </nav>

      {view.page === 'gallery' ? (
        <GalleryPage collections={collections} initialId={view.id} onBack={goHome} />
      ) : (
        <>
          <HeroParallax products={products} />

          <Slider />

          <ZoomParallax images={images} />

          <BentoCard />

          {/* Tasarım Portfolyom Alanı */}
          <div id="calismalar" style={{
            minHeight: "100vh",
            background: "#f8fafc",
            color: "#0f172a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            boxSizing: "border-box",
            width: "100%",
          }}>
            <div style={{ width: "100%", maxWidth: "1152px" }}>
              <header style={{ marginBottom: "64px", textAlign: "center" }}>
                <h2 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "12px", letterSpacing: "-0.025em", color: "#0f172a" }}>
                  Tasarım Portfolyom
                </h2>
                <p style={{ color: "#64748b", fontWeight: 500 }}>
                  Klasörlere tıklayarak galeriye göz atabilirsiniz.
                </p>
              </header>

              <div className="portfolio-folders" style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "40px",
                width: "100%",
              }}>
                {collections.map((c) => (
                  <AnimatedFolder
                    key={c.id}
                    title={c.title}
                    projects={c.works}
                    onOpen={() => openGallery(c.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="content-sections">
            <section id="hizmetler" className="services-section">
              <p className="section-eyebrow">Neler Yapıyorum</p>
              <h2 className="section-heading">Hizmet<em>lerim</em></h2>
              <div className="services-grid">
                {SERVICES.map(s => (
                  <div className="service-card" key={s.no}>
                    <span className="service-no">{s.no}</span>
                    <h3 className="service-title">{s.title}</h3>
                    <p className="service-desc">{s.desc}</p>
                    <span className="service-arrow">↗</span>
                  </div>
                ))}
              </div>
            </section>

            <ArcGalleryHero images={images} />

            <div id="video">
              <VideoEdit />
            </div>

            <section id="contact" className="contact-section reveal" ref={contactRef}>
              <h2 className="contact-heading">Birlikte<br /><em>güzel</em> bir şey tasarlayalım</h2>
              <a className="contact-link" href="mailto:emincetin061@gmail.com">emincetin061@gmail.com</a>
            </section>

            <footer className="footer">
              <span className="footer-text">© 2026 Emin Çetin</span>
              <span className="footer-text">Grafik Tasarım</span>
            </footer>
          </div>
        </>
      )}
    </>
  )
}
