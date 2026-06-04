import React, { useEffect, useRef, useState } from "react";

export function InfiniteSlider({
  children,
  gap = 24,
  speed = 40,
  reverse = false,
  speedOnHover,
  className = "",
}) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const containerRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(0);

  // 82. satırdaki meşhur "cssRules" hatasını çözen ve tüm CSS'leri güvenle tarayan mantık
  useEffect(() => {
    let isMounted = true;

    // Tarayıcıdaki tüm stil sayfalarını güvenli bir şekilde tara
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      let rules = [];

      try {
        // Reklam engelleyici veya çeviri eklentilerinin CSS dosyası ise burası hata fırlatır
        rules = sheet.cssRules || sheet.rules;
      } catch (e) {
        // Güvenlik engeline takılan yabancı CSS'leri sessizce pas geç, yerel kodları okumaya devam et
        continue;
      }
    }

    if (containerRef.current) {
      const childrenElements = containerRef.current.children;
      let width = 0;
      for (let i = 0; i < childrenElements.length / 2; i++) {
        width += childrenElements[i].getBoundingClientRect().width + gap;
      }
      if (isMounted) setTotalWidth(width);
    }

    return () => {
      isMounted = false;
    };
  }, [children, gap]);

  return (
    <div
      ref={containerRef}
      className={`flex w-full overflow-hidden select-none ${className}`}
      style={{
        gap: `${gap}px`,
        maskImage: "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
      }}
      onMouseEnter={() => speedOnHover !== undefined && setCurrentSpeed(speedOnHover)}
      onMouseLeave={() => speedOnHover !== undefined && setCurrentSpeed(speed)}
    >
      {/* Animasyonlu İçerik Taşıyıcısı */}
      <div
        className="flex shrink-0 gap-inherit items-center justify-around min-w-full"
        style={{
          animation: `infinite-scroll ${currentSpeed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
      </div>

      {/* Sonsuz döngü illüzyonu için ikinci kopya */}
      <div
        className="flex shrink-0 gap-inherit items-center justify-around min-w-full"
        aria-hidden="true"
        style={{
          animation: `infinite-scroll ${currentSpeed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
      </div>

      {/* İhtiyacın olan CSS animasyon kuralını doğrudan tarayıcıya enjekte ediyoruz */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - ${gap}px)); }
        }
      `}</style>
    </div>
  );
}