import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import './App.css'
import HeroParallax from './HeroParallax'
import ArcGalleryHero from './Arcgalleryhero'
import BentoCard from './BentoCard'
import AnimatedFolder from './AnimatedFolder'
import Slider from "./Slider";
import GalleryPage from './GalleryPage'
import VideoEdit from './VideoEdit'
import { useContent } from './content/ContentContext'
import AuthGate, { AUTH_KEY } from './admin/AuthGate'
import AdminPanel from './admin/AdminPanel'

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

// Üst seviye yönlendirici: #admin ise panel/şifre, değilse site.
export default function App() {
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''))
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(AUTH_KEY) === '1' } catch { return false }
  })

  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (hash === '#admin') {
    return authed ? <AdminPanel /> : <AuthGate onSuccess={() => setAuthed(true)} />
  }
  return <SiteRoot />
}

function SiteRoot() {
  const { content } = useContent()

  // İçerik yüklenene kadar loading göster
  if (!content) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        color: '#64748b',
        fontSize: '1.2rem',
        fontWeight: 500
      }}>
        Yükleniyor...
      </div>
    )
  }

  // İçerikten türetilen veriler
  const collections = content.collections
  const allWorks = collections.flatMap((c) => c.works)
  const defaultFit = content.hero.fit || 'cover'
  // hero.items doluysa onu kullan, boşsa Afiş koleksiyonundan çek
  const heroItems = (content.hero.items && content.hero.items.length > 0)
    ? content.hero.items
    : (collections.find((c) => c.id === 'afis')?.works || allWorks)
        .slice(0, content.hero.count)
        .map((w) => ({ image: w.image, title: w.title, fit: defaultFit }))
  const products = heroItems
    .filter((it) => it && it.image)
    .map((it, i) => ({
      title: it.title || `Çalışma ${String(i + 1).padStart(2, '0')}`,
      link: '#',
      thumbnail: it.image,
      fit: it.fit || defaultFit,
    }))
  
  // Arc galeri görselleri: arc.images doluysa onu kullan, boşsa çalışmalardan
  const arcImages = (content.arc?.images && content.arc.images.length > 0)
    ? content.arc.images
    : allWorks.slice(0, content.zoom.count).map((w) => w.image)

  const SERVICES = content.services

  const [lenis, setLenis] = useState(null)
  const [view, setView] = useState({ page: 'home' }) // 'home' | { page:'gallery', id }
  const [menuOpen, setMenuOpen] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const ringPos = useRef({ x: -100, y: -100, tx: -100, ty: -100 })
  const rafRef = useRef(null)

  const aboutRef = useFadeIn()
  const contactRef = useFadeIn()

  // Browser geri/ileri tuşları için history yönetimi
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state?.view === 'gallery') {
        setView({ page: 'gallery', id: e.state.id })
      } else {
        setView({ page: 'home' })
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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

  const openGallery = (id) => {
    setView({ page: 'gallery', id })
    // History'ye ekle ki geri tuşu çalışsın
    history.pushState({ view: 'gallery', id }, '', window.location.pathname + '#gallery')
  }
  const goHome = () => {
    setView({ page: 'home' })
    // Ana sayfaya dönerken history'yi değiştir
    history.pushState({ view: 'home' }, '', window.location.pathname)
    // Anasayfaya döndüğünde en üste scroll et
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
  }
  const scrollTo = (sel) => {
    if (view.page !== 'home') {
      goHome()
    }
    setTimeout(() => document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' }), 200)
  }

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />

      <nav className="nav">
        <span className="nav-logo" onClick={() => { goHome(); setMenuOpen(false) }}>{content.nav.logo}</span>
        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menü"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a onClick={() => { scrollTo('#hakkimda'); setMenuOpen(false) }}>Hakkımda</a>
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
          <HeroParallax products={products} hero={content.hero} />

          <section id="hakkimda" className="about-section reveal" ref={aboutRef}>
            <div className="about-inner">
              <div className="about-text">
                <p className="section-eyebrow">{content.about.eyebrow}</p>
                <h2 className="section-heading" dangerouslySetInnerHTML={{ __html: content.about.heading }} />
                <p className="about-body">{content.about.body}</p>
                {content.about.stats?.length > 0 && (
                  <div className="about-stats">
                    {content.about.stats.map((s, i) => (
                      <div className="about-stat" key={i}>
                        <span className="about-stat-value">{s.value}</span>
                        <span className="about-stat-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {content.about.image && (
                <div className="about-media">
                  <img src={content.about.image} alt={content.nav.logo} />
                </div>
              )}
            </div>
          </section>

          <Slider />

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
                  {content.portfolio.heading}
                </h2>
                <p style={{ color: "#64748b", fontWeight: 500 }}>
                  {content.portfolio.subtitle}
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

            <ArcGalleryHero 
              images={arcImages}
              heading={content.arc?.heading}
              subtitle={content.arc?.subtitle}
              button1Text={content.arc?.button1Text}
              button2Text={content.arc?.button2Text}
              onButton1Click={() => openGallery()}
              onButton2Click={() => scrollTo('#contact')}
            />

            <div id="video">
              <VideoEdit />
            </div>

            <section id="contact" className="contact-section reveal" ref={contactRef}>
              <h2 className="contact-heading" dangerouslySetInnerHTML={{ __html: content.contact.heading }} />
              <a className="contact-link" href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
            </section>

            <footer className="footer">
              <span className="footer-text">{content.footer.left}</span>
              <span className="footer-text">{content.footer.right}</span>
            </footer>
          </div>
        </>
      )}
    </>
  )
}
