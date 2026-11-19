import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type OriginalLink = {
  /** The page on the original site (collected from wegame.com.cn's own links). */
  url: string;
  /** Human label, taken from the page's dictionary so it matches the button. */
  label: (d: Dictionary) => string;
};

const WEGAME = "https://www.wegame.com.cn";

const LEGAL_URLS = [
  "https://www.tencent.com/zh-cn/index.html",
  "https://www.qq.com/contract.shtml",
  `${WEGAME}/contract`,
  `${WEGAME}/privacy`,
  "https://privacy.qq.com/privacy-children.htm",
  "https://game.qq.com/self-discipline_pact.shtml",
  "https://developer.wegame.com/developer/static/infringement.html",
  "http://www.tencentmind.com/",
  "https://hr.tencent.com/",
  "https://kf.qq.com/index.html",
  `${WEGAME}/contact-us/`,
];

const FRIEND_URLS = ["https://indienova.com/", "https://gwb.tencent.com/", "http://ac.qq.com/", "http://v.qq.com/"];

/**
 * Every button in the mockup that leads somewhere on the real site goes via
 * an interstitial (/go/<slug>) that names the destination and links to it.
 */
export const ORIGINAL_LINKS = {
  home: { url: `${WEGAME}/home`, label: (d) => d.header.nav.home },
  store: { url: `${WEGAME}/store`, label: (d) => d.header.nav.store },
  "developer-released": { url: "https://developer.wegame.com/", label: (d) => d.header.developerMenu[0] },
  "developer-test": { url: "https://developer.wegame.com/service/test-area.html", label: (d) => d.header.developerMenu[1] },
  creator: { url: `${WEGAME}/events/video-creator-recruitment/`, label: (d) => d.header.creator },
  changelog: { url: `${WEGAME}/client/changelog`, label: (d) => d.header.changelog },
  feedback: { url: `${WEGAME}/feedback`, label: (d) => d.header.feedback },
  login: { url: `${WEGAME}/home`, label: (d) => d.header.login },
  search: { url: `${WEGAME}/store`, label: (d) => d.header.searchLabel },
  weibo: { url: "https://weibo.com/u/6068787464", label: (d) => d.footer.social.weibo },
  bilibili: { url: "https://space.bilibili.com/1208379085", label: (d) => d.footer.social.bilibili },
  ...Object.fromEntries(
    FRIEND_URLS.map((url, i) => [`friend-${i}`, { url, label: (d: Dictionary) => d.footer.friendLinks[i] }]),
  ),
  ...Object.fromEntries(LEGAL_URLS.map((url, i) => [`legal-${i}`, { url, label: (d: Dictionary) => d.footer.legal[i] }])),
} satisfies Record<string, OriginalLink> as Record<string, OriginalLink>;

export type LinkSlug = string;
export const LINK_SLUGS = Object.keys(ORIGINAL_LINKS);

/** The original store's search results page for `query` (the store itself if empty). */
export function originalSearchUrl(query: string): string {
  const q = query.trim();
  return q ? `${WEGAME}/store/games?search_key_word=${encodeURIComponent(q)}` : `${WEGAME}/store`;
}

/** URL of the interstitial for `slug` in `locale` (default locale has no prefix). */
export function goPath(locale: Locale, slug: LinkSlug, query?: string): string {
  const base = locale === DEFAULT_LOCALE ? `/go/${slug}` : `/${locale}/go/${slug}`;
  return query ? `${base}?q=${encodeURIComponent(query)}` : base;
}
