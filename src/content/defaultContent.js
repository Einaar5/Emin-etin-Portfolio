// Sitenin tüm düzenlenebilir içeriği. Admin panel bunu değiştirir,
// localStorage'a kaydeder. Görseller tam yol (/images/opt/...) veya
// yüklenmiş data: URL olarak `image` alanında tutulur.

const opt = (name) => `/images/opt/${encodeURIComponent(name)}`

export const DEFAULT_CONTENT = {
  version: 1,

  nav: { logo: "Emin Çetin" },

  portfolio: {
    heading: "Tasarım Portfolyom",
    subtitle: "Klasörlere tıklayarak galeriye göz atabilirsiniz.",
  },

  about: {
    eyebrow: "Hakkımda",
    heading: "Merhaba, ben <em>Emin Çetin</em>",
    body: "Grafik tasarımcıyım; markaların görsel kimliğini kurgulayıp logo, afiş, banner, katalog ve sosyal medya içerikleri tasarlıyorum. Sadece statik değil, hareketli içerik (video kurgu) de üretiyorum. Her projede sade, akılda kalıcı ve markayı doğru yansıtan tasarımlar çıkarmayı hedefliyorum.",
    image: opt("165c7dd7-c5bf-459e-bfb5-e97072556d15.jpg"),
    stats: [
      { value: "5+", label: "Yıl Deneyim" },
      { value: "120+", label: "Tamamlanan Proje" },
      { value: "40+", label: "Mutlu Müşteri" },
    ],
  },

  // Hero (HeroParallax) ve ZoomParallax kaç görsel kullansın
  // hero.items boşsa çalışmaların ilk `count` görseli otomatik kullanılır.
  // Doluysa yalnızca bu liste kullanılır (tam kontrol).
  // fit: "cover" = alanı doldur/kırp, "contain" = tamamı görünsün (kırpma yok).
  hero: {
    count: 15,
    slogan: "Grafik Tasarım",
    title1: "EMIN",
    title2: "CETIN",
    fit: "cover",
    items: [], // [{ id, image, title, fit }]
  },
  zoom: { count: 13 },

  collections: [
    {
      id: "logo",
      title: "Logo & Marka",
      desc: "Marka kimliği ve logo çalışmaları",
      works: [
        { id: "logo-1", title: "Marka Kimliği 01", image: opt("165c7dd7-c5bf-459e-bfb5-e97072556d15.jpg") },
        { id: "logo-2", title: "Marka Kimliği 02", image: opt("c163fc0c-ae43-40c3-96dc-f782bcd9dacb.jpg") },
        { id: "logo-3", title: "Marka Kimliği 03", image: opt("Screenshot_6.png") },
      ],
    },
    {
      id: "afis",
      title: "Afiş Tasarımları",
      desc: "Tanıtım ve reklam afişleri",
      works: [
        { id: "afis-1", title: "Afiş Tasarımı 01", image: opt("adaptör.png") },
        { id: "afis-2", title: "Afiş Tasarımı 02", image: opt("kulaklık mcdodo.png") },
        { id: "afis-3", title: "Afiş Tasarımı 03", image: opt("şarj kablosu.png") },
        { id: "afis-4", title: "Afiş Tasarımı 04", image: opt("1e9dcf07-ec8c-480e-9251-9510bf261dcc.png") },
        { id: "afis-5", title: "Afiş Tasarımı 05", image: opt("4b453f16-d42a-49d5-aaf0-40970cf8bf9c.jpg") },
      ],
    },
    {
      id: "banner",
      title: "Banner Çalışmaları",
      desc: "Web banner ve kampanya görselleri",
      works: [
        { id: "banner-1", title: "Web Bannerı 01", image: opt("girişsağ 1.png") },
        { id: "banner-2", title: "Web Bannerı 02", image: opt("turunculu yeni - Kopya.png") },
        { id: "banner-3", title: "Web Bannerı 03", image: opt("s - Kopya.png") },
      ],
    },
    {
      id: "dergi",
      title: "Dergi & Katalog",
      desc: "Katalog kapağı ve dergi sayfa tasarımları",
      works: [
        { id: "dergi-1", title: "Katalog Tasarımı 01", image: opt("güneş masa sandalye katolog kapak-1.png") },
        { id: "dergi-2", title: "Katalog Tasarımı 02", image: opt("513aace3-fb42-4bb5-8315-336bc9ddde84.jpg") },
        { id: "dergi-3", title: "Katalog Tasarımı 03", image: opt("80240309-ab22-460d-bbb0-55d6e755c245.jpg") },
        { id: "dergi-4", title: "Katalog Tasarımı 04", image: opt("82b80cf2-80f7-467d-8c68-bdbd3edebace.jpg") },
      ],
    },
    {
      id: "diger",
      title: "Diğer Çalışmalar",
      desc: "Ürün görselleri ve çeşitli tasarımlar",
      works: [
        { id: "diger-1", title: "Ürün Görseli 01", image: opt("kompakt lens.png") },
        { id: "diger-2", title: "Ürün Görseli 02", image: opt("ekran koruyucu.png") },
        { id: "diger-3", title: "Ürün Görseli 03", image: opt("telefon kılıf 1.png") },
        { id: "diger-4", title: "Ürün Görseli 04", image: opt("powerbank.png") },
        { id: "diger-5", title: "Ürün Görseli 05", image: opt("kulaklık.png") },
        { id: "diger-6", title: "Ürün Görseli 06", image: opt("ses bombası.png") },
        { id: "diger-7", title: "Ürün Görseli 07", image: opt("806180d4-af03-4969-9479-2edac78b2066.jpg") },
        { id: "diger-8", title: "Ürün Görseli 08", image: opt("takiped.png") },
      ],
    },
  ],

  services: [
    { no: "01", title: "Logo & Marka Kimliği", desc: "Markanı yansıtan özgün logo ve kurumsal kimlik tasarımı." },
    { no: "02", title: "Afiş & Banner", desc: "Dikkat çeken tanıtım, kampanya ve web banner görselleri." },
    { no: "03", title: "Katalog & Dergi", desc: "Akıcı ve düzenli katalog kapağı ile dergi sayfa tasarımı." },
    { no: "04", title: "Sosyal Medya", desc: "Post, story ve reels için bütünlüklü içerik tasarımı." },
    { no: "05", title: "Ambalaj Tasarımı", desc: "Ürünü rafta öne çıkaran ambalaj ve etiket görselleri." },
    { no: "06", title: "Video Düzenleme", desc: "Kurgu, renk ve efektle akıcı hareketli içerik üretimi." },
    { no: "07", title: "Sosyal Medya Yönetimi", desc: "İçerik planlama, paylaşım takvimi ve hesap büyütme yönetimi." },
  ],

  video: {
    eyebrow: "Video Düzenleme",
    heading: "Sadece statik değil; <em>hareketli</em> de tasarlıyorum",
    desc: "Tanıtım videoları, reels & shorts kurgusu, ürün videoları ve sosyal medya içerikleri. Video düzenleme çalışmalarımı YouTube kanalımda paylaşıyorum.",
    channelUrl: "https://www.youtube.com/@Hermitme",
    embedUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=UUGPjKD70Vf9giHNXuEgRrbA",
    label: "YouTube · @Hermitme",
    previewUrl: "youtube.com/@Hermitme",
    // 2. buton (ayrı etiket + link). Boş bırakılırsa 1. butonun verisi kullanılır.
    button2Label: "YouTube · @Hermitme",
    button2Url: "https://www.youtube.com/@Hermitme",
  },

  contact: {
    heading: "Birlikte<br /><em>güzel</em> bir şey tasarlayalım",
    email: "emincetin061@gmail.com",
  },

  footer: { left: "© 2026 Emin Çetin", right: "Grafik Tasarım" },
}

// Admin "mevcuttan seç" için public/images/opt altındaki hazır görseller
export const AVAILABLE_IMAGES = [
  "165c7dd7-c5bf-459e-bfb5-e97072556d15.jpg",
  "1e9dcf07-ec8c-480e-9251-9510bf261dcc.png",
  "4b453f16-d42a-49d5-aaf0-40970cf8bf9c.jpg",
  "513aace3-fb42-4bb5-8315-336bc9ddde84.jpg",
  "80240309-ab22-460d-bbb0-55d6e755c245.jpg",
  "806180d4-af03-4969-9479-2edac78b2066.jpg",
  "82b80cf2-80f7-467d-8c68-bdbd3edebace.jpg",
  "adaptör.png",
  "c163fc0c-ae43-40c3-96dc-f782bcd9dacb.jpg",
  "ekran koruyucu.png",
  "girişsağ 1.png",
  "güneş masa sandalye katolog kapak-1.png",
  "kompakt lens.png",
  "kulaklık mcdodo.png",
  "kulaklık.png",
  "powerbank.png",
  "s - Kopya.png",
  "Screenshot_6.png",
  "ses bombası.png",
  "takiped.png",
  "telefon kılıf 1.png",
  "turunculu yeni - Kopya.png",
  "şarj kablosu.png",
].map((name) => opt(name))
