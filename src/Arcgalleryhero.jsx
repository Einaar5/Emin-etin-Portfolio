import React, { useEffect, useState, useRef } from 'react';

export default function ArcGalleryHero({
    images = [],
    heading = "Tasarımla Hikayeni Anlat",
    subtitle = "Logodan afişe, katalogdan banner tasarımına; markanı öne çıkaran özgün görseller üretiyorum.",
    button1Text = "Çalışmaları Gör",
    button2Text = "İletişime Geç",
    onButton1Click = null,
    onButton2Click = null,
    startAngle = 20,
    endAngle = 160,
    radiusLg = 480,
    radiusMd = 360,
    radiusSm = 260,
    cardSizeLg = 120,
    cardSizeMd = 100,
    cardSizeSm = 80,
}) {
    const [dim, setDim] = useState({ radius: radiusLg, cardSize: cardSizeLg });
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef(null);

    // Responsive boyutlar
    useEffect(() => {
        const onResize = () => {
            const w = window.innerWidth;
            if (w < 640) setDim({ radius: radiusSm, cardSize: cardSizeSm });
            else if (w < 1024) setDim({ radius: radiusMd, cardSize: cardSizeMd });
            else setDim({ radius: radiusLg, cardSize: cardSizeLg });
        };
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

    // Görünüme girince animasyonu başlat
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const count = Math.max(images.length, 2);
    const step = (endAngle - startAngle) / (count - 1);

    return (
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#fff',
                color: '#1a1a18',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Arc container */}
            <div style={{
                position: 'relative',
                margin: '0 auto',
                width: '100%',
                height: dim.radius * 1.2,
            }}>
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 0,
                    transform: 'translateX(-50%)',
                }}>
                    {images.map((src, i) => {
                        const angle = startAngle + step * i;
                        const angleRad = (angle * Math.PI) / 180;
                        const x = Math.cos(angleRad) * dim.radius;
                        const y = Math.sin(angleRad) * dim.radius;

                        return (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: dim.cardSize,
                                    height: dim.cardSize,
                                    left: `calc(50% + ${x}px)`,
                                    bottom: `${y}px`,
                                    transform: 'translate(-50%, 50%)',
                                    zIndex: count - i,
                                    // Görünüme girince animasyon, girmeyince gizli
                                    opacity: visible ? undefined : 0,
                                    animation: visible
                                        ? `arcFadeUp 0.8s ease-out ${i * 100}ms forwards`
                                        : 'none',
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                        border: '1px solid #e2e2de',
                                        background: '#fff',
                                        transform: `rotate(${angle / 4}deg)`,
                                        transition: 'transform 0.3s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = `rotate(${angle / 4}deg) scale(1.07)`; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${angle / 4}deg) scale(1)`; }}
                                >
                                    <img
                                        src={src}
                                        alt={`Çalışma ${i + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        draggable={false}
                                        onError={e => { e.target.src = 'https://placehold.co/400x400/e2e2de/6b6b65?text=Image'; }}
                                        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Text content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 1.5rem',
                marginTop: 'clamp(-10rem, -15vw, -16rem)',
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: 640,
                    opacity: visible ? undefined : 0,
                    animation: visible
                        ? 'arcFadeIn 0.8s ease-out 800ms forwards'
                        : 'none',
                }}>
                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1,
                        color: '#0d0d0b',
                        marginBottom: '1rem',
                    }}>
                        {heading}
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                        color: '#6b6b65',
                        lineHeight: 1.7,
                        marginBottom: '2rem',
                    }}>
                        {subtitle}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={onButton1Click}
                            style={{
                                padding: '12px 28px', borderRadius: 999,
                                background: '#0d0d0b', color: '#fff',
                                border: 'none', fontSize: '0.9rem', fontWeight: 600,
                                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.22)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.18)'; }}
                        >
                            {button1Text}
                        </button>
                        <button
                            onClick={onButton2Click}
                            style={{
                                padding: '12px 28px', borderRadius: 999,
                                background: 'transparent', color: '#1a1a18',
                                border: '1.5px solid #e2e2de', fontSize: '0.9rem', fontWeight: 500,
                                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                                transition: 'background 0.2s, border-color 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#f0f0ee'; e.currentTarget.style.borderColor = '#a0a09a'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e2de'; }}
                        >
                            {button2Text}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes arcFadeUp {
          from { opacity: 0; transform: translate(-50%, 60%); }
          to   { opacity: 1; transform: translate(-50%, 50%); }
        }
        @keyframes arcFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
}