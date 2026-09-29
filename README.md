# CALTEC Instrument Services — website redesign

A ground-up rebuild of [caltec.com.pk](https://caltec.com.pk) as a fast, static, heavily animated site.

**Stack:** Astro 7 · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) · Framer Motion (React islands) · Lenis smooth scroll

## Highlights
- Calibration-gauge preloader and red/ink curtain page transitions
- Split-text headline reveals, scroll-scrubbed word highlighting, parallax and SVG line drawing
- Pinned horizontal scroll through the seven calibration disciplines
- Live gauge readout in the hero, velocity-reactive client marquee, cursor-following image previews
- Framer Motion: full-screen menu, searchable instrument explorer, 3D-tilt ISO certificate lightbox, page-flip business profile viewer, multi-step enquiry form
- Custom cursor, magnetic buttons, `prefers-reduced-motion` support throughout
- Legacy WordPress URLs preserved (service slugs) or 301-redirected (blog posts) via `public/_redirects`

## Develop
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs static site to dist/
```

## Structure
- `src/data/site.ts` — contact details, services & instrument lists, clients, industries
- `src/content/blog/` — journal articles (Markdown)
- `src/scripts/motion.ts` — global GSAP/Lenis motion system (`data-split`, `data-reveal`, `data-parallax`, …)
- `src/components/react/` — Framer Motion islands

## Deploy
Cloudflare Pages: build command `npm run build`, output directory `dist`.
