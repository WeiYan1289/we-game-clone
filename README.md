# WeGame Home Portal — Responsive PWA Mockup

A responsive, installable recreation of the [WeGame home portal](https://www.wegame.com.cn/home/) built for a frontend engineering challenge. It covers:

- the original's desktop full-page section paging
- its mobile layout
- OS-aware installer downloads
- the bonus feature, extended: **geolocation → local currency and page language** (中文 / English / Bahasa Melayu / Bahasa Indonesia)

> Assessment mockup, not affiliated with Tencent or WeGame. Game artwork belongs to its owners.

**Live URL:** _add your Vercel URL here after deploying_

---

## Highlights

| Requirement | How it's met |
|---|---|
| Layout fidelity | Every section is composed on a 1440×900 reference frame and sized in a design unit `--u`, so the composition scales as one piece, the same way the original does |
| Desktop behaviour | No free scrolling. The wheel, arrow and page keys, swipe, or the right-hand rail (01 大作 … 05 高校 · TOP) move one full-screen panel at a time with the original's 0.6 s easing. 焕新 has two steps, and the 助手 tabs rotate on their own. |
| Mobile behaviour | The original's mobile layout: solid bar with the hamburger on the left, search and login, no logo. The menu drops down on an opaque backdrop. Sections keep the original's aspect ratio; the assistant panels stack; the hero video is skipped on phones. |
| Interactivity | Rail paging; developer-platform dropdown; rotating search placeholder; hero video; floating posters with mouse parallax and fly-in; rotating CTA; auto-advancing ARIA tabs; squad picker; marquee; QR popovers |
| Downloads | Detects Windows, Mac or phone. Windows → the official `.exe`. Mac → the original's chip chooser (Intel / Apple silicon), with the detected chip marked "recommended" where the browser can tell. Phones → a "desktop app" note plus every installer. |
| Localisation | `/` (zh-CN), `/en`, `/ms`, `/id`, each pre-rendered at build time from typed dictionaries. Detecting your location switches the page language and currency together. |
| PWA | Manifest with icons and screenshots; hand-written service worker that precaches every language's page; custom offline page; offline banner; install prompt |
| Deployment | Zero-config on Vercel, with security headers and a no-cache header for the service worker |

## Tech stack

- **Next.js 16** (App Router, Turbopack, `cacheComponents`), **React 19**, **TypeScript** (strict)
- **CSS Modules** with design tokens in CSS custom properties. No UI library.
- **Vitest** and **Testing Library** (jsdom): 130 tests

## Getting started

```bash
npm install
npm run dev                  # http://localhost:3000 (service worker disabled in dev)
npm test                     # unit + component tests
npm run lint
npm run build && npm start   # production build — use this to test PWA/offline
```

Helper scripts:

```bash
npm run assets                # re-download images from the WeGame CDN into public/images
node scripts/make-icons.mjs   # regenerate PWA icons with sharp
```

## Project structure

```
src/
  app/
    [lang]/layout.tsx     root layout per locale (html lang, metadata, SW registration)
    [lang]/page.tsx       composes the sections from the locale's dictionary
    offline/              self-contained offline fallback (its own root layout)
    global-not-found.tsx  404 for unmatched URLs (multiple root layouts)
    manifest.ts           web app manifest
  i18n/
    config.ts             locales, country → locale mapping, URL helpers
    dictionaries/         zh-CN (source of truth) + en / ms / id, typed against it
  components/
    paging/               FullPage (desktop paging controller) + Panel / Frame
    layout/               Header, MobileMenu, NavDropdown, SearchBox, SideNav, Footer, AppShell
    sections/             Hero, Topic (+FloatingPosters, RotatingPill), Frame, Feature, Teamup, College
    download/             DownloadButton (OS-aware, Mac chip chooser)
    currency/             region / language / currency modal (presentational)
    pwa/                  ServiceWorkerRegister, InstallPrompt, OfflineBanner
    ui/                   Tabs, BackgroundVideo, ChatTicker, Icon, Logo…
  hooks/                  useGeoCurrency, usePlatform, useMediaQuery, useInterval, useDismiss…
  lib/                    pure, unit-tested logic: currency, geo, platform, paging, session
  data/                   asset data (posters, art, installer URLs)
public/sw.js              service worker
```

## Architecture decisions

### One composition, scaled

Sections are laid out on the live site's 1440×900 frame with coordinates measured from it, and every size is a multiple of `--u`:

- **Desktop:** `--u = min(100vw/1440, 100dvh/900)`. Each section fills exactly one screen at any window size.
- **Mobile:** `--u = 100vw/1440`. Sections keep the original's aspect ratio (≈1440:780), as the live site does on phones.

Text uses `max(<floor>px, n·--u)`, so it stays readable on small screens.

### Desktop paging (`components/paging/FullPage.tsx`)

The document stops scrolling (`html[data-paging=on]`) and a track slides by panel offsets. Paging switches on only for wide, tall-enough viewports (`(min-width:1025px) and (min-height:560px)`); everything else scrolls normally.

- **Wheel input** goes through a pure `createWheelGate` (unit-tested). It locks during the transition and swallows trackpad momentum, so one gesture moves exactly one panel.
- **Keyboard and screen readers:** focusing anything inside an off-screen panel brings that panel into view, and in-page `#anchor` links, deep links and `hashchange` all resolve to the right panel. Paging keys are ignored while typing or while a dialog or menu is open.
- **Rendering:** the rail is rendered through an `overlay` slot, so it shares the paging context but stays outside the transformed track, where `position: fixed` still works. Sections stay server components; `FullPage` finds them through `[data-panel]`.

### Internationalisation

Following the Next 16 guide, the root layout lives under `app/[lang]`, and `generateStaticParams` pre-renders the four locales. `/` is rewritten to `/zh-CN`, matching the original. Dictionaries are typed against `zh-CN`, and a test checks that every locale has exactly the same keys and list lengths. Server components read the dictionaries, so translations add nothing to the client JS bundle.

**Location → language and currency.** The geo flow is a `useReducer` state machine (`idle → locating → resolving → success | denied | timeout | unavailable | unsupported | error`):

1. A fresh result maps country → locale (MY → `ms`, ID → `id`, CN/HK/TW/MO → `zh-CN`, otherwise `en`).
2. If that differs from the current locale, the app navigates to the new URL. Because that's a different root layout, the browser loads a new page.
3. The result and a "reopen" flag carry over in `sessionStorage`, so the modal reopens to confirm the switch.

Country and currency names follow the page language (`Intl.DisplayNames`), while number formatting follows the country (`Intl.NumberFormat`).

### OS-aware downloads

`lib/platform.ts` detects the OS from User-Agent Client Hints, falling back to the UA string (iPadOS counts as a phone). Mac chip detection uses `getHighEntropyValues(["architecture"])` where Chromium supports it. Safari can't tell, so it gets the same chooser the original shows. The server renders the neutral Windows label and switches after hydration (`useSyncExternalStore`), so there's no hydration mismatch. Installer URLs are the official ones from WeGame's public site config (`data/downloads.ts`).

### State and CSS

- No global store. `AppShell` is the single client boundary for page-wide state. Hooks hold the logic, and components stay presentational: the modal renders every state from props.
- Design tokens are global; every component has a co-located CSS Module, mobile first. Motion respects `prefers-reduced-motion`: autoplay, marquees, video and slide transitions stop.

### Accessibility

- Semantic landmarks
- WAI-ARIA tabs with a roving tabindex, which pause auto-advance on focus
- Disclosure menus that close on Escape or an outside click and return focus
- Native radio inputs for the squad picker
- Native `<dialog>` for the modal
- `aria-current` on the rail
- Section titles as real text, so they can be translated

## PWA and offline strategy

`public/sw.js` is about 150 lines, written by hand so every caching decision is visible.

| Request | Strategy |
|---|---|
| Navigations | Network-first, then the cached page, then `/offline` |
| `/_next/static/*` | Cache-first (content-hashed and immutable) |
| `/images/*`, `/icons/*`, `/_next/image` | Stale-while-revalidate. Offline, any cached width of the same image is served. |
| Cross-origin (videos, geocoding API, installers) | Not intercepted |

- **Install** precaches `/`, `/en`, `/ms`, `/id` and `/offline`, parses their HTML for the hashed chunk URLs, and caches those too. Every language works offline straight after install.
- **Versioning:** the worker is registered as `/sw.js?v=<commit SHA>`. Each deploy installs a fresh worker, which deletes the previous cache.
- `/sw.js` is served with `Cache-Control: no-cache`.

**To test:** run `npm run build && npm start` and load the page once. Then, in DevTools → Application, tick *Offline* (or stop the server) and open `/`, `/en`, `/ms` or `/id`. All of them render from cache.

## Deploying to Vercel

**Option A — Git import (recommended):** push the repo to GitHub. In Vercel, choose **Add New → Project**, import it, and keep the detected Next.js defaults. No environment variables are needed.

**Option B — CLI:**

```bash
npm i -g vercel
vercel --prod
```

## Trade-offs and next steps

- **Section titles:** the live site renders them as SVG images. Here they're real text so they can be translated, so the typeface differs slightly. Some secondary copy is my own.
- **Currency:** prices show local formatting, not converted amounts. A next step would add a cached FX-rates API.
- **Mac chip detection** works in Chromium only; Safari and Firefox get the chooser.
- **Next steps:** Playwright end-to-end tests (paging, offline, locale switch), Lighthouse CI, and blur placeholders for large art.
