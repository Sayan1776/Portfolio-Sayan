# 🎬 Sayan Paul — Portfolio

A **Black & White Documentary** design portfolio built with vanilla HTML, CSS & JavaScript. High-contrast, typographically driven, and cinematic in feel — no frameworks, no build tools.

🔗 **Live:** [devsayan.me](https://devsayan.me)

---

## ✨ Features

- **Black & White Documentary Aesthetic** — Pure monochrome palette, film grain overlay, editorial typography
- **3-Panel Interactive Work Layout** — SVG skill network · Project grid with filter-by-skill · Sticky preview panel
- **Cinematic Journey Timeline** — Alternating left/right cards with growing spine, diamond markers, and large year anchors
- **Scroll-Triggered Animations** — IntersectionObserver reveals, parallax section titles, timeline spine growth
- **Magnetic CTA Buttons** — Cursor-proximity attraction with inner-span parallax
- **Ambient Ink Bleed Background** — Dual radial gradient keyed to scroll position and mouse X
- **Premium Glass Card Layer** — Reusable `.glass-card` class with `backdrop-filter` blur, soft shadow, and a cursor-following radial-gradient spotlight (JS `mousemove` → CSS vars `--mouse-x`/`--mouse-y`) applied to all card components
- **Declassified Cert Reveal** — White bar wipes away to reveal certification titles on scroll
- **Section Chapter Labels** — Documentary-style `01 / SECTION` numbering via CSS data attributes
- **Responsive Design** — Desktop 3-panel → Tablet 2-col → Mobile single-column
- **Accessible** — ARIA labels, keyboard nav, `prefers-reduced-motion`, `hover: none` touch guards
- **Contact Form** — Validated form with floating labels, Google Apps Script backend, and toast notifications
- **Downloadable Resume** — One-click PDF

---

## 🛠️ Tech Stack

| Layer | Technology |
| ----------- | ------------------------------------ |
| Structure | HTML5 (Semantic, 4-page MPA) |
| Styling | Vanilla CSS (Custom Properties, 5-file modular architecture) |
| Interactivity | JavaScript (ES6+, no framework) |
| Animation | anime.js v4 (vendored) + CSS keyframes + IntersectionObserver |
| Fonts | Playfair Display · IBM Plex Mono · Inter (Google Fonts) |
| Icons | Font Awesome 6.4 |
| Hosting | Netlify (static, zero build step) |

---

## 📁 Project Structure

```
Portfolio-Sayan/
├── index.html          # Home — hero + about
├── work.html           # Work — 3-panel: skills SVG + project grid + preview
├── journey.html        # Journey — cinematic timeline: education + certs + leadership
├── contact.html        # Contact — contact cards + message form
├── css/
│   ├── base.css        # Design tokens, reset, film grain, global utilities
│   ├── layout.css      # Section layouts, workspace grid, timeline, preview panel
│   ├── components.css  # Navbar, footer, buttons, form, shared UI
│   ├── animations.css  # Keyframes + .reveal / .visible scroll-reveal states
│   └── responsive.css  # All breakpoints and touch/motion overrides
├── js/
│   ├── anime.min.js    # anime.js v4 (vendored, ~18KB)
│   ├── components.js   # Header/footer injection, nav, page transitions, particles
│   ├── animations.js   # All animation functions (scroll, parallax, timeline, magnetic)
│   └── main.js         # DOMContentLoaded init, page routing, skills network, preview panel
├── assets/
│   ├── profile.webp    # Hero profile image
│   ├── IPL.png         # IPL Predictor project screenshot
│   ├── kolkata-weather.png  # Weather ML project screenshot
│   └── resume.pdf      # Downloadable resume
├── AI_CONTEXT.md       # Full architecture reference for AI assistants
├── DESIGN_EXPERIMENTS.md  # 11 experimental UI concepts (5 implemented)
└── README.md
```

---

## 📌 Pages & Sections

| Page | Sections |
| --------------- | --------------------------------------------------------------- |
| **Home** | Hero (intro + animated stats) · About (dropcap + pull quote + tech stack) |
| **Work** | Skills SVG Network · Services (3 cards) · Project Grid + Preview Panel |
| **Journey** | Education Timeline (3 items) · Certifications Timeline (7 items) · Leadership Cards (6 items) |
| **Contact** | Contact cards (email, LinkedIn, GitHub, WhatsApp, location) + form |

---

## 🎨 Design System

The site uses a purpose-built **"Black & White Documentary Design System"**:

- **Palette** — `#000000` / `#ffffff` + `rgba` greyscale. Only accent: `--accent-red: #ff3333` (used sparingly on hover)
- **Typography** — Playfair Display (headings/display) · IBM Plex Mono (labels/code) · Inter (body/UI)
- **Film grain** — Fixed `z-index: 9999` SVG noise overlay (`body::after`) at 4% opacity
- **Ambient gradient** — `body::before` dual radial gradient tracks mouse X and scroll position
- **Spacing** — `--space-1` (0.25rem) through `--space-32` (8rem), matching Tailwind's scale
- **Borders** — Sharp editorial style. `--radius-sm: 2px`, `--radius-md: 4px`

---

## 🚀 Getting Started

```bash
git clone https://github.com/Sayan1776/Portfolio-Sayan.git
cd Portfolio-Sayan

# Open directly in browser (no build step needed)
open index.html

# Or use a local server
npx serve .
```

No dependencies to install. The only external resources are Google Fonts and Font Awesome loaded via CDN in the HTML.

---

## 📬 Contact

- **Email:** [685sayan@gmail.com](mailto:685sayan@gmail.com)
- **LinkedIn:** [linkedin.com/in/sayan-paul-96531632a](https://www.linkedin.com/in/sayan-paul-96531632a)
- **GitHub:** [github.com/Sayan1776](https://github.com/Sayan1776)

---

<p align="center">Designed & Developed with ❤️ by Sayan Paul</p>
