# Sayan Paul — Java / Fieldnotes

A multi-page, responsive developer portfolio built as a living field journal: oversized type, warm paper and ink surfaces, the Java orange/blue identity, custom code illustrations, an original Kolkata workbench scene, a dimensional hero, and an asymmetric project explorer.

## Run locally

From this directory:

```bash
npx serve .
```

Open the localhost URL shown in the terminal. The site is static and needs no build step. Google Fonts use a remote URL; the hero artwork is stored locally, with font fallbacks if remote fonts are unavailable.

## Pages

- `index.html` — framed workbench scene, dimensional “BUILDS.” hero, one featured Task Manager project, two supporting builds, personal build notes
- `work.html` — searchable/filterable explorer for all projects in an alternating editorial grid
- `about.html` — engineering journey, current skills, and learning roadmap
- `contact.html` — validated contact form that sends submissions to your inbox through Web3Forms
- `projects/*.html` — eleven detailed case-study pages spanning the project index, with the earlier live portfolio linked externally

## Motion and interaction

- Cinematic preloader once per browser tab session; honors `prefers-reduced-motion`
- Cinematic full-screen page-to-page curtain with a destination-specific title
- Scroll progress line, parallax, and intersection-observer reveals throughout the pages
- Original hero artwork with a silent, browser-generated video stream, film-light sweep, and gentle camera movement (still-image fallback; no external video request)
- Pointer-reactive 3D hero framing and project art; tactile hover, active, and focus states
- Full-screen responsive MENU overlay with Escape/outside-click handling
- Project category filtering and free-text search across twelve project entries
- Contact validation and inbox delivery through Web3Forms; copy-email action and dynamic year
- Reduced-motion and keyboard-focus support

## Personalize before publishing

1. Create a Web3Forms access key for `685sayan@gmail.com`, then add it to the hidden `access_key` field in `contact.html`.
2. Confirm your GitHub profile and project repository URLs. Your LinkedIn profile is linked in the footer.
3. Review each case study and update any project statuses or technologies that have changed.
4. Replace the generated hero scene with your own desk or project footage if you want the homepage to feature real personal media.

The homepage deliberately highlights only three builds. Task Manager is the flagship because it reflects your current Java/backend learning; the full project collection stays on the Work page. The index now includes the six additions from your previous project schema alongside the six original entries. The case studies distinguish personal builds, team work, concepts, and experiments instead of claiming expertise in every technology.

## Theme, cursor, timeline and skills map

- **Dark mode:** use the small sun/moon control in the header. The selection is shared across pages and tabs with `localStorage`; internal links also carry it for same-tab navigation when the site is opened from local files.
- **Custom cursor:** a compact orbital marker moves directly with the pointer. Its fine ring expands into a focus frame on links and buttons; it uses no trail. Touch screens and users who request reduced motion keep the native pointer. Keyboard navigation restores the native cursor.
- **About timeline:** six milestones follow a drawn, curved trail—from early Python/web experiments to the current Java chapter and the planned Spring Boot step.
- **Skill tree:** a true three-level branching diagram. Engineering Toolkit fans into Java/backend, databases, web/interface, Python/data, and workflow; each domain splits into sub-branches, then individual technology nodes (for example, Database → Managed & app data → Supabase). Curved SVG connectors are drawn from node positions and update on resize or collapse. Domain and sub-branch toggles work independently.

The dark palette is intentionally art-directed rather than mechanically inverted: ink becomes the canvas, blue becomes brighter for contrast, mint panels deepen, and Java orange remains the interaction accent.


## Latest visual pass

- Replaced the stock homepage photo strip with locally stored field-notes hero artwork.
- Added a dimensional navy hero stage, subtle grid lines, pointer tilt, moving light, and a silent local video stream generated from the original artwork.
- Rebuilt the project explorer as an alternating responsive editorial grid and added depth to case-study art panels.
- Replaced the fountain-pen cursor and ink trail with a compact orbital focus marker.
- Reframed the homepage around a “Think. Make. Learn.” process layout, with Java represented as one current chapter through a quiet coffee-and-code motif.
- Made the light/dark preference persist across pages, tabs, and same-tab navigation from local files.
- Repaired the chapter menu so it covers the viewport on desktop and mobile with an opaque theme-matched surface, safe-area spacing, and scrolling on short screens.
- Reduced-motion and touch devices retain stable, readable layouts and native pointer behavior.


## Contact form delivery

The contact form sends a browser-side POST to Web3Forms and shows success or failure on the page. It must be opened from an HTTP/HTTPS site, not directly as a `file://` page. For local preview, run `python -m http.server 8000` from this folder and open `http://localhost:8000/contact.html`. Before delivery can work, create an access key at [Web3Forms](https://web3forms.com/) for `685sayan@gmail.com` and replace `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` in `contact.html` with the emailed key. The form includes a hidden honeypot; the access key is public by design, but optional domain restrictions can be enabled in Web3Forms.
