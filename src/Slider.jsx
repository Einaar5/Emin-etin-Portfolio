import React, { useEffect, useRef, useState, useCallback } from "react";

const CANVA_SVG = `<svg viewBox="0 0 508 508" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><g transform="matrix(.26718 0 0 .26718 0 0)"><circle cx="950" cy="950" r="950" fill="#7d2ae7"/><circle cx="950" cy="950" r="950" fill="url(#c1)"/><circle cx="950" cy="950" r="950" fill="url(#c2)"/><circle cx="950" cy="950" r="950" fill="url(#c3)"/><circle cx="950" cy="950" r="950" fill="url(#c4)"/></g><path d="M446.744 276.845c-.665 0-1.271.43-1.584 1.33-4.011 11.446-9.43 18.254-13.891 18.254-2.563 0-3.6-2.856-3.6-7.336 0-11.21 6.71-34.982 10.095-45.82.392-1.312.646-2.485.646-3.483 0-3.15-1.722-4.696-5.987-4.696-4.598 0-9.547 1.8-14.36 10.233-1.663-7.435-6.691-10.683-13.715-10.683-8.12 0-15.965 5.224-22.421 13.696-6.456 8.471-14.048 11.25-19.76 9.88 4.108-10.057 5.634-17.57 5.634-23.145 0-8.746-4.324-14.028-11.308-14.028-10.624 0-16.747 10.134-16.747 20.797 0 8.237 3.736 16.708 11.954 20.817-6.887 15.573-16.943 29.66-20.758 29.66-4.93 0-6.379-24.123-6.105-41.38.176-9.9.998-10.408.998-13.401 0-1.722-1.115-2.896-5.595-2.896-10.448 0-13.676 8.844-14.165 18.998a50.052 50.052 0 01-1.8 11.406c-4.363 15.573-13.363 27.39-19.232 27.39-2.72 0-3.463-2.72-3.463-6.28 0-11.21 6.28-25.219 6.28-37.173 0-8.784-3.854-14.34-11.112-14.34-8.55 0-19.858 10.173-30.56 29.229 3.521-14.595 4.97-28.721-5.459-28.721a14.115 14.115 0 00-6.476 1.683 3.689 3.689 0 00-2.113 3.56c.998 15.535-12.521 55.329-25.336 55.329-2.328 0-3.463-2.524-3.463-6.593 0-11.23 6.691-34.943 10.056-45.801.43-1.409.666-2.622.666-3.678 0-2.974-1.84-4.5-6.007-4.5-4.578 0-9.547 1.741-14.34 10.174-1.683-7.435-6.711-10.683-13.735-10.683-11.523 0-24.397 12.19-30.051 28.076-7.572 21.208-22.832 41.692-43.375 41.692-18.645 0-28.486-15.515-28.486-40.03 0-35.392 25.982-64.308 45.253-64.308 9.215 0 13.617 5.869 13.617 14.869 0 10.897-6.085 15.964-6.085 20.112 0 1.272 1.057 2.524 3.15 2.524 8.374 0 18.234-9.841 18.234-23.262 0-13.422-10.897-23.243-30.168-23.243-31.851 0-63.898 32.047-63.898 73.113 0 32.673 16.121 52.374 44 52.374 19.017 0 35.628-14.79 44.588-32.047 1.018 14.302 7.513 21.776 17.413 21.776 8.804 0 15.925-5.243 21.364-14.458 2.094 9.645 7.65 14.36 14.87 14.36 8.275 0 15.201-5.243 21.794-14.986-.097 7.65 1.644 14.85 8.276 14.85 3.13 0 6.867-.725 7.533-3.464 6.984-28.877 24.24-52.453 29.523-52.453 1.565 0 1.995 1.507 1.995 3.287 0 7.846-5.537 23.928-5.537 34.2 0 11.092 4.716 18.43 14.459 18.43 10.8 0 21.775-13.227 29.092-32.556 2.29 18.058 7.24 32.633 14.987 32.633 9.508 0 26.392-20.014 36.625-41.203 4.01.509 10.036.372 15.827-3.717-2.465 6.241-3.912 13.07-3.912 19.897 0 19.663 9.39 25.18 17.47 25.18 8.785 0 15.907-5.243 21.365-14.458 1.8 8.315 6.398 14.34 14.85 14.34 13.225 0 24.71-13.519 24.71-24.612 0-2.934-1.252-4.715-2.72-4.715zm-274.51 18.547c-5.342 0-7.435-5.38-7.435-13.401 0-13.93 9.528-37.193 19.604-37.193 4.402 0 6.065 5.185 6.065 11.524 0 14.145-9.059 39.07-18.235 39.07zm182.948-41.574c-3.189-3.796-4.343-8.961-4.343-13.559 0-5.673 2.074-10.467 4.558-10.467 2.485 0 3.248 2.446 3.248 5.85 0 5.693-2.035 14.008-3.463 18.176zm41.418 41.574c-5.34 0-7.434-6.182-7.434-13.401 0-13.441 9.528-37.193 19.682-37.193 4.402 0 5.967 5.146 5.967 11.524 0 14.145-8.902 39.07-18.215 39.07z" fill="#fff" fill-rule="nonzero"/><defs><radialGradient id="c1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(1469.491) rotate(-49.416 1.37 .302)"><stop offset="0" stop-color="#6420ff"/><stop offset="1" stop-color="#6420ff" stop-opacity="0"/></radialGradient><radialGradient id="c2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(54.703 42.717 594.194) scale(1657.122)"><stop offset="0" stop-color="#00c4cc"/><stop offset="1" stop-color="#00c4cc" stop-opacity="0"/></radialGradient><radialGradient id="c3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1023 -1030 473.711 470.491 367 1684)"><stop offset="0" stop-color="#6420ff"/><stop offset="1" stop-color="#6420ff" stop-opacity="0"/></radialGradient><radialGradient id="c4" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(595.999 1372 -2298.41 998.431 777 256)"><stop offset="0" stop-color="#00c4cc" stop-opacity=".73"/><stop offset="0" stop-color="#00c4cc"/><stop offset="1" stop-color="#00c4cc" stop-opacity="0"/></radialGradient></defs></svg>`;

const LOGOS = [
    { name: "Photoshop", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
    { name: "Illustrator", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },

    { name: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "After Effects", src: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg" },
    { name: "InDesign", src: "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg" },
    { name: "Premiere Pro", src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg" },

    { name: "Sketch", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg" },
    { name: "Canva", svgInline: CANVA_SVG },
];

const ORBIT_COUNTS = [4, 6, 10];
const ORBIT_RADII_RATIOS = [0.22, 0.36, 0.50];

function OrbitIcon({ src, svgInline, name, x, y, size }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                position: "absolute",
                width: size,
                height: size,
                left: x,
                top: y,
                transform: hovered
                    ? "translate(-50%, -50%) scale(1.2)"
                    : "translate(-50%, -50%) scale(1)",
                transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                cursor: "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {svgInline ? (
                <div
                    style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden", display: "block" }}
                    dangerouslySetInnerHTML={{ __html: svgInline }}
                />
            ) : (
                <img
                    src={src}
                    alt={name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px", display: "block" }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
            )}

            {/* Tooltip */}
            <div
                style={{
                    position: "absolute",
                    bottom: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#18181b",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.2s",
                    fontFamily: "'Inter', sans-serif",
                    zIndex: 100,
                }}
            >
                {name}
            </div>
        </div>
    );
}

export default function SemiCircleOrbit() {
    const wrapRef = useRef(null);
    const [icons, setIcons] = useState([]);
    const [wrapSize, setWrapSize] = useState({ w: 0, h: 0 });

    const build = useCallback(() => {
        const container = wrapRef.current?.parentElement;
        if (!container) return;

        const W = Math.min(container.offsetWidth - 48, 640);
        const H = W * 0.62;
        const iconSize = Math.max(32, W * 0.065);
        const cx = W / 2;
        const cy = H;

        const items = [];
        ORBIT_RADII_RATIOS.forEach((ratio, ri) => {
            const r = W * ratio;
            const count = ORBIT_COUNTS[ri];
            for (let i = 0; i < count; i++) {
                const angle = (i / (count - 1)) * 180;
                const rad = (angle * Math.PI) / 180;
                const x = cx + r * Math.cos(rad);
                const y = cy - r * Math.sin(rad);
                const logo = LOGOS[(ri * 4 + i) % LOGOS.length];
                items.push({ key: `${ri}-${i}`, x, y, size: iconSize, ...logo });
            }
        });

        setWrapSize({ w: W, h: H });
        setIcons(items);
    }, []);

    useEffect(() => {
        build();
        window.addEventListener("resize", build);
        return () => window.removeEventListener("resize", build);
    }, [build]);

    return (
        <section
            style={{
                width: "100%",
                padding: "80px 0 64px",
                background: "#fff",
                fontFamily: "'Inter', sans-serif",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* Başlık */}
            <div style={{ maxWidth: "720px", margin: "0 auto 52px", padding: "0 24px", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                    <div style={{ width: "20px", height: "1px", background: "#a1a1aa" }} />
                    <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a1a1aa" }}>
                        Araçlar & Yazılımlar
                    </span>
                    <div style={{ width: "20px", height: "1px", background: "#a1a1aa" }} />
                </div>

                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "#0d0d0b", margin: "0 0 16px" }}>
                    Kullandığım{" "}
                    <span style={{ fontWeight: 300, fontStyle: "italic", color: "#71717a" }}>uygulamalar</span>
                </h2>

                <p style={{ fontSize: "15px", color: "#71717a", lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
                    Logo tasarımından video düzenlemeye, her iş için doğru araç.
                </p>
            </div>

            {/* Orbit */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div ref={wrapRef} style={{ position: "relative", width: wrapSize.w, height: wrapSize.h }}>
                    {icons.map((icon) => (
                        <OrbitIcon
                            key={icon.key}
                            src={icon.src}
                            svgInline={icon.svgInline}
                            name={icon.name}
                            x={icon.x}
                            y={icon.y}
                            size={icon.size}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}