import { useState } from "react"
import { useContent } from "./content/ContentContext"

// Video düzenleme bölümü — içerik admin panelden yönetilir (content.video).
export default function VideoEdit() {
  const [hover, setHover] = useState(false)
  const { content } = useContent()
  const v = content.video

  return (
    <section className="ve-section">
      <p className="ve-eyebrow">{v.eyebrow}</p>
      <h2 className="ve-heading" dangerouslySetInnerHTML={{ __html: v.heading }} />
      <p className="ve-desc">{v.desc}</p>

      <div className="ve-buttons">
        <div
          className="ve-link-wrap"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <a
            href={v.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ve-link"
          >
            <span className="ve-yt-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
              </svg>
            </span>
            <span>{v.label}</span>
            <span className="ve-arrow">↗</span>
          </a>

          {/* Hover önizleme: YouTube kanalının videoları */}
          <div className={`ve-preview ${hover ? "open" : ""}`} aria-hidden={!hover}>
            <div className="ve-preview-bar">
              <span className="ve-dot" /><span className="ve-dot" /><span className="ve-dot" />
              <span className="ve-preview-url">{v.previewUrl}</span>
            </div>
            {hover && (
              <iframe
                src={v.embedUrl}
                title={v.label}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* İkinci buton — aynı veriyi (etiket + kanal linki) kullanır */}
        <a
          href={v.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ve-link"
        >
          <span className="ve-yt-icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
            </svg>
          </span>
          <span>{v.label}</span>
          <span className="ve-arrow">↗</span>
        </a>
      </div>

      <style>{`
        .ve-section { max-width: 1200px; margin: 0 auto; padding: 7rem 2rem; border-top: 1px solid #e2e2de; text-align: center; }
        .ve-eyebrow { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #a0a09a; margin-bottom: 1rem; }
        .ve-heading { font-size: clamp(1.8rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; color: #0d0d0b; margin-bottom: 1.25rem; }
        .ve-heading em { font-style: italic; font-weight: 300; color: #a0a09a; }
        .ve-desc { font-size: 1.02rem; color: #6b6b65; max-width: 600px; margin: 0 auto 2.5rem; line-height: 1.6; }
        .ve-buttons { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .ve-link-wrap { position: relative; display: inline-block; }
        .ve-link { display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px; border-radius: 999px; background: #0d0d0b; color: #fff; text-decoration: none; font-weight: 600; font-size: 0.95rem; cursor: none; transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .ve-link:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.22); }
        .ve-yt-icon { display: inline-flex; color: #ff0033; }
        .ve-arrow { font-size: 1.05rem; }
        .ve-preview { position: absolute; left: 50%; bottom: calc(100% + 16px); transform: translateX(-50%) translateY(10px) scale(0.96); transform-origin: bottom center; width: min(440px, 86vw); height: 300px; background: #fff; border: 1px solid #e2e2de; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 70px rgba(0,0,0,0.22); opacity: 0; pointer-events: none; transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1); z-index: 50; }
        .ve-preview.open { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); pointer-events: auto; }
        .ve-preview-bar { display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: #f7f7f5; border-bottom: 1px solid #e2e2de; }
        .ve-dot { width: 9px; height: 9px; border-radius: 50%; background: #d4d4cf; }
        .ve-preview-url { margin-left: 8px; font-size: 0.72rem; color: #6b6b65; font-weight: 500; }
        .ve-preview iframe { width: 100%; height: calc(100% - 39px); border: 0; display: block; background: #000; }
        @media (max-width: 600px) { .ve-preview { height: 240px; } }
      `}</style>
    </section>
  )
}
