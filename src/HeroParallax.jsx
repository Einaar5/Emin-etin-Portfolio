import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

// ==========================================
// 1. BLUR TEXT ANİMASYON BİLEŞENİ
// ==========================================
const BlurText = ({
    text,
    delay = 50,
    animateBy = "words",
    direction = "top",
    className = "",
    style,
}) => {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    const segments = useMemo(() => {
        return animateBy === "words" ? text.split(" ") : text.split("");
    }, [text, animateBy]);

    return (
        <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
            {segments.map((segment, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        filter: inView ? "blur(0px)" : "blur(10px)",
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? "translateY(0)"
                            : `translateY(${direction === "top" ? "-20px" : "20px"})`,
                        transition: `all 0.5s ease-out ${i * delay}ms`,
                    }}
                >
                    {segment}
                    {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
                </span>
            ))}
        </p>
    );
};

// ==========================================
// 2. PARALLAX ÜRÜN KARTI BİLEŞENİ
// ==========================================
const ProductCard = ({ product, translate }) => {
    const [hovered, setHovered] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const fit = product.fit === "contain" ? "contain" : "cover";

    return (
        <motion.div
            style={{
                x: translate,
                position: "relative",
                height: "24rem",
                width: "30rem",
                flexShrink: 0,
            }}
            whileHover={{ y: -20 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "block",
                    height: "100%",
                    width: "100%",
                    borderRadius: "16px",
                    overflow: "hidden",
                    // contain modunda kenarlarda boşluk kalır; hafif zemin şık durur
                    background: fit === "contain" ? "#f1f5f9" : "transparent",
                }}
            >
                {!loaded && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f1f5f9",
                            color: "#64748b",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                        }}
                    >
                        Yükleniyor...
                    </div>
                )}
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: fit,
                        objectPosition: fit === "cover" ? "left top" : "center",
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 0.3s",
                    }}
                />
            </a>

            {/* Hover overlay - Resimlerin üstüne gelindiğinde hep siyahımsı bir katman olması daha şık durur */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "#000",
                    opacity: hovered ? 0.6 : 0,
                    pointerEvents: "none",
                    transition: "opacity 0.3s",
                    borderRadius: "16px",
                }}
            />

            {/* Ürün Adı */}
            <h2
                style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    color: "#fff",
                    margin: 0,
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.3s",
                }}
            >
                {product.title}
            </h2>
        </motion.div>
    );
};

// ==========================================
// 3. ANA BİLEŞEN (BİRLEŞTİRİLMİŞ HERO + PARALLAX)
// ==========================================
export default function HeroParallaxCustom({ products = [], hero = {} }) {
    // Admin'den gelen metinler (yoksa varsayılan)
    const slogan = hero.slogan ?? "Grafik Tasarım";
    const title1 = hero.title1 ?? "EMIN";
    const title2 = hero.title2 ?? "CETIN";

    // Parallax verilerini 3 satıra eşit böl (görsel sayısı değişse de düzgün dağılır)
    const per = Math.ceil(products.length / 3) || 1;
    const firstRow = products.slice(0, per);
    const secondRow = products.slice(per, per * 2);
    const thirdRow = products.slice(per * 2, per * 3);
    const scrollRef = useRef(null);

    // Varsayılan tema FALSE yapıldı (Aydınlık mod / Beyaz arka plan ile başlar)
    const [isDark, setIsDark] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    // Scroll Animasyon Değerleri
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
    const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
    const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
    const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
    const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.1, 1]), springConfig);
    const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
    const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 200]), springConfig);

    // Tema Başlatıcı - Açılışta dark mod class'ını temizliyoruz
    useEffect(() => {
        document.documentElement.classList.remove("dark");
    }, []);

    // Menü Dışına Tıklama Kontrolü
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const menuItems = [
        { label: "HOME", href: "#", highlight: true },
        { label: "ABOUT", href: "#" },
        { label: "PROJECTS", href: "#" },
        { label: "EXPERIENCE", href: "#" },
        { label: "EDUCATION", href: "#" },
        { label: "WRITING", href: "#" },
        { label: "CONTACT", href: "#" },
    ];

    return (
        <div
            className="transition-colors duration-500"
            style={{
                backgroundColor: isDark ? "#000000" : "#ffffff",
                color: isDark ? "#ffffff" : "#000000",
                minHeight: "100vh",
            }}
        >
            {/* ------------------------------------------- */}
            {/* HEADER NAVBAR (Fixed - Animasyonlardan Bağımsız) */}
            {/* ------------------------------------------- */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
                <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">


                    {/* İmza / Logo */}


                    {/* Tema Değiştirici */}

                </nav>
            </header>


            {/* ------------------------------------------- */}
            {/* 300vh KAYDIRMA ALANI (Hero + Parallax Kartları) */}
            {/* ------------------------------------------- */}
            <div
                ref={scrollRef}
                style={{
                    height: "300vh",
                    overflow: "hidden",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                }}
            >
                {/* YENİ HERO ALANI (Alex Kane) - Ekranın tam ortasında */}
                <div className="relative min-h-screen w-full flex flex-col justify-center items-center z-10">
                    <div className="relative text-center w-full px-4">
                        <div>
                            <BlurText
                                text={title1}
                                delay={100}
                                animateBy="letters"
                                direction="top"
                                className="font-bold text-[100px] sm:text-[140px] md:text-[180px] lg:text-[210px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                                style={{ color: "#7DD3FC", fontFamily: "'Fira Code', monospace" }}
                            />
                        </div>
                        <div>
                            <BlurText
                                text={title2}
                                delay={100}
                                animateBy="letters"
                                direction="top"
                                className="font-bold text-[100px] sm:text-[140px] md:text-[180px] lg:text-[210px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                                style={{ color: "#7DD3FC", fontFamily: "'Fira Code', monospace" }}
                            />
                        </div>

                        {/* Profil Resmi ve çerçevesi — istersen aşağıyı yorumdan çıkarıp kendi görselini ekle
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="w-[65px] h-[110px] sm:w-[90px] sm:h-[152px] md:w-[110px] md:h-[185px] lg:w-[129px] lg:h-[218px] rounded-full overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer border-4 border-white">
                                <img
                                    src="BURAYA_GORSEL_LINKI"
                                    alt="Profil"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        */}
                    </div>

                    {/* Slogan */}
                    <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-32 xl:bottom-36 left-1/2 -translate-x-1/2 w-full px-6">
                        <div className="flex justify-center">
                            <BlurText
                                text={slogan}
                                delay={150}
                                animateBy="words"
                                direction="top"
                                className="text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-center transition-colors duration-300 text-neutral-500 hover:text-black dark:hover:text-white"
                                style={{ fontFamily: "'Antic', sans-serif" }}
                            />
                        </div>
                    </div>

                    {/* Aşağı Kaydır İkonu */}
                    <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 transition-colors duration-300">
                        <ChevronDown className="w-5 h-5 md:w-8 md:h-8 text-neutral-500 hover:text-black dark:hover:text-white" />
                    </div>
                </div>

                {/* PARALLAX KARTLARI (Aşağıdan yukarı kayan kısım) */}
                <motion.div style={{ rotateX, rotateZ, translateY, opacity }} className="relative z-0 mt-[-10vh]">
                    {/* Satır 1 — Sağdan sola */}
                    <motion.div style={{ display: "flex", flexDirection: "row-reverse", gap: "5rem", marginBottom: "5rem" }}>
                        {firstRow.map((p) => <ProductCard key={p.title} product={p} translate={translateX} />)}
                    </motion.div>

                    {/* Satır 2 — Soldan sağa */}
                    <motion.div style={{ display: "flex", flexDirection: "row", gap: "5rem", marginBottom: "5rem" }}>
                        {secondRow.map((p) => <ProductCard key={p.title} product={p} translate={translateXReverse} />)}
                    </motion.div>

                    {/* Satır 3 — Sağdan sola */}
                    <motion.div style={{ display: "flex", flexDirection: "row-reverse", gap: "5rem" }}>
                        {thirdRow.map((p) => <ProductCard key={p.title} product={p} translate={translateX} />)}
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
}