# WeGame Home Portal — Responsive PWA Mockup

A responsive, installable recreation of the [WeGame home portal](https://www.wegame.com.cn/home/) built for a frontend engineering challenge. It also includes the bonus feature: a **geolocation → local currency** modal.

> Assessment mockup, not affiliated with Tencent or WeGame. Game artwork belongs to its owners.

**Live URL:** _add your Vercel URL here after deploying_

---

## Highlights

| Requirement | How it's met |
|---|---|
| Responsive layout | Mobile-first CSS Modules, breakpoints at 640 / 1024 px, fluid type with `clamp()`, no horizontal scroll at 360–1440 px |
| Interactivity | Sticky header (transparent → solid), hover/click/keyboard dropdown, mobile drawer, hero video, coverflow poster carousel (autoplay, swipe, dots), auto-rotating ARIA tabs, team role picker, CSS marquee, scroll-spy side nav, back-to-top |
| PWA: installable | `app/manifest.ts` (standalone, theme colours, 192/512/maskable icons, wide + narrow screenshots), custom install prompt via `beforeinstallprompt` |
| PWA: offline | Hand-written `public/sw.js`: precaches the app shell and its hashed chunks, runtime caches images, serves a custom `/offline` page, and an offline banner uses Next's `useOffline()` |
| Deployment | Zero-config on Vercel, with security headers and a no-cache header for the service worker |
| Bonus | Geolocation API → BigDataCloud reverse geocoding (with an on-device fallback) → ISO currency → `Intl.NumberFormat` preview |

## Tech stack

- **Next.js 16** (App Router, Turbopack, `cacheComponents`), **React 19**, **TypeScript** (strict)
- **CSS Modules** plus design tokens in CSS custom properties (`src/styles/tokens.css`). No UI library.
- **Vitest** and **Testing Library** (jsdom): 76 tests

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000 (service worker disabled in dev)
npm test             # unit + component tests
npm run lint
npm run build && npm start   # production build — use this to test the PWA/offline mode
```

Helper scripts:

```bash
npm run assets            # re-download images from the WeGame CDN into public/images
node scripts/make-icons.mjs   # regenerate PWA icons with sharp
```

## Project structure

```
src/
  app/
    layout.tsx            root layout: metadata, viewport, SW registration, offline banner
    page.tsx              composes the sections (server component)
    manifest.ts           web app manifest
    offline/              offline fallback page (self-contained)
  components/
    layout/               Header, NavDropdown, SearchBox, MobileNav, SideNav, Footer, AppShell
    sections/             Hero, Topic, Frame, Feature, Teamup, College
    ui/                   reusable primitives: PosterCarousel, Tabs, BackgroundVideo, ChatTicker, Icon…
    currency/             CurrencyModal + CurrencyResult (presentational)
    pwa/                  ServiceWorkerRegister, InstallPrompt, OfflineBanner
  hooks/                  useGeoCurrency, useScrolled, useActiveSection, useDismiss, useInterval…
  lib/                    currency.ts, geo.ts (pure, unit-tested)
  data/                   static content (navigation, games, features, team roles)
  styles/tokens.css       design tokens
public/
  sw.js                   service worker
  images/ icons/          local assets
```

## Architecture decisions

**Server-first component tree.** `page.tsx` and the static sections are server components. Client code is limited to the leaves that need state or effects: the header, carousel, tabs, video, team picker and modal. `AppShell` is the single client boundary for page-wide state. It takes the sections as `children`, so they stay server-rendered.

**State management.** There is no global store because nothing needs one. Local UI state lives in `useState`. The geolocation flow is the one complex piece, so it is an explicit `useReducer` state machine (`idle → locating → resolving → success | denied | timeout | unavailable | unsupported | error`). It lives in `AppShell` so the result survives closing the modal and can show in the header. The modal itself is presentational, which makes every state easy to test.

**CSS architecture.** Global design tokens are defined once. Each component has a co-located CSS Module, layouts are mobile-first, and the custom-property-driven carousel maths keeps per-breakpoint layout in CSS (`--per-view`) rather than in JS. Motion respects `prefers-reduced-motion`: autoplay, marquees and video stop.

**Accessibility.**
- Semantic landmarks
- WAI-ARIA tabs with a roving tabindex and arrow keys
- A disclosure dropdown that closes on Escape and outside clicks and returns focus
- The team picker uses native radio inputs
- The modal uses the native `<dialog>` for its focus trap and Escape handling
- Visible focus rings and alt text throughout
- Section titles are real text, not images

**Loading and error states.**
- The hero and frame videos are hotlinked. If they fail (blocked CDN or offline), the video hides and its gradient or poster background stays.
- Images are lazy-loaded and optimised by `next/image`.
- The currency modal has a distinct message and recovery path for every failure.
- The offline banner tells users when they're seeing cached content.

## PWA and offline strategy

`public/sw.js` is about 150 lines, written by hand so every caching decision is visible.

| Request | Strategy |
|---|---|
| Navigations | Network-first, then the cached page, then `/offline` |
| `/_next/static/*` | Cache-first (content-hashed and immutable) |
| `/images/*`, `/icons/*`, `/_next/image` | Stale-while-revalidate. Offline, any cached width of the same image is served. |
| Cross-origin (videos, geocoding API) | Not intercepted |

- **Install** precaches `/` and `/offline`, parses their HTML for the hashed `/_next/static` chunk URLs, and caches those too. The first offline load therefore works right after install.
- **Versioning:** the worker is registered as `/sw.js?v=<commit SHA>`. Each deploy installs a fresh worker whose `activate` step deletes the previous cache.
- `/sw.js` is served with `Cache-Control: no-cache` (see `next.config.ts`) so updates are picked up immediately.
- Images are cached as you browse rather than precached, which avoids a ~5 MB install. The trade-off is that images you never scrolled to aren't available offline.

**To test:** run `npm run build && npm start`, load the page once and scroll through it. Then, in DevTools → Application, tick *Offline* (or stop the server) and reload. The page renders from cache, and any route you never visited shows the offline page.

## Bonus: geolocation and currency

1. `navigator.geolocation.getCurrentPosition` runs with a 10 s timeout and a 10 min `maximumAge`.
2. The coordinates go to [BigDataCloud's free client-side reverse geocoder](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api), which needs no key and allows CORS. The request is abortable and times out after 8 s.
3. If that fails, an **on-device bounding-box lookup** covers 13 major markets (MY, SG, ID, TH, VN, PH, KR, JP, IN, CN, AU, GB, US). The result is labelled "approximate".
4. The country code maps to an ISO 4217 currency (71 countries, including the eurozone). Unknown regions fall back to USD, with a note saying so.
5. The modal shows the flag, country, currency code and name (`Intl.DisplayNames`), and sample prices formatted with `Intl.NumberFormat`.
6. If permission is denied or the API is unsupported, a manual country picker is offered.

Privacy: the modal explains that coordinates are sent only to the geocoding API, and nothing is stored.

## Deploying to Vercel

**Option A — Git import (recommended)**
1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project**, import the repo, and accept the detected Next.js defaults. No environment variables are needed.
3. Each push to `main` deploys to production, and each PR gets a preview URL.

**Option B — CLI**

```bash
npm i -g vercel
vercel          # first run links the project (preview deploy)
vercel --prod   # production deploy
```

## Trade-offs and next steps

- **Copy and titles:** the live site renders section titles as SVG images. Here they're real text for accessibility and originality, so the typeface differs slightly. Some secondary copy is written by me.
- **No full-page scroll snapping:** the live site hijacks the wheel on desktop. Natural scrolling is better on touch devices and for accessibility.
- **Currency** shows formatting only, not converted prices. A next step would add an FX-rates API with caching.
- **Next steps:** Playwright end-to-end tests (including an offline run), Lighthouse CI, blur placeholders for large images, and i18n for the bilingual copy.
