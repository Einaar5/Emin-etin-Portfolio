import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Message01Icon,
  Folder02Icon,
  Add01Icon,
  CircleArrowUpRight02Icon,
  Search01Icon,
  BarChartIcon,
  Tick01Icon,
  Settings02Icon,
  InformationCircleIcon,
  DatabaseIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

const TABS = [
  {
    id: "logo",
    label: "Logo",
    icon: DashboardSquare01Icon,
    header: "Logo Tasarımı",
    description: "Marka kimliğinizi yansıtan özgün logolar.",
  },
  {
    id: "afis",
    label: "Afiş & Banner",
    icon: UserGroupIcon,
    header: "Afiş & Banner",
    description: "Dikkat çekici görsel iletişim tasarımları.",
    badge: "5",
  },
  {
    id: "ambalaj",
    label: "Ambalaj",
    icon: Message01Icon,
    header: "Ambalaj Tasarımı",
    description: "Ürününüzü öne çıkaran paket görselleri.",
    badge: "12",
  },
  {
    id: "kart",
    label: "Kartvizit",
    icon: Folder02Icon,
    header: "Kart Tasarımı",
    description: "Profesyonel kartvizit ve davetiye çalışmaları.",
  },
];

const AUTO_INTERVAL = 2800;

const BentoCard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (userInteracted) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const idx = TABS.findIndex((t) => t.id === prev.id);
        return TABS[(idx + 1) % TABS.length];
      });
    }, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [userInteracted]);

  const handleTabClick = (tab) => {
    setUserInteracted(true);
    setActiveTab(tab);
  };

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "logo": return <OverviewDashboard />;
      case "afis": return <ManagementDashboard />;
      case "ambalaj": return <ThreadsDashboard />;
      case "kart": return <ResourcesDashboard />;
      default: return null;
    }
  }, [activeTab.id]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 560, overflow: "hidden", borderRadius: 28, border: "1px solid #e4e4e7", background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}>
      <div style={{ padding: "20px 24px 16px", position: "relative", zIndex: 10 }}>
        <h2 style={{ fontSize: 10, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px", fontWeight: 500 }}>
          Grafik Tasarım Stüdyosu
        </h2>
        <p style={{ fontSize: 20, color: "#18181b", fontWeight: 500, lineHeight: 1.35, margin: 0, maxWidth: 420, letterSpacing: "-0.01em" }}>
          Markanızı büyütecek profesyonel tasarım hizmetleri tek çatı altında.
        </p>
      </div>

      <div style={{ position: "relative", width: "100%", height: 300, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 64, left: 64, right: 0, bottom: 0, background: "#f4f4f5", borderRadius: "24px 0 0 0", border: "1px solid rgba(228,228,231,0.5)", opacity: 0.8 }} />
        <div style={{ position: "absolute", top: 32, left: 96, right: 0, bottom: 0, background: "#fff", borderRadius: "16px 0 0 0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid #e4e4e7", borderRight: "none", borderBottom: "none", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 20px", borderBottom: "1px solid #f4f4f5", display: "flex", alignItems: "center", position: "relative", background: "rgba(250,250,250,0.8)", backdropFilter: "blur(8px)", borderRadius: "16px 0 0 0" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(161,161,170,0.3)" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(161,161,170,0.3)" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(161,161,170,0.3)" }} />
            </div>
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              <span style={{ fontSize: 9, color: "rgba(161,161,170,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Portfolyo</span>
            </div>
          </div>

          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <div style={{ width: 144, borderRight: "1px solid rgba(228,228,231,0.4)", padding: "8px 8px", paddingTop: 20, display: "flex", flexDirection: "column", gap: 4, background: "rgba(250,250,250,0.3)" }}>
              <LayoutGroup>
                {TABS.map((tab) => {
                  const isActive = activeTab.id === tab.id;
                  return (
                    <button key={tab.id} onClick={() => handleTabClick(tab)} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "7px 8px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: isActive ? "#18181b" : "#a1a1aa", fontSize: 12, fontWeight: 500, width: "100%", textAlign: "left", transition: "color 0.2s" }}>
                      {isActive && (
                        <motion.div layoutId="sidebar-pill" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2, height: 16, borderRadius: 2, background: "#18181b", zIndex: 30 }} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                      )}
                      {isActive && (
                        <motion.div layoutId="backgroundIndicator" style={{ position: "absolute", inset: 0, borderRadius: 8, background: "#f4f4f5", border: "1px solid rgba(228,228,231,0.6)" }} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                      )}
                      <HugeiconsIcon icon={tab.icon} size={14} style={{ position: "relative", zIndex: 20, flexShrink: 0 }} />
                      <span style={{ position: "relative", zIndex: 20, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{tab.label}</span>
                      {tab.badge && (
                        <span style={{ position: "relative", zIndex: 20, marginLeft: "auto", fontSize: 8, lineHeight: 1, padding: "2px 4px", borderRadius: 4, background: isActive ? "rgba(24,24,27,0.08)" : "#f4f4f5", color: isActive ? "#18181b" : "#a1a1aa", border: isActive ? "1px solid rgba(24,24,27,0.15)" : "1px solid transparent" }}>{tab.badge}</span>
                      )}
                    </button>
                  );
                })}
              </LayoutGroup>

              {!userInteracted && (
                <div style={{ marginTop: 8, marginLeft: 4, marginRight: 4 }}>
                  <div style={{ height: 2, background: "#e4e4e7", borderRadius: 2, overflow: "hidden" }}>
                    <motion.div key={activeTab.id} style={{ height: "100%", background: "#a1a1aa", borderRadius: 2 }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: AUTO_INTERVAL / 1000, ease: "linear" }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ flex: 1, background: "#fff", padding: "20px 20px", paddingTop: 22, display: "flex", flexDirection: "column", gap: 14, overflow: "hidden", position: "relative" }}>
              <header style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <h3 style={{ fontSize: 10, fontWeight: 600, color: "#18181b", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.5, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeTab.header}</h3>
                <p style={{ fontSize: 10, color: "#a1a1aa", margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeTab.description}</p>
              </header>

              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={activeTab.id} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} style={{ flex: 1 }}>
                  {content}
                </motion.div>
              </AnimatePresence>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(to top, #fff, transparent)", pointerEvents: "none", zIndex: 20 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────
   SOL YAZI BÖLÜMÜ
───────────────────────────────────── */
const LeftText = () => {
  const highlights = ["Marka Kimliği", "Ambalaj", "Baskı & Dijital"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 400 }}>
      {/* Üst etiket */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#18181b" }} />
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 500,
          color: "#71717a",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          Tasarım Stüdyosu
        </span>
      </div>

      {/* Ana başlık */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 42,
          fontWeight: 300,
          color: "#18181b",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          margin: 0,
        }}>
          Görsel{" "}
          <span style={{ fontWeight: 600 }}>dil</span>
          <br />
          marka{" "}
          <span style={{
            fontWeight: 600,
            position: "relative",
            display: "inline-block",
          }}>
            kimliği
            <svg
              viewBox="0 0 120 8"
              style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 6, overflow: "visible" }}
              preserveAspectRatio="none"
            >
              <path d="M2,5 Q30,1 60,5 Q90,9 118,4" stroke="#18181b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <br />
          ile başlar.
        </h1>
      </div>

      {/* Açıklama paragrafı */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        fontWeight: 400,
        color: "#71717a",
        lineHeight: 1.75,
        margin: 0,
        maxWidth: 340,
      }}>
        Her tasarım, markanızın özünü yansıtacak biçimde sıfırdan kurgulanır.
        Logonuzdan ambalajınıza, kartvizitinizden dijital materyallerinize —
        tutarlı ve güçlü bir görsel dil inşa ediyoruz.
      </p>

      {/* Özellik etiketleri */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {highlights.map((label, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: "#18181b",
              padding: "5px 12px",
              borderRadius: 20,
              border: "1px solid #e4e4e7",
              background: i === 0 ? "#18181b" : "#fff",
              color: i === 0 ? "#fff" : "#18181b",
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Ayırıcı çizgi + istatistik */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, paddingTop: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 300, color: "#18181b", letterSpacing: "-0.03em" }}>
            500<span style={{ fontWeight: 600 }}>+</span>
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
            Tamamlanan proje
          </span>
        </div>
        <div style={{ width: 1, height: 40, background: "#e4e4e7" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 300, color: "#18181b", letterSpacing: "-0.03em" }}>
            8<span style={{ fontWeight: 600 }}>yıl</span>
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
            Sektör deneyimi
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────
   ANA SECTION
───────────────────────────────────── */
const DesignSection = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      .design-section * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      .design-section button { font-family: 'Inter', sans-serif; }
    `}</style>

    <section
      className="design-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        padding: "80px 48px",
        width: "100%",
        background: "#fff",
        WebkitFontSmoothing: "antialiased",
        flexWrap: "wrap",
      }}
    >
      <LeftText />
      <BentoCard />
    </section>
  </>
);

export default DesignSection;

/* ─────────────────────────────────────
   PANEL: Logo Tasarımı
───────────────────────────────────── */
const OverviewDashboard = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
    <div style={{ position: "relative", padding: 14, borderRadius: 12, border: "1px solid rgba(228,228,231,0.5)", background: "linear-gradient(135deg, #fff 0%, #fafafa 100%)", overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, fontWeight: 500, color: "#a1a1aa" }}>Tamamlanan Projeler</span>
          <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={12} style={{ color: "#71717a" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", color: "#18181b" }}>128 Logo</span>
          <div style={{ width: "100%", height: 4, background: "#f4f4f5", borderRadius: 4, overflow: "hidden", marginTop: 4 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: "100%", background: "#18181b", borderRadius: 4 }} />
          </div>
        </div>
        <span style={{ fontSize: 9, color: "#a1a1aa" }}>Kurumsal ve bireysel marka kimliği çalışmaları</span>
      </div>
      <div style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.04, transform: "scale(1.5) rotate(12deg)" }}>
        <HugeiconsIcon icon={BarChartIcon} size={64} />
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {[
        { label: "SVG / AI / EPS", sub: "Vektörel Format", icon: Search01Icon },
        { label: "5 Gün", sub: "Teslimat Süresi", icon: InformationCircleIcon },
      ].map((item, i) => (
        <div key={i} style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(228,228,231,0.5)", background: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#18181b" }}>{item.label}</div>
            <div style={{ fontSize: 8, color: "#a1a1aa", textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.06em" }}>{item.sub}</div>
          </div>
          <HugeiconsIcon icon={item.icon} size={14} style={{ opacity: 0.2 }} />
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────
   PANEL: Afiş & Banner
───────────────────────────────────── */
const ManagementDashboard = () => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ borderRadius: 12, border: "1px solid rgba(228,228,231,0.5)", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", background: "rgba(255,255,255,0.5)" }}>
      <div style={{ background: "rgba(244,244,245,0.4)", padding: "8px 12px", borderBottom: "1px solid rgba(228,228,231,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Aktif Çalışmalar</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 6, background: "#fff", border: "1px solid rgba(228,228,231,0.5)" }}>
          <HugeiconsIcon icon={Search01Icon} size={10} style={{ color: "rgba(161,161,170,0.6)" }} />
          <span style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 500 }}>Ara</span>
        </div>
      </div>
      <div style={{ padding: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {[
          { name: "Bahar Konseri Afişi", role: "210×297 mm — Baskı hazır", dotColor: "#34d399" },
          { name: "Fuar Standı Posteri", role: "B1 format — Revizyon bekleniyor", dotColor: "#fbbf24" },
          { name: "Sosyal Medya Seti", role: "9 farklı boyut — Hazırlanıyor", dotColor: "#38bdf8" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px", borderRadius: 8, transition: "background 0.15s", cursor: "default" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(244,244,245,0.4)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f4f4f5", border: "1px solid rgba(228,228,231,0.5)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
              <HugeiconsIcon icon={UserIcon} size={10} style={{ color: "#a1a1aa" }} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: item.dotColor, border: "1.5px solid #fff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: "#18181b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
              <span style={{ fontSize: 8, color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────
   PANEL: Ambalaj
───────────────────────────────────── */
const ThreadsDashboard = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        { title: "Kutu Tasarımı", desc: "Dieline + baskı dosyası." },
        { title: "Etiket Tasarımı", desc: "Ürün ambalaj etiketi." },
      ].map((card, i) => (
        <div key={i} style={{ padding: 14, borderRadius: 12, border: "1px solid rgba(228,228,231,0.5)", background: "rgba(255,255,255,0.5)", display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, position: "relative", zIndex: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#18181b", lineHeight: 1.3 }}>{card.title}</span>
            <span style={{ fontSize: 9, color: "#a1a1aa", lineHeight: 1.3 }}>{card.desc}</span>
          </div>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, background: "#18181b", color: "#fff", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer", position: "relative", zIndex: 10 }}>
            <HugeiconsIcon icon={Add01Icon} size={8} strokeWidth={3} />
            Sipariş Ver
          </button>
        </div>
      ))}
    </div>
    <div style={{ marginTop: "auto", padding: 12, borderRadius: 12, background: "rgba(244,244,245,0.3)", border: "1px solid rgba(228,228,231,0.4)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ padding: "4px 6px", borderRadius: 6, background: "#fff", border: "1px solid rgba(228,228,231,0.5)" }}>
          <HugeiconsIcon icon={InformationCircleIcon} size={10} style={{ color: "#a1a1aa" }} />
        </div>
        <span style={{ fontSize: 9, color: "#a1a1aa", fontWeight: 500 }}>Yeni ambalaj projesi başlat</span>
      </div>
      <HugeiconsIcon icon={Add01Icon} size={12} style={{ color: "rgba(161,161,170,0.5)" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────
   PANEL: Kartvizit
───────────────────────────────────── */
const ResourcesDashboard = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", overflow: "hidden" }}>
    <div style={{ flex: 1, borderRadius: 12, border: "1px solid rgba(228,228,231,0.5)", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.5)", overflow: "hidden" }}>
      <div style={{ background: "rgba(244,244,245,0.4)", padding: "8px 12px", borderBottom: "1px solid rgba(228,228,231,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Kart Şablonları</span>
        <HugeiconsIcon icon={DatabaseIcon} size={12} style={{ color: "rgba(161,161,170,0.4)" }} />
      </div>
      <div style={{ flex: 1, padding: 4, overflowY: "auto" }}>
        {[
          { file: "minimal_kartvizit.pdf", size: "1.2 MB", type: "PDF", icon: Mail01Icon },
          { file: "kurumsal_davetiye.ai", size: "3.8 MB", type: "AI", icon: BarChartIcon },
          { file: "lüks_kart_gold.indd", size: "12 MB", type: "INDD", icon: Folder02Icon },
          { file: "sosyal_kart_seti.zip", size: "22 MB", type: "ZIP", icon: Folder02Icon },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(244,244,245,0.4)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(244,244,245,0.6)", border: "1px solid rgba(228,228,231,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(161,161,170,0.7)", flexShrink: 0 }}>
              <HugeiconsIcon icon={item.icon} size={12} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: "#18181b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.file}</span>
              <span style={{ fontSize: 8, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.size} · {item.type}</span>
            </div>
            <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={10} style={{ color: "#a1a1aa", opacity: 0, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);