# WeGame Home Portal — Responsive PWA Mockup

**Live demo:** https://we-game-clone.vercel.app/

> [!IMPORTANT]
> **This is a mock website built for a frontend engineering assessment.** It is not the real WeGame
> site and is not affiliated with, endorsed by or connected to Tencent or WeGame. Logos, game
> artwork and videos belong to their respective owners and are used here for demonstration only.
> Nothing on this site is a real service: the login is a demo that sends nothing anywhere, and links
> that lead to the real WeGame site go through a page that says so first.

A responsive, installable recreation of the [WeGame home portal](https://www.wegame.com.cn/home/), covering:

- full-page section paging on desktop, with each section's entrance animation
- the mobile layout
- OS-aware installer downloads
- the bonus feature, extended: **geolocation → local currency and page language** (中文 / English / Bahasa Melayu / Bahasa Indonesia)
- an installable PWA with an offline fallback

---

## Highlights

| Area | What it does |
|---|---|
| Layout | Every section is composed on a 1440×900 reference frame and sized in a design unit `--u`, so each composition scales as one piece |
| Desktop paging | No free scrolling. The wheel, arrow and page keys, swipe, or the right-hand rail (01 大作 … 05 高校 · TOP) move one full-screen panel at a time. Panels crossfade (0.5 s), and each section replays its entrance on every visit |
| Section animations | **Hero:** the slogan hands over from 2.0 to 3.0. **大作:** posters stream out from behind the title. **焕新:** the client window rises in, "WEGAME 3.0 轻装上阵" turns into "体验革新 轻松掌控" as the client folds into its compact layout, then the game window tips back onto a perspective floor. **助手:** a diagonal guide intro, then three auto-rotating tabs, the last one an AI recap panel that types itself out. **开黑:** two acts (avatars, then the room and five heroes). **高校:** staggered copy, the phone, floating cards, a bouncing mascot and a scrolling chat feed. **Footer:** a continuously scrolling game wall |
| Mobile | Solid bar with the hamburger, search, login and region button; a drop-down menu on an opaque backdrop. Sections keep the original's ≈1440:780 proportions, and the hero video is skipped on phones |
| Interactivity | Rail paging, developer-platform dropdown, rotating search placeholder, hero video, poster stream with mouse lean, auto-advancing ARIA tabs, squad role picker, chat feed, WeChat QR popover |
| Downloads | Detects Windows, Mac or phone. Windows gets the official `.exe`; Mac gets a chip chooser (Intel / Apple silicon) with the detected chip marked "recommended" where the browser can tell; phones get a "desktop app" note with every installer |
| Login (demo) | Native `<dialog>` with client-side validation for QQ and phone numbers, a loading state and a demo notice. No request is made and nothing is stored |
| Links to the real site | Buttons that lead to wegame.com.cn (store, developer platform, creator programme, changelog, feedback, search, socials, partner and legal links) open a translated page that names the destination first. All of them come from one typed registry (`data/links.ts`) |
| Localisation | `/` (zh-CN), `/en`, `/ms`, `/id`, each pre-rendered from typed dictionaries. Detecting your location switches the language and the currency together |
| PWA | Manifest with icons and screenshots, a hand-written service worker that precaches every language's page, an offline page, an offline banner and an install prompt |

## Tech stack

- **Next.js 16** (App Router, Turbopack, `cacheComponents`), **React 19**, **TypeScript** (strict)
- **CSS Modules** with design tokens in CSS custom properties; no UI library
- **Vitest** and **Testing Library** (jsdom): 19 test files, 176 tests
- Deployed on **Vercel**

## Getting started

```bash
npm install
npm run dev                  # http://localhost:3000 (no service worker in dev)
npm test                     # unit + component tests
npm run lint
npm run build && npm start   # production build — use this to try the PWA and offline mode
```

Helper scripts:

```bash
npm run assets                # download the images used by the mockup into public/images
node scripts/make-icons.mjs   # regenerate the PWA icons with sharp
```

## Project structure

```
src/
  app/
    [lang]/layout.tsx       root layout per locale (html lang, metadata, SW registration)
    [lang]/page.tsx         composes the sections from the locale's dictionary
    [lang]/go/[slug]/       "leaving the mockup" page for links to the real site
    offline/                self-contained offline fallback (its own root layout)
    global-not-found.tsx    404 for unmatched URLs
    manifest.ts             web app manifest
  i18n/
    config.ts               locales, country → locale mapping, URL helpers
    dictionaries/           zh-CN (source of truth) + en / ms / id, typed against it
  components/
    paging/                 FullPage (desktop paging controller) + Panel / Frame
    layout/                 AppShell, Header, MobileMenu, NavDropdown, SearchBox, SideNav, Footer
    sections/               Hero, Topic, Frame, Feature (+ FeatureTabs), Teamup, College
    download/               DownloadButton (OS-aware, Mac chip chooser)
    currency/               region / language / currency modal
    auth/                   demo login modal
    pwa/                    ServiceWorkerRegister, InstallPrompt, OfflineBanner
    ui/                     Tabs, BackgroundVideo, ChatTicker, Icon, Logo, SectionHeading
  hooks/                    useGeoCurrency, usePlatform, useMediaQuery, useModalDialog, useDismiss…
  lib/                      pure, unit-tested logic: currency, geo, platform, paging, login, session
  data/                     section art, installer URLs, links to the real site
  styles/tokens.css         design tokens: colours, type scale, spacing, motion, --u
public/sw.js                service worker
```

## Architecture

### One composition, scaled

Sections are laid out on a 1440×900 frame with coordinates measured from the reference site, and every size is a multiple of `--u`:

- **Desktop:** `--u = min(100vw/1440, 100dvh/900)`, so each section fills exactly one screen at any window size. The hero is sized off the viewport width, like the reference.
- **Mobile:** `--u = 100vw/1440`, so sections keep the ≈1440:780 proportions of the reference's phone layout.

Text uses `max(<floor>px, n·--u)` so it stays readable on small screens, and longer translations wrap within their columns instead of overflowing.

### Desktop paging (`components/paging/FullPage.tsx`)

The document stops scrolling (`html[data-paging=on]`) and every panel is stacked full-screen. The current panel fades in and gets `data-current`, which starts its CSS entrance; moving the attribute replays the animation on every visit. Hidden panels use `visibility: hidden`, so they leave the tab order, and their decorative loops pause. The current panel's and both neighbours' images load eagerly, so the art is ready on arrival. Paging is on only for wide, tall-enough viewports (`(min-width:1025px) and (min-height:560px)`). Everything else scrolls normally, and each section plays its entrance the first time it scrolls into view (`IntersectionObserver`).

- **Wheel input** goes through a pure, unit-tested `createWheelGate`. It locks during the transition and tells deliberate input (mouse-wheel notches, a re-accelerating swipe) apart from a flick's decaying momentum, so one flick moves one panel while steady scrolling keeps paging.
- **Keyboard and screen readers:** focusing anything in an off-screen panel brings it into view. In-page `#anchor` links, deep links and `hashchange` resolve to the right panel. Paging keys are ignored while typing or while a dialog or menu is open.
- **Rendering:** sections stay server components and `FullPage` finds them through `[data-panel]`. The rail renders through an `overlay` slot, so it shares the paging context without joining the panel stack.

### Animation

Animations are CSS keyframes; JavaScript only decides which panel is current.

- **Base styles are each section's final frame,** and entrances use `animation-fill-mode: both`. Phones, reduced motion and the first paint all get a correct still layout, and nothing flashes before an animation starts.
- **Choreography is timing:** each element has its own `animation-delay`, and "hold" keyframes (for example `0%, 82% { opacity: 0 }`) keep a step waiting inside one animation.
- **Only compositor-friendly properties** are animated: `transform` (as separate `translate` / `rotate` / `scale`), `opacity` and `clip-path`. Examples are the 助手 diagonal wedge, the AI recap revealing itself line by line, and the 焕新 window tipping back with `perspective` and `rotateX`.
- **Loops** (poster stream, chat feed, game wall) render their content twice and move the track by exactly one copy, with `mask-image` fading the edges.
- `prefers-reduced-motion` settles every entrance on its final frame and stops autoplay, loops and video.

### Internationalisation

The root layout lives under `app/[lang]`, and `generateStaticParams` pre-renders the four locales; `/` is rewritten to `/zh-CN`. Dictionaries are typed against `zh-CN`, and a test checks that every locale has the same keys and list lengths. Server components read the dictionaries, so translations add nothing to the client bundle.

**Location → language and currency.** The geo flow is a `useReducer` state machine: `idle → locating → resolving → success | denied | timeout | unavailable | unsupported | error`.

1. A result maps country → locale (MY → `ms`, ID → `id`, CN/HK/TW/MO → `zh-CN`, otherwise `en`).
2. If that differs from the current locale, the app navigates to the new URL, which loads that locale's page.
3. The result and a "reopen" flag carry over in `sessionStorage`, so the modal reopens to confirm the switch.

Country and currency names follow the page language (`Intl.DisplayNames`); number formatting follows the country (`Intl.NumberFormat`).

### State management

There's no global store. State sits at the narrowest level that works:

- **Local `useState`** for component UI: selected tab, open popups, form fields and errors, chosen role.
- **Lifted to `AppShell`** when siblings share it: which modal is open and the region badge.
- **Context** for the paging state many components need (`usePaging()`: rail, tabs, entrances).
- **`useReducer`** for the asynchronous geolocation flow.
- **`useSyncExternalStore`** for browser values (OS, media queries, reduced motion, session flags), with server snapshots so the static HTML and the first client render agree.
- **The URL** for anything that should survive a reload: the locale route, the `#section` hash and `/go/[slug]`.

### Loading and error states

- **Geolocation:** each state of the machine renders its own UI, from the spinner to the retry and permission messages. Reverse geocoding falls back to an on-device lookup when the API is unreachable.
- **Login (demo):** inline validation errors with focus management, and a submitting state.
- **Media:** if the hero video can't load (or on phones), the section's artwork shows instead. Images are served with responsive sizes as AVIF/WebP.
- **Offline:** an offline banner, cached pages and images, and a dedicated `/offline` page.
- **Unknown URLs** get a 404 page.

### OS-aware downloads

`lib/platform.ts` detects the OS from User-Agent Client Hints, falling back to the UA string (iPadOS counts as a phone). Mac chip detection uses `getHighEntropyValues(["architecture"])` where Chromium supports it; other browsers get the chooser. The server renders a neutral label and switches after hydration (`useSyncExternalStore`), so there's no hydration mismatch. Installer URLs are WeGame's official ones (`data/downloads.ts`).

### CSS architecture

Design tokens (colours, type scale, spacing, motion, `--u`) are global custom properties in `src/styles/tokens.css`. Every component has a co-located CSS Module, written mobile first around one main breakpoint (desktop from 1025px). Components don't style each other's internals; where one needs to react to another's state, it goes through data and ARIA attributes such as `data-current`, `data-active` and `aria-expanded`.

### Accessibility

- Semantic landmarks, and section titles as real, translatable text (the Chinese hero slogan uses artwork with an `alt` text)
- WAI-ARIA tabs with a roving tabindex that pause auto-advance on focus
- Disclosure menus that close on Escape or an outside click and return focus
- Native radio inputs for the squad picker and native `<dialog>` for modals
- `aria-current` on the rail and a QR popover that also opens on keyboard focus

## PWA and offline strategy

`public/sw.js` is about 150 lines, written by hand so every caching decision is visible.

| Request | Strategy |
|---|---|
| Navigations | Network-first, then the cached page, then `/offline` |
| `/_next/static/*` | Cache-first (content-hashed and immutable) |
| `/images/*`, `/icons/*`, `/_next/image` | Stale-while-revalidate; offline, any cached width of the same image is served |
| Cross-origin (videos, geocoding API, installers) | Not intercepted |

- **Install** precaches `/`, `/en`, `/ms`, `/id` and `/offline`, parses their HTML for the hashed chunk URLs and caches those too, so every language works offline straight away.
- **Versioning:** the worker is registered as `/sw.js?v=<commit SHA>`, so each deploy installs a fresh worker that deletes the previous cache. `/sw.js` is served with `Cache-Control: no-cache`.
- **Development:** the worker is registered in production builds only. In dev the app unregisters any worker left by an earlier `npm start` on the same port, so it can't serve stale files.

**To try it:** open https://we-game-clone.vercel.app/ (or run `npm run build && npm start`) and load the page once. In DevTools → Application, tick *Offline* and reload `/`, `/en`, `/ms` or `/id`; all of them render from cache. Chrome and Edge also offer **Install** in the address bar.

## Trade-offs and next steps

- **Titles as text:** the reference site renders its titles as images. Here they're real text so they can be translated, so the typeface differs slightly. Some secondary copy is written for the mockup.
- **Currency:** prices show local formatting, not converted amounts. A cached exchange-rate API would be the next step.
- **Mac chip detection** works in Chromium only; Safari and Firefox get the chooser.
- **Next steps:** Playwright end-to-end tests (paging, offline, locale switch), Lighthouse CI, and blur placeholders for the large artwork.

---

_A mock website for assessment purposes only — not affiliated with Tencent or WeGame._
