import { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from "react"
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

// Yardımcı Sınıf Birleştirici Fonksiyon
function cn(...classes) {
    return classes.filter(Boolean).join(" ")
}

// ==========================================
// 1. ANA BİLEŞEN: AnimatedFolder
// ==========================================
export function AnimatedFolder({ title, projects = [], className, onOpen }) {
    const [isHovered, setIsHovered] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [sourceRect, setSourceRect] = useState(null)
    const [hiddenCardId, setHiddenCardId] = useState(null)
    const cardRefs = useRef([])

    const handleProjectClick = (project, index) => {
        if (onOpen) { onOpen(); return }
        const cardEl = cardRefs.current[index]
        if (cardEl) {
            setSourceRect(cardEl.getBoundingClientRect())
        }
        setSelectedIndex(index)
        setHiddenCardId(project.id)
    }

    const handleCloseLightbox = () => {
        setSelectedIndex(null)
        setSourceRect(null)
    }

    const handleCloseComplete = () => {
        setHiddenCardId(null)
    }

    const handleNavigate = (newIndex) => {
        setSelectedIndex(newIndex)
        setHiddenCardId(projects[newIndex]?.id || null)
    }

    return (
        <div style={{ width: "340px", flexShrink: 0 }}>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center text-center",
                    "p-10 rounded-2xl cursor-pointer select-none",
                    "bg-white border border-slate-200/80 shadow-sm",
                    "transition-all duration-500 ease-out",
                    "hover:shadow-xl hover:shadow-blue-500/5",
                    "hover:border-blue-500/30",
                    "group",
                    className
                )}
                style={{
                    width: "340px",
                    height: "360px",
                    perspective: "1000px",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => { if (onOpen) onOpen() }}
            >
                {/* Hover durumunda arka plan parlama efekti */}
                <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 75%)",
                        opacity: isHovered ? 1 : 0,
                    }}
                />

                {/* Klasör ve Kartları Saran Kusursuz Merkezlenmiş Alan */}
                <div className="relative flex items-center justify-center mb-6 w-[220px] h-[180px]">

                    {/* Klasör Arka Katmanı */}
                    <div
                        className="absolute w-36 h-24 bg-blue-600 rounded-xl shadow-md"
                        style={{
                            transformOrigin: "bottom center",
                            transform: isHovered ? "rotateX(-15deg)" : "rotateX(0deg)",
                            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                            zIndex: 10,
                        }}
                    />

                    {/* Klasör Kulakçığı (Tab) */}
                    <div
                        className="absolute w-14 h-5 bg-blue-700 rounded-t-lg"
                        style={{
                            top: "22px", // Pozisyon sabitlendi kayma yapmaz
                            left: "56px",
                            transformOrigin: "bottom center",
                            transform: isHovered ? "rotateX(-25deg) translateY(-2px)" : "rotateX(0deg)",
                            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                            zIndex: 10,
                        }}
                    />

                    {/* Proje Kartları (Tam Merkezden Çıkış Noktası) */}
                    <div
                        className="absolute flex items-center justify-center z-20 pointer-events-none"
                        style={{
                            width: "0px",
                            height: "0px",
                        }}
                    >
                        {projects.slice(0, 3).map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                ref={(el) => {
                                    cardRefs.current[index] = el
                                }}
                                image={project.image}
                                title={project.title}
                                delay={index * 80}
                                isVisible={isHovered}
                                index={index}
                                onClick={() => handleProjectClick(project, index)}
                                isSelected={hiddenCardId === project.id}
                            />
                        ))}
                    </div>

                    {/* Klasör Ön Katmanı */}
                    <div
                        className="absolute bottom-6 w-36 h-24 bg-blue-500 rounded-xl shadow-lg"
                        style={{
                            transformOrigin: "bottom center",
                            transform: isHovered ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
                            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                            zIndex: 30,
                        }}
                    />

                    {/* Parlama Efekti */}
                    <div
                        className="absolute bottom-6 w-36 h-24 rounded-xl overflow-hidden pointer-events-none"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
                            transformOrigin: "bottom center",
                            transform: isHovered ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
                            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                            zIndex: 31,
                        }}
                    />
                </div>

                {/* Klasör Başlığı */}
                <h3
                    className="text-xl font-bold text-slate-900 mt-2 transition-all duration-300 select-none"
                    style={{
                        transform: isHovered ? "translateY(4px)" : "translateY(0)",
                    }}
                >
                    {title}
                </h3>

                {/* Proje Sayısı */}
                <p
                    className="text-sm font-medium text-slate-500 mt-1 transition-all duration-300 select-none"
                    style={{
                        opacity: isHovered ? 0.8 : 1,
                    }}
                >
                    {projects.length} çalışma
                </p>

                {/* Küçük İpucu Yazısı */}
                <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 transition-all duration-300 w-full select-none"
                    style={{
                        opacity: isHovered ? 0 : 0.7,
                        transform: isHovered ? "translateY(10px)" : "translateY(0)",
                    }}
                >
                    <span>İncelemek için yaklaşın</span>
                </div>
            </div>

            <ImageLightbox
                projects={projects.slice(0, 3)}
                currentIndex={selectedIndex ?? 0}
                isOpen={selectedIndex !== null}
                onClose={handleCloseLightbox}
                sourceRect={sourceRect}
                onCloseComplete={handleCloseComplete}
                onNavigate={handleNavigate}
            />
        </div>
    )
}

// ==========================================
// 2. YARDIMCI BİLEŞEN: ImageLightbox
// ==========================================
function ImageLightbox({
    projects,
    currentIndex,
    isOpen,
    onClose,
    sourceRect,
    onCloseComplete,
    onNavigate,
}) {
    const [animationPhase, setAnimationPhase] = useState("initial")
    const [isClosing, setIsClosing] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
    const [internalIndex, setInternalIndex] = useState(currentIndex)
    const [prevIndex, setPrevIndex] = useState(currentIndex)
    const [isSliding, setIsSliding] = useState(false)
    const [slideDirection, setSlideDirection] = useState("right")
    const containerRef = useRef(null)

    const totalProjects = projects.length
    const hasNext = internalIndex < totalProjects - 1
    const hasPrev = internalIndex > 0

    const currentProject = projects[internalIndex]

    useEffect(() => {
        if (isOpen && currentIndex !== internalIndex && !isSliding) {
            const direction = currentIndex > internalIndex ? "left" : "right"
            setSlideDirection(direction)
            setPrevIndex(internalIndex)
            setIsSliding(true)

            const timer = setTimeout(() => {
                setInternalIndex(currentIndex)
                setIsSliding(false)
            }, 400)

            return () => clearTimeout(timer)
        }
    }, [currentIndex, isOpen, internalIndex, isSliding])

    useEffect(() => {
        if (isOpen) {
            setInternalIndex(currentIndex)
            setPrevIndex(currentIndex)
            setIsSliding(false)
        }
    }, [isOpen, currentIndex])

    const navigateNext = useCallback(() => {
        if (internalIndex >= totalProjects - 1 || isSliding) return
        onNavigate(internalIndex + 1)
    }, [internalIndex, totalProjects, isSliding, onNavigate])

    const navigatePrev = useCallback(() => {
        if (internalIndex <= 0 || isSliding) return
        onNavigate(internalIndex - 1)
    }, [internalIndex, isSliding, onNavigate])

    const handleClose = useCallback(() => {
        setIsClosing(true)
        onClose()
        setTimeout(() => {
            setIsClosing(false)
            setShouldRender(false)
            setAnimationPhase("initial")
            onCloseComplete?.()
        }, 400)
    }, [onClose, onCloseComplete])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return
            if (e.key === "Escape") handleClose()
            if (e.key === "ArrowRight") navigateNext()
            if (e.key === "ArrowLeft") navigatePrev()
        }

        window.addEventListener("keydown", handleKeyDown)
        if (isOpen) {
            document.body.style.overflow = "hidden"
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = ""
        }
    }, [isOpen, handleClose, navigateNext, navigatePrev])

    useLayoutEffect(() => {
        if (isOpen && sourceRect) {
            setShouldRender(true)
            setAnimationPhase("initial")
            setIsClosing(false)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimationPhase("animating")
                })
            })
            const timer = setTimeout(() => {
                setAnimationPhase("complete")
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [isOpen, sourceRect])

    const handleDotClick = (idx) => {
        if (isSliding || idx === internalIndex) return
        onNavigate(idx)
    }

    if (!shouldRender || !currentProject) return null

    const getInitialStyles = () => {
        if (!sourceRect) return {}

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const targetWidth = Math.min(768, viewportWidth - 64)
        const targetHeight = Math.min(viewportHeight * 0.85, 600)

        const targetX = (viewportWidth - targetWidth) / 2
        const targetY = (viewportHeight - targetHeight) / 2

        const scaleX = sourceRect.width / targetWidth
        const scaleY = sourceRect.height / targetHeight
        const scale = Math.max(scaleX, scaleY)

        const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2)
        const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2)

        return {
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            opacity: 1,
        }
    }

    const getFinalStyles = () => {
        return {
            transform: "translate(0, 0) scale(1)",
            opacity: 1,
        }
    }

    const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles()

    return (
        <div
            className={cn("fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8")}
            onClick={handleClose}
            style={{
                opacity: isClosing ? 0 : 1,
                transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
                style={{
                    opacity: animationPhase === "initial" && !isClosing ? 0 : 1,
                    transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            />

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    handleClose()
                }}
                className={cn(
                    "absolute top-5 right-5 z-50",
                    "w-10 h-10 flex items-center justify-center",
                    "rounded-full bg-white/80 backdrop-blur-md shadow-sm",
                    "border border-slate-200",
                    "text-slate-600 hover:text-slate-900 hover:bg-white",
                    "transition-all duration-300 ease-out hover:scale-105 active:scale-95",
                )}
                style={{
                    opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                    transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-10px)",
                    transition: "opacity 300ms ease-out, transform 300ms ease-out",
                }}
            >
                <X className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    navigatePrev()
                }}
                disabled={!hasPrev || isSliding}
                className={cn(
                    "absolute left-4 md:left-8 z-50",
                    "w-12 h-12 flex items-center justify-center",
                    "rounded-full bg-white/80 backdrop-blur-md shadow-md",
                    "border border-slate-200",
                    "text-slate-600 hover:text-slate-900 hover:bg-white",
                    "transition-all duration-300 ease-out hover:scale-110 active:scale-95",
                    "disabled:opacity-0 disabled:pointer-events-none",
                )}
                style={{
                    opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
                    transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-20px)",
                    transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
                }}
            >
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    navigateNext()
                }}
                disabled={!hasNext || isSliding}
                className={cn(
                    "absolute right-4 md:right-8 z-50",
                    "w-12 h-12 flex items-center justify-center",
                    "rounded-full bg-white/80 backdrop-blur-md shadow-md",
                    "border border-slate-200",
                    "text-slate-600 hover:text-slate-900 hover:bg-white",
                    "transition-all duration-300 ease-out hover:scale-110 active:scale-95",
                    "disabled:opacity-0 disabled:pointer-events-none",
                )}
                style={{
                    opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
                    transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(20px)",
                    transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
                }}
            >
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <div
                ref={containerRef}
                className="relative z-10 w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
                style={{
                    ...currentStyles,
                    transform: isClosing ? "translate(0, 0) scale(0.95)" : currentStyles.transform,
                    transition:
                        animationPhase === "initial" && !isClosing
                            ? "none"
                            : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
                    transformOrigin: "center center",
                }}
            >
                <div
                    className={cn("relative overflow-hidden", "rounded-2xl", "bg-white", "ring-1 ring-slate-200", "shadow-2xl")}
                    style={{
                        borderRadius: animationPhase === "initial" && !isClosing ? "8px" : "16px",
                        transition: "border-radius 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-400 ease-out"
                            style={{
                                transform: `translateX(-${internalIndex * 100}%)`,
                                transition: isSliding ? "transform 400ms cubic-bezier(0.32, 0.72, 0, 1)" : "none",
                            }}
                        >
                            {projects.map((project) => (
                                <img
                                    key={project.id}
                                    src={project.image || "https://via.placeholder.com/600x400"}
                                    alt={project.title}
                                    className="w-full h-auto max-h-[70vh] object-contain bg-slate-50 flex-shrink-0"
                                    style={{ minWidth: "100%" }}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        className={cn("px-6 py-5", "bg-white", "border-t border-slate-100")}
                        style={{
                            opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                            transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 300ms ease-out 100ms, transform 300ms ease-out 100ms",
                        }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-slate-800 tracking-tight truncate h-7">
                                    {currentProject?.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-sm text-slate-500">
                                        Gezinmek için <kbd className="px-1.5 py-0.5 mx-0.5 text-xs font-medium bg-slate-100 rounded border">←</kbd>
                                        <kbd className="px-1.5 py-0.5 mx-0.5 text-xs font-medium bg-slate-100 rounded border">→</kbd> basın
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        {projects.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleDotClick(idx)}
                                                className={cn(
                                                    "w-2 h-2 rounded-full transition-all duration-300",
                                                    idx === internalIndex
                                                        ? "bg-slate-800 scale-110"
                                                        : "bg-slate-300 hover:bg-slate-400",
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2",
                                    "text-sm font-medium text-slate-600",
                                    "bg-slate-50 hover:bg-slate-100",
                                    "rounded-lg border border-slate-200",
                                    "transition-all duration-200 ease-out",
                                    "hover:text-slate-900",
                                )}
                            >
                                <span>Görüntüle</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// 3. YARDIMCI BİLEŞEN: ProjectCard
// ==========================================
export const ProjectCard = forwardRef(
    ({ image, title, delay, isVisible, index, onClick, isSelected }, ref) => {
        const rotations = [-12, 0, 12]
        const translations = [-60, 0, 60]

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute w-22 h-32 rounded-lg overflow-hidden shadow-xl origin-bottom",
                    "bg-white border border-slate-200 pointer-events-auto",
                    "cursor-pointer hover:ring-2 hover:ring-blue-500/50",
                    isSelected && "opacity-0 pointer-events-none",
                )}
                style={{
                    // Sol ve üst asimetrik kaymalar kaldırıldı, transform merkezlendi
                    transform: isVisible
                        ? `translate(-50%, -50%) translateY(-100px) translateX(${translations[index]}px) rotate(${rotations[index]}deg) scale(1)`
                        : `translate(-50%, -50%) translateY(0px) translateX(0px) rotate(0deg) scale(0.5)`,
                    opacity: isSelected ? 0 : isVisible ? 1 : 0,
                    transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
                    zIndex: 10 - index,
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                }}
            >
                <img src={image || "https://via.placeholder.com/150"} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-semibold text-white truncate text-left">
                    {title}
                </p>
            </div>
        )
    },
)

ProjectCard.displayName = "ProjectCard"

export default AnimatedFolder