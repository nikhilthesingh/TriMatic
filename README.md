# Tri Matic — Landing Page

> A premium, animation-heavy agency landing page for Tri Matic — Creative Video & Design Studio.  
> No build step. Pure HTML, CSS, and JavaScript with CDN libraries.  
> Live: [trimatic.vercel.app](https://trimatic.vercel.app/)

---

## Project Structure

```
trimmed_site/
├── index.html          # Main HTML (single page)
├── css/
│   └── styles.css      # All styles (~6900 lines)
├── js/
│   └── main.js         # All JavaScript (~2350 lines)
└── assets/
    ├── TriMatic.webp           # Brand logo
    ├── design-*.webp           # 17 graphic design portfolio images
    └── usable_things/          # Misc assets
```

---

## External Libraries (CDN)

| Library | Version | Purpose |
|---|---|---|
| **GSAP** | 3.12.5 | All animations, timelines, scroll-triggered effects |
| **ScrollTrigger** | 3.12.5 | GSAP plugin — scroll-based animation triggers |
| **Lenis** | 1.1.13 | Smooth inertia scrolling (synced with GSAP ticker) |
| **Vimeo Player SDK** | latest | Reel player API (play/pause/volume/seekTo) |

All loaded with `defer` at the bottom of `index.html` in order: `gsap.min.js` → `ScrollTrigger.min.js` → `lenis.min.js` → `player.js` (Vimeo) → `main.js` → inline reel player script.

---

## Fonts

| Font | Source | Used For |
|---|---|---|
| **Oswald** | Google Fonts | Display headings (`--font-display`) |
| **Inter** | Google Fonts | Body text (`--font-body`) |
| **Playfair Display** | Google Fonts | Serif accents (`--font-serif`) |
| **Blanka** | cdnfonts CDN (`@import`) | Logo/brand text (footer, preloader, nav) |

---

## Page Sections (in order)

### 1. Preloader
**HTML:** `#preloader`  
Full-screen branded intro animation. Split-panel exit, counter 000→100, corner info badges, Lenis scroll lock during playback.

**JS:** `initPreloader()`

---

### 2. Navbar
**HTML:** `nav.navbar#navbar`  
Glassmorphic floating nav with hamburger toggle on mobile, focus trap, Escape close, scroll-depth blur effect.

**JS:** `initNavigation()` + `initGlassmorphNavbar()`

---

### 3. Hero
**HTML:** `section.hero#hero`  
Cinematic landing with pure-CSS animated gradient mesh, SVG noise overlay, backlit `TriMatic.webp` logo, HUD stats with bracket borders, CSS-only marquee strip, scroll indicator, and mouse-tracked background spotlight via CSS custom properties.

**JS:** `initHeroNew()`

---

### 4. Trusted By
**HTML:** `section.trusted-by#trusted-by`  
Infinite CSS-only horizontal marquee of client/brand categories. Decorative `TriMatic.webp` logo ghosts at edges.

**JS:** Pure CSS animation. Reveal via `initScrollReveal()`.

---

### 5. Beyond Logic
**HTML:** `section.beyond-logic#philosophy`  
Bold philosophy statement with scrolling marquee strip, per-character wave title animation, JS-generated floating particles, decorative glowing orb.

**JS:** `initBeyondLogic()`

---

### 6. About
**HTML:** `section.about#about`  
Word-by-word paragraph reveal as user scrolls. GSAP timeline with `scrub: 1.2` — each word transitions from dim to white. GSAP owns all states (no CSS transitions on `.word`).

**JS:** `initAboutTextReveal()`

---

### 7. Reel Slideshow
**HTML:** `section.reel-section#reel`  
Full-screen multi-video carousel — 4 slides (3 Vimeo + 1 YouTube). Cinematic overlays (gradients, scanlines, vignette), live title/category updates, dot navigation, mute toggle, keyboard and touch swipe support.

**Slides:**
| # | Platform | Video ID | Content |
|---|---|---|---|
| 1 | Vimeo | 1170088271 | Brand Film |
| 2 | YouTube | DIAxEMPm7aU | Long Form |
| 3 | Vimeo | 1169202605 | Cinematic Edits |
| 4 | Vimeo | 1170099080 | Product Showreel (starts at 23s) |

**Technical details:**
- All slides lazy-load via `data-src` (no `src` until needed)
- Vimeo embeds use `quality=360p` and `background=1` (chromeless)
- YouTube embed uses `controls=0&enablejsapi=1` with postMessage API
- Preload IntersectionObserver with `rootMargin: 600px` loads slides before section enters viewport
- `hasVimeoSDK()` checks dynamically on each `ensurePlayer()` call

**JS:** Inline IIFE at bottom of `index.html` (separate from `main.js`)

---

### 8. Creative Services
**HTML:** `section.services-section#services` + `section.flowing-services#flowing-services`

**Services Section** — Two-panel tabbed layout (Video Editing / Graphic Design) with mobile swipe carousel. Cards stagger-reveal on scroll with `alreadyVisible` guard for mid-scroll refresh.

**Flowing Services** — Hoverable service rows; each reveals a scrolling marquee fill strip on hover/focus. Hint bar with bouncing mouse icon, orange breathing left-bar on each row.

**JS:** `initServicesSection()` + `initFlowingServices()`

---

### 9. Visual Design Gallery
**HTML:** `section.design-gallery#design-gallery`  
3D circular drag carousel with 10 real portfolio image cards + infinite marquee strip below with 7 additional images. Lightbox (placed at body root to avoid CSS transform containment) with prev/next navigation, keyboard arrows, swipe on mobile, Lenis scroll lock.

**Gallery images:** 17 total `assets/design-*.webp` files covering logos, thumbnails, social media, posters, and brand kits.

**JS:** `initCircularGallery()`

---

### 10. Globe
**HTML:** `section.globe-section#expertise`  
Custom WebGL canvas globe with dot/line rendering, auto-rotation, mouse drag interaction. Paired with graphic design expertise copy and skill tags.

**JS:** `initGlobeCanvas()`

---

### 11. Featured Projects
**HTML:** `section.work-showcase#work`  
Video project grid — 7 cards (3 ambient Vimeo loops + 4 click-to-play with oEmbed thumbnails). Click-to-play opens video lightbox supporting both Vimeo and YouTube. Ambient iframes use `quality=360p`.

**JS:** `initWorkShowcase()` — includes `openLightbox(videoId, platform)`, exposed globally as `window.openVideoLightbox`.

---

### 12. Pricing
**HTML:** `section.pricing-section#pricing`  
Three-tier pricing cards (Basic / Standard / Advance). "Most Popular" badge on Standard. Animated border glow on featured card. ScrollTrigger stagger reveal.

**JS:** `initPricingSection()`

---

### 13. Contact + Footer
**HTML:** `section.contact-section#contact`  
Two-column editorial layout: left (availability badge, stats, channel links) + right (underline-style form via Web3Forms). Giant "TRI MATIC" footer brand text with mouse-spotlight effect. Footer bar with external links.

**Form:** Submits to Web3Forms API. Success state swaps in `.cs-success`.

**JS:** `initContactAnimations()` + `initFooterSpotlight()`

---

## JavaScript Functions Reference

### Boot Sequence (`window.addEventListener('load')`)

**Critical (immediate):**
`initPreloader()` → `initCustomCursor()` → `initHeroNew()` → `initNavigation()` → `initGlassmorphNavbar()` → `initSmoothScrollLinks()`

**Deferred (idle / 2s fallback):**
`initBeyondLogic()` → `initMagneticButtons()` → `initTypewriter()` → `initAboutTextReveal()` → `initRippleEffect()` → `initScrollReveal()` → `initParallaxSections()` → `initImageLazyReveal()` → `initServicesSection()` → `initGlobeCanvas()` → `initWorkShowcase()` → `initPricingSection()` → `initContactAnimations()` → `initFooterSpotlight()` → `initFlowingServices()` → `initCircularGallery()` → `initMagicBentoSpotlight()` → `initTargetCursor()` → `initPauseOffscreenAnimations()`

### Utility Functions

| Function | Purpose |
|---|---|
| `announce(message)` | Accessibility live-region announcements |
| `initHeroReveal()` | Hero element stagger reveal (called from preloader) |
| `initMagicBentoSpotlight()` | Cursor-tracked spotlight glow on cards |
| `initTargetCursor()` | 4-corner bracket cursor on interactive elements |
| `initPauseOffscreenAnimations()` | IntersectionObserver pauses CSS animations off-screen |

---

## CSS Design System

### Custom Properties

```css
--color-bg: #050505
--color-text: #f0f0f0
--color-accent: #fe6e00          /* Neon Orange */
--color-accent-blue: #00f0ff     /* Cyber Blue */
--font-display: 'Oswald', sans-serif
--font-body: 'Inter', sans-serif
--font-serif: 'Playfair Display', serif
--container-width: 1400px
--spacing-container: 2rem
```

### Key Animation Patterns

- **Scroll reveal:** `gsap.set()` for initial hide → `gsap.to()` with `scrollTrigger: { once: true }`
- **alreadyVisible guard:** Checks if element is past trigger on init (mid-scroll refresh) and reveals immediately
- **Word scrub:** GSAP timeline with `scrub: 1.2`, individual `.to()` per word
- **Mouse tracking:** CSS `--x`/`--y` custom properties via `mousemove` (no canvas/RAF)
- **Lenis sync:** Lenis runs on GSAP ticker — no separate RAF loop

---

## Performance Notes

- GSAP owns initial hidden state — never `opacity: 0` in CSS for scroll-revealed elements
- `once: true` on all one-shot ScrollTriggers
- All Vimeo embeds use `quality=360p`
- Reel slides lazy-load via `data-src` with 600px rootMargin preload
- `initPauseOffscreenAnimations()` pauses CSS animations off-screen
- Hero mesh spotlight pauses when hero leaves viewport
- Lenis exposed as `window.lenis` for scroll lock in lightboxes

---

## Known Quirks

- **Blanka font** — loaded via `@import` from cdnfonts. Falls back to Oswald if CDN unreachable.
- **Globe WebGL** — may run slowly on very low-end GPUs. Degrades gracefully.
- **Vimeo SDK timing** — SDK loads with `defer`; `hasVimeoSDK()` checks dynamically on each player init call.

---

*Last updated: March 2026*