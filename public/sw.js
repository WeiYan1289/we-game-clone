/* WeGame Portal Mockup — service worker.
 *
 * Strategy (same-origin GET requests only; everything else passes through):
 *   navigations          network-first → cached page → /offline
 *   /_next/static/*      cache-first   (content-hashed, immutable)
 *   /images, /icons,
 *   /_next/image         stale-while-revalidate
 *   everything else      network, falling back to cache
 *
 * Hotlinked videos (cross-origin) are deliberately not cached: they are ~20 MB
 * each, and the UI already degrades to its gradient backgrounds without them.
 */

// Registered as /sw.js?v=<build id>: a new deploy changes the URL, which installs
// a fresh worker whose activate step deletes the previous build's cache.
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE = `wegame-${VERSION}`;
const OFFLINE_URL = "/offline";
// Every locale's home page, so switching language works offline too.
const SHELL_PAGES = ["/", "/en", "/ms", "/id", OFFLINE_URL];
const SHELL_ASSETS = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/images/icon-logo.svg",
];

/** Pull the hashed JS/CSS chunk URLs a page needs out of its HTML. */
function staticAssetsIn(html) {
  const matches = html.match(/\/_next\/static\/[^"'\s\\)]+/g) || [];
  return [...new Set(matches)];
}

async function precache() {
  const cache = await caches.open(CACHE);
  const chunkUrls = new Set();

  for (const page of SHELL_PAGES) {
    const response = await fetch(page, { cache: "reload" });
    if (!response.ok) throw new Error(`Precache failed for ${page}: ${response.status}`);
    staticAssetsIn(await response.clone().text()).forEach((u) => chunkUrls.add(u));
    await cache.put(page, response);
  }

  // A missing optional asset must not abort installation.
  await Promise.allSettled([...SHELL_ASSETS, ...chunkUrls].map((u) => cache.add(u)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("wegame-") && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

const isCacheable = (response) => response && response.ok && response.type === "basic";

async function networkFirstPage(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (isCacheable(response)) cache.put(request, response.clone());
    return response;
  } catch {
    return (
      (await cache.match(request, { ignoreSearch: true })) ||
      (await cache.match(OFFLINE_URL)) ||
      new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })
    );
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (isCacheable(response)) cache.put(request, response.clone());
  return response;
}

/** next/image URLs differ only by width/quality; offline, any cached width will do. */
async function anyVariantOf(cache, url) {
  const source = url.searchParams.get("url");
  if (!source) return undefined;
  for (const key of await cache.keys()) {
    const keyUrl = new URL(key.url);
    if (keyUrl.pathname === "/_next/image" && keyUrl.searchParams.get("url") === source) {
      return cache.match(key);
    }
  }
  return undefined;
}

async function staleWhileRevalidate(request, url) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (isCacheable(response)) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);

  if (cached) return cached;
  const fresh = await network;
  if (fresh) return fresh;
  const variant = url.pathname === "/_next/image" ? await anyVariantOf(cache, url) : undefined;
  return variant || new Response("", { status: 504 });
}

async function networkFallingBackToCache(request) {
  try {
    return await fetch(request);
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error(`Offline and not cached: ${request.url}`);
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // hotlinked videos, geocoding API, etc.

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else if (
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/_next/image"
  ) {
    event.respondWith(staleWhileRevalidate(request, url));
  } else {
    event.respondWith(networkFallingBackToCache(request));
  }
});
