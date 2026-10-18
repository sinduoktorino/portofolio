/*
 * tailwind.config.js — konfigurasi Tailwind untuk web.html & mobile.html
 *
 * Diambil apa adanya dari <script id="tailwind-config"> di dalam kode asli.
 * Dipakai bersama oleh kedua halaman (isinya identik; sebelumnya hanya
 * berbeda urutan beberapa baris).
 *
 * Dimuat SETELAH mesin Tailwind lokal, sebelum halaman dirender:
 *   <script src="js/tailwind-cdn.js?plugins=forms,container-queries"></script>
 *   <script src="js/tailwind.config.js"></script>
 *
 * Palet: biru tua -> ungu tua -> krem / abu-abu lembut (tema gelap).
 * Sebelumnya memakai palet Material 3 ungu/lavender/cyan. Peran tiap token:
 * primary = aksen utama, *-container = isian/glow, on-* = teks di atasnya.
 * Latar/surface = biru tua, glow/container = ungu tua & biru, teks = krem,
 * teks redup = abu-abu lembut. Warna merek teknologi tetap memakai warna asli
 * masing-masing (tidak ikut token ini).
 */
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "primary": "#f2e8d5",
                "on-background": "#ece4d8",
                "on-secondary": "#241a38",
                "inverse-surface": "#ece4d8",
                "on-surface": "#ece4d8",
                "tertiary-fixed-dim": "#b8c9f7",
                "secondary-fixed": "#e9ddff",
                "on-tertiary-fixed-variant": "#2c3a72",
                "error-container": "#5c2029",
                "error": "#e8a3a3",
                "inverse-on-surface": "#191f36",
                "tertiary-fixed": "#e0e7ff",
                "surface-container-low": "#10162c",
                "on-primary": "#241a38",
                "secondary-fixed-dim": "#cdb8ff",
                "on-primary-fixed": "#241a38",
                "on-tertiary": "#141d3a",
                "on-secondary-fixed-variant": "#4b2f7f",
                "surface": "#0a1020",
                "background": "#0a1020",
                "tertiary": "#a6bdf0",
                "surface-tint": "#f2e8d5",
                "primary-fixed": "#f8f1e3",
                "primary-fixed-dim": "#e3d7bd",
                "inverse-primary": "#6b53b0",
                "on-secondary-fixed": "#1e1433",
                "secondary-container": "#3a2564",
                "surface-container": "#161d38",
                "surface-container-highest": "#262f57",
                "on-secondary-container": "#ddcfff",
                "on-primary-container": "#241a38",
                "on-primary-fixed-variant": "#4b2f7f",
                "surface-dim": "#0a1020",
                "on-tertiary-container": "#dfe7ff",
                "surface-bright": "#2d3662",
                "surface-container-lowest": "#060a14",
                "tertiary-container": "#1f2a5c",
                "primary-container": "#c9b6f0",
                "outline": "#6f7191",
                "secondary": "#bda8f2",
                "on-error-container": "#ffdad9",
                "on-surface-variant": "#b1aec2",
                "on-tertiary-fixed": "#0c122a",
                "outline-variant": "#343b62",
                "on-error": "#3d0f14",
                "surface-variant": "#262f57",
                "surface-container-high": "#1d2547"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "spacing": {
                "gutter-sm": "1rem",
                "space-xs": "0.25rem",
                "space-sm": "0.5rem",
                "margin": "2rem",
                "space-lg": "1.5rem",
                "space-md": "1rem",
                "gutter": "1.5rem",
                "margin-mobile": "1.25rem",
                "space-xl": "2.5rem"
            },
            "fontFamily": {
                "body-sm": ["Plus Jakarta Sans"],
                "headline-sm": ["Plus Jakarta Sans"],
                "body-lg": ["Plus Jakarta Sans"],
                "headline-lg": ["Plus Jakarta Sans"],
                "label-code": ["JetBrains Mono"],
                "body-md": ["Plus Jakarta Sans"],
                "headline-md": ["Plus Jakarta Sans"],
                "display-mobile": ["Plus Jakarta Sans"],
                "label-caps": ["JetBrains Mono"],
                "headline-lg-mobile": ["Plus Jakarta Sans"],
                "display": ["Plus Jakarta Sans"]
            },
            "fontSize": {
                "body-sm": ["13px", { "lineHeight": "20px", "fontWeight": "400" }],
                "headline-sm": ["20px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
                "headline-lg": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "label-code": ["13px", { "lineHeight": "18px", "letterSpacing": "0.01em", "fontWeight": "500" }],
                "body-md": ["15px", { "lineHeight": "24px", "fontWeight": "400" }],
                "headline-md": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.015em", "fontWeight": "600" }],
                "display-mobile": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.025em", "fontWeight": "800" }],
                "label-caps": ["11px", { "lineHeight": "16px", "letterSpacing": "0.08em", "fontWeight": "600" }],
                "headline-lg-mobile": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.015em", "fontWeight": "700" }],
                "display": ["56px", { "lineHeight": "64px", "letterSpacing": "-0.03em", "fontWeight": "800" }]
            }
        }
    }
}
