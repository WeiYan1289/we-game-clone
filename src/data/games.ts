import type { Dictionary } from "@/i18n/dictionaries";

export type GameId = keyof Dictionary["games"];

export const VIDEO_CDN = "https://wegame.gtimg.com/g.55555-r.c4663/wegame-home";

export const posterSrc = (id: GameId) => `/images/posters/${id}.png`;

/**
 * Posters floating around the "大作云集" title, positioned on the 1440×900
 * reference frame (measured from the live site). `depth` scales the mouse
 * parallax: higher = closer to the viewer = moves more.
 */
export const FLOATING_POSTERS: { id: GameId; x: number; y: number; w: number; depth: number }[] = [
  { id: "sanguosha", x: 60, y: 102, w: 170, depth: 0.6 },
  { id: "cala", x: 927, y: 168, w: 168, depth: 0.4 },
  { id: "mingchao", x: 1292, y: 66, w: 176, depth: 0.8 },
  { id: "bt", x: 204, y: 546, w: 210, depth: 1 },
  { id: "rainbow", x: 1000, y: 466, w: 152, depth: 0.5 },
  { id: "heishenhua", x: -10, y: 704, w: 143, depth: 0.9 },
  { id: "poe", x: 1319, y: 588, w: 165, depth: 0.7 },
  { id: "heping", x: 380, y: 330, w: 110, depth: 0.3 },
  { id: "df", x: 1150, y: 300, w: 120, depth: 0.35 },
];

/** Art for the three assistant panels, in the same order as `dict.feature.items`. */
export const FEATURE_ART = [
  {
    bg: "/images/feature-bg-1.png",
    role: { src: "/images/feature-role-1.png", width: 1166, height: 1000 },
    inner: { src: "/images/feature-inner-1.png", width: 1341, height: 822 },
  },
  {
    bg: "/images/feature-bg-2.png",
    role: { src: "/images/feature-role-2.png", width: 1524, height: 1045 },
    inner: { src: "/images/feature-inner-2.png", width: 980, height: 1960 },
  },
  {
    bg: "/images/feature-bg-3.png",
    role: { src: "/images/feature-role-3.png", width: 1166, height: 1000 },
    inner: { src: "/images/feature-inner-3.png", width: 603, height: 693 },
    badge: "/images/feature-ai-avatar.png",
  },
] as { bg: string; role: Art; inner: Art; badge?: string }[];

type Art = { src: string; width: number; height: number };

/** Squad picker art, in the same order as `dict.teamup.roles`. */
export const TEAM_ART = [1, 2, 3, 4, 5].map((n) => ({
  avatar: `/images/teamup-avatar-0${n}.png`,
  hero: `/images/teamup-hero-0${n}.png`,
}));
